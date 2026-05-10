# Scripts Cleanup — Post v2.0.0 Carve-Out

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Remover 6 scripts obsoletos (pré-v1.10.4 / duplicatas), corrigir paths errados em 3 scripts shell, e atualizar todas as referências afetadas.

**Architecture:** O repo passou por carve-out em v2.0.0: 46 skills foram para repos separados. O `scripts/` acumulou débito técnico — scripts com arquitetura de symlinks (proibida pelo CLAUDE.md), detectores de apenas 2/5 plataformas das 8 suportadas, e duplicatas `.js` de geradores cujos npm scripts já apontam só para `.py`. O source-of-truth de paths é `cli-installer/lib/utils/path-resolver.js`.

**Tech Stack:** Bash, Node.js (apenas para verificação), git

---

## Resumo das mudanças

| Ação | Arquivos |
|------|---------|
| Remover 6 scripts | `install-skills.sh`, `setup-global-skills.sh`, `check-tools.sh`, `update-main-readme.sh`, `generate-catalog.js`, `generate-skills-index.js` |
| Corrigir paths | `local-install.sh` (2 paths errados), `uninstall.sh` (2 errados + 3 faltando) |
| Corrigir contagem | `install.sh` (5→8 plataformas) |
| Atualizar referência | `skills/audio-transcriber/README.md` linha 94 |
| Registrar no histórico | `CHANGELOG.md` |

---

## Task 1: Remover scripts obsoletos

**Files:**
- Delete: `scripts/install-skills.sh`
- Delete: `scripts/setup-global-skills.sh`
- Delete: `scripts/check-tools.sh`
- Delete: `scripts/update-main-readme.sh`
- Delete: `scripts/generate-catalog.js`
- Delete: `scripts/generate-skills-index.js`

**Justificativas:**
- `install-skills.sh` — cria symlinks (`ln -s`); CLAUDE.md proíbe; cobre só 2/8 plataformas
- `setup-global-skills.sh` — aponta para `$REPO/.github/skills/` e `$REPO/.claude/skills/` (gitignored); pré-v1.10.4
- `check-tools.sh` — detecta só `gh copilot` + `claude`; `lib/detector.js` já cobre 8
- `update-main-readme.sh` — nome mente; apenas imprime `echo` para stdout; sem referências
- `generate-catalog.js` — duplicata da `.py`; nenhum npm script aponta para ela
- `generate-skills-index.js` — duplicata da `.py` + lê `.github/skills/` (gitignored = output vazio)

**Step 1: Remover os 6 scripts**

```bash
cd /path/to/claude-superskills
git rm scripts/install-skills.sh \
       scripts/setup-global-skills.sh \
       scripts/check-tools.sh \
       scripts/update-main-readme.sh \
       scripts/generate-catalog.js \
       scripts/generate-skills-index.js
```

Expected: 6 arquivos marcados como deleted no `git status`.

**Step 2: Verificar que os scripts Python (fonte de verdade) existem**

```bash
ls scripts/generate-catalog.py scripts/generate-skills-index.py
```

Expected: ambos listados sem erro.

**Step 3: Verificar que nenhum workflow chama os scripts removidos**

```bash
grep -r "install-skills\|setup-global-skills\|check-tools\|update-main-readme\|generate-catalog\.js\|generate-skills-index\.js" \
  .github/workflows/ cli-installer/package.json
```

Expected: **sem output** (nenhuma referência ativa em CI/package.json).

---

## Task 2: Corrigir `local-install.sh` — paths errados

**Files:**
- Modify: `scripts/local-install.sh`

**Problema:** O `target_dir()` e o texto de ajuda têm dois paths divergentes do `cli-installer/lib/utils/path-resolver.js`:

| Plataforma | Atual em local-install.sh | Correto (path-resolver.js) |
|------------|--------------------------|---------------------------|
| codex | `~/.codex/vendor_imports/skills/skills/.curated` | `~/.codex/skills` |
| antigravity | `~/.agent/skills` | `~/.gemini/antigravity/skills` |

**Step 1: Corrigir `target_dir()` (linha ~188-193)**

Localizar o bloco:
```bash
  codex)       echo "$HOME/.codex/vendor_imports/skills/skills/.curated" ;;
  opencode)    echo "$HOME/.agent/skills" ;;
  gemini)      echo "$HOME/.gemini/skills" ;;
  antigravity) echo "$HOME/.agent/skills" ;;
```

Substituir por:
```bash
  codex)       echo "$HOME/.codex/skills" ;;
  opencode)    echo "$HOME/.agent/skills" ;;
  gemini)      echo "$HOME/.gemini/skills" ;;
  antigravity) echo "$HOME/.gemini/antigravity/skills" ;;
```

**Step 2: Corrigir o texto de ajuda (linhas ~68-75)**

Localizar:
```
  OpenAI Codex        →  ~/.codex/vendor_imports/skills/skills/.curated/
  OpenCode            →  ~/.agent/skills/
  Gemini CLI          →  ~/.gemini/skills/
  Antigravity         →  ~/.agent/skills/
```

Substituir por:
```
  OpenAI Codex        →  ~/.codex/skills/
  OpenCode            →  ~/.agent/skills/
  Gemini CLI          →  ~/.gemini/skills/
  Antigravity         →  ~/.gemini/antigravity/skills/
```

**Step 3: Verificar que os outros paths estão corretos**

```bash
grep "target_dir\|HOME\|skills" scripts/local-install.sh | grep -v "^#"
```

Expected: codex → `.codex/skills`, antigravity → `.gemini/antigravity/skills`.

---

## Task 3: Corrigir `uninstall.sh` — 2 paths errados + 3 faltando

**Files:**
- Modify: `scripts/uninstall.sh`

**Source of truth** (`cli-installer/lib/utils/path-resolver.js`):
```
copilot     → ~/.github/skills
claude      → ~/.claude/skills
codex       → ~/.codex/skills
opencode    → ~/.agent/skills
gemini      → ~/.gemini/skills
antigravity → ~/.gemini/antigravity/skills
cursor      → ~/.cursor/skills
adal        → ~/.adal/skills
```

**Problemas no `uninstall.sh`:**
- `~/.copilot/skills` ❌ → deve ser `~/.github/skills`
- `~/.opencode/skills` ❌ → deve ser `~/.agent/skills`
- Faltando: `~/.gemini/antigravity/skills`, `~/.cursor/skills`, `~/.adal/skills`

O array `platform_dirs` aparece em **dois lugares** no arquivo (funções `find_installed_skills` e `remove_skills`). Ambos precisam ser atualizados.

**Step 1: Atualizar `find_installed_skills()` (linha ~153-158)**

Localizar:
```bash
    local platform_dirs=(
        "$HOME/.copilot/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.opencode/skills"
        "$HOME/.gemini/skills"
    )
```

Substituir por:
```bash
    local platform_dirs=(
        "$HOME/.github/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.agent/skills"
        "$HOME/.gemini/skills"
        "$HOME/.gemini/antigravity/skills"
        "$HOME/.cursor/skills"
        "$HOME/.adal/skills"
    )
```

**Step 2: Atualizar `remove_skills()` (linha ~316-321)**

Localizar (mesmo padrão, segunda ocorrência):
```bash
    local platform_dirs=(
        "$HOME/.copilot/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.opencode/skills"
        "$HOME/.gemini/skills"
    )
```

Aplicar a mesma substituição do Step 1.

**Step 3: Atualizar o texto de ajuda (linhas ~103-107)**

Localizar:
```
    • Installed skills in ~/.copilot/skills/
    • Installed skills in ~/.claude/skills/
    • Installed skills in ~/.codex/skills/
    • Installed skills in ~/.opencode/skills/
    • Installed skills in ~/.gemini/skills/
```

Substituir por:
```
    • Installed skills in ~/.github/skills/
    • Installed skills in ~/.claude/skills/
    • Installed skills in ~/.codex/skills/
    • Installed skills in ~/.agent/skills/
    • Installed skills in ~/.gemini/skills/
    • Installed skills in ~/.gemini/antigravity/skills/
    • Installed skills in ~/.cursor/skills/
    • Installed skills in ~/.adal/skills/
```

**Step 4: Verificar**

```bash
grep -n "copilot\|opencode\|agent\|cursor\|adal\|antigravity\|github" scripts/uninstall.sh
```

Expected: sem `~/.copilot/skills`, sem `~/.opencode/skills`; presença de `~/.github/skills`, `~/.agent/skills`, `~/.cursor/skills`, `~/.adal/skills`, `~/.gemini/antigravity/skills`.

---

## Task 4: Corrigir `install.sh` — contagem 5→8

**Files:**
- Modify: `scripts/install.sh`

**Problema:** Linha 443 diz `Detected ${installed_count}/5 AI CLI tools`. O repo suporta 8 plataformas. A função `detect_ai_tools()` (linha 284) detecta apenas 5 (Copilot, Claude, Codex, OpenCode, Gemini) — faltam Antigravity, Cursor, AdaL.

**Step 1: Corrigir a string de contagem (linha 443)**

Localizar:
```bash
        print_info "Detected ${installed_count}/5 AI CLI tools on your system"
```

Substituir por:
```bash
        print_info "Detected ${installed_count}/8 AI CLI tools on your system"
```

**Step 2: Adicionar detecção de Antigravity na `detect_ai_tools()` (após linha ~334)**

Localizar o bloco de Gemini CLI (que termina com um `fi`) e adicionar logo após:

```bash
    # Antigravity
    if command -v antigravity &> /dev/null || command -v agy &> /dev/null \
       || [[ -d "$HOME/.gemini/antigravity/skills" ]]; then
        echo "antigravity"
        verbose "Found: Antigravity"
    else
        verbose "Not found: Antigravity"
    fi

    # Cursor IDE
    if command -v cursor &> /dev/null || [[ -d "$HOME/.cursor/skills" ]]; then
        echo "cursor"
        verbose "Found: Cursor IDE"
    else
        verbose "Not found: Cursor IDE"
    fi

    # AdaL CLI
    if command -v adal &> /dev/null || [[ -d "$HOME/.adal/skills" ]]; then
        echo "adal"
        verbose "Found: AdaL CLI"
    else
        verbose "Not found: AdaL CLI"
    fi
```

**Step 3: Adicionar labels para as 3 novas plataformas no `display_name` (linha ~357)**

Localizar:
```bash
            gemini) display_name="Gemini CLI" ;;
```

Adicionar após:
```bash
            antigravity) display_name="Antigravity" ;;
            cursor) display_name="Cursor IDE" ;;
            adal) display_name="AdaL CLI" ;;
```

**Step 4: Verificar detecção**

```bash
bash -n scripts/install.sh && echo "syntax OK"
grep -n "8\|antigravity\|cursor\|adal" scripts/install.sh | head -20
```

Expected: `syntax OK`; linhas com `8`, `antigravity`, `cursor`, `adal` presentes.

---

## Task 5: Corrigir referência em `audio-transcriber/README.md`

**Files:**
- Modify: `skills/audio-transcriber/README.md` (linha 94)

**Problema:** Linha 94 instrui usar `./scripts/install-skills.sh $(pwd)` (script removido na Task 1, que criava symlinks).

**Step 1: Atualizar a linha**

Localizar:
```
./scripts/install-skills.sh $(pwd)
```

Substituir por:
```
./scripts/local-install.sh
```

**Step 2: Verificar contexto ao redor para garantir que instrução faz sentido**

```bash
sed -n '88,100p' skills/audio-transcriber/README.md
```

Expected: Parágrafo de instalação global que agora referencia `local-install.sh` sem argumentos (o script detecta platforms automaticamente).

---

## Task 6: Atualizar CHANGELOG.md

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Adicionar entrada no topo do CHANGELOG (após o cabeçalho, antes do primeiro `## [`)**

Inserir:

```markdown
## [2.0.1] - 2026-05-10

### Removed
- **`scripts/install-skills.sh`** — deprecated symlink-based installer (2 platforms only); replaced by `local-install.sh`
- **`scripts/setup-global-skills.sh`** — pointed to in-repo platform dirs (`.github/skills/`, `.claude/skills/`) that are gitignored since v1.10.4
- **`scripts/check-tools.sh`** — detected only 2/8 platforms; superseded by `cli-installer/lib/detector.js`
- **`scripts/update-main-readme.sh`** — only printed a snippet to stdout; no actual file modification
- **`scripts/generate-catalog.js`** — duplicate of `generate-catalog.py`; no npm script referenced it
- **`scripts/generate-skills-index.js`** — duplicate of `generate-skills-index.py` + read from `.github/skills/` (gitignored)

### Fixed
- **`scripts/local-install.sh`** — corrected Codex path (`~/.codex/vendor_imports/…` → `~/.codex/skills`) and Antigravity path (`~/.agent/skills` → `~/.gemini/antigravity/skills`)
- **`scripts/uninstall.sh`** — corrected Copilot path (`~/.copilot/skills` → `~/.github/skills`), OpenCode path (`~/.opencode/skills` → `~/.agent/skills`), added missing Antigravity/Cursor/AdaL platform dirs
- **`scripts/install.sh`** — updated platform count from 5→8; added Antigravity, Cursor, AdaL detection to `detect_ai_tools()`
- **`skills/audio-transcriber/README.md`** — replaced reference to removed `install-skills.sh` with `local-install.sh`
```

**Step 2: Verificar que a entrada foi inserida corretamente**

```bash
head -40 CHANGELOG.md
```

Expected: entrada `[2.0.1]` visível no topo.

---

## Task 7: Commit

**Step 1: Verificar estado do git**

```bash
git status
git diff --stat
```

Expected: 6 deletions, modificações em `local-install.sh`, `uninstall.sh`, `install.sh`, `audio-transcriber/README.md`, `CHANGELOG.md`.

**Step 2: Stage e commit**

```bash
git add scripts/local-install.sh \
        scripts/uninstall.sh \
        scripts/install.sh \
        skills/audio-transcriber/README.md \
        CHANGELOG.md
git rm scripts/install-skills.sh \
       scripts/setup-global-skills.sh \
       scripts/check-tools.sh \
       scripts/update-main-readme.sh \
       scripts/generate-catalog.js \
       scripts/generate-skills-index.js
git commit -m "chore: remove 6 obsolete scripts, fix platform paths in shell installers"
```

**Step 3: Verificar que scripts removidos não existem mais**

```bash
ls scripts/ | sort
```

Expected: 17 arquivos; ausência de `install-skills.sh`, `setup-global-skills.sh`, `check-tools.sh`, `update-main-readme.sh`, `generate-catalog.js`, `generate-skills-index.js`.

---

## Critérios de Conclusão

- [ ] `scripts/` contém exatamente 17 arquivos
- [ ] `bash -n scripts/local-install.sh` → syntax OK
- [ ] `bash -n scripts/uninstall.sh` → syntax OK
- [ ] `bash -n scripts/install.sh` → syntax OK
- [ ] `grep "vendor_imports\|\.copilot/skills\|\.opencode/skills" scripts/local-install.sh scripts/uninstall.sh` → sem output
- [ ] `grep "install-skills" skills/audio-transcriber/README.md` → sem output
- [ ] `grep "install-skills\|setup-global-skills\|check-tools\|update-main-readme\|generate-catalog\.js\|generate-skills-index\.js" .github/workflows/ cli-installer/package.json` → sem output
- [ ] CHANGELOG.md contém entrada `[2.0.1]`
- [ ] `git log --oneline -1` mostra commit de limpeza
