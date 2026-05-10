# Scripts Cleanup — Post v2.0.0 Carve-Out

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Remove 6 obsolete scripts (pre-v1.10.4 / duplicates), fix incorrect paths in 3 shell scripts, and update all affected references.

**Architecture:** The repo went through a carve-out in v2.0.0: 46 skills moved to separate repos. The `scripts/` directory accumulated technical debt — scripts with symlink architecture (prohibited by CLAUDE.md), detectors covering only 2/5 of the 8 supported platforms, and `.js` duplicates of generators whose npm scripts already point only to `.py`. The path source of truth is `cli-installer/lib/utils/path-resolver.js`.

**Tech Stack:** Bash, Node.js (for verification only), git

---

## Summary of Changes

| Action | Files |
|------|---------|
| Remove 6 scripts | `install-skills.sh`, `setup-global-skills.sh`, `check-tools.sh`, `update-main-readme.sh`, `generate-catalog.js`, `generate-skills-index.js` |
| Fix paths | `local-install.sh` (2 wrong paths), `uninstall.sh` (2 wrong + 3 missing) |
| Fix count | `install.sh` (5→8 platforms) |
| Update reference | `skills/audio-transcriber/README.md` line 94 |
| Record in history | `CHANGELOG.md` |

---

## Task 1: Remover scripts obsoletos

**Files:**
- Delete: `scripts/install-skills.sh`
- Delete: `scripts/setup-global-skills.sh`
- Delete: `scripts/check-tools.sh`
- Delete: `scripts/update-main-readme.sh`
- Delete: `scripts/generate-catalog.js`
- Delete: `scripts/generate-skills-index.js`

**Rationale:**
- `install-skills.sh` — creates symlinks (`ln -s`); CLAUDE.md prohibits this; covers only 2/8 platforms
- `setup-global-skills.sh` — points to `$REPO/.github/skills/` and `$REPO/.claude/skills/` (gitignored); pre-v1.10.4
- `check-tools.sh` — detects only `gh copilot` + `claude`; `lib/detector.js` already covers 8
- `update-main-readme.sh` — misleading name; only prints `echo` to stdout; no references
- `generate-catalog.js` — duplicate of `.py`; no npm script points to it
- `generate-skills-index.js` — duplicate of `.py` + reads `.github/skills/` (gitignored = empty output)

**Step 1: Remove the 6 scripts**

```bash
cd /path/to/claude-superskills
git rm scripts/install-skills.sh \
       scripts/setup-global-skills.sh \
       scripts/check-tools.sh \
       scripts/update-main-readme.sh \
       scripts/generate-catalog.js \
       scripts/generate-skills-index.js
```

Expected: 6 files marked as deleted in `git status`.

**Step 2: Verify that the Python scripts (source of truth) exist**

```bash
ls scripts/generate-catalog.py scripts/generate-skills-index.py
```

Expected: both listed without error.

**Step 3: Verify that no workflow calls the removed scripts**

```bash
grep -r "install-skills\|setup-global-skills\|check-tools\|update-main-readme\|generate-catalog\.js\|generate-skills-index\.js" \
  .github/workflows/ cli-installer/package.json
```

Expected: **no output** (no active references in CI/package.json).

---

## Task 2: Corrigir `local-install.sh` — paths errados

**Files:**
- Modify: `scripts/local-install.sh`

**Problem:** The `target_dir()` function and help text have two paths that diverge from `cli-installer/lib/utils/path-resolver.js`:

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

**Step 3: Verify that the other paths are correct**

```bash
grep "target_dir\|HOME\|skills" scripts/local-install.sh | grep -v "^#"
```

Expected: codex → `.codex/skills`, antigravity → `.gemini/antigravity/skills`.

---

## Task 3: Corrigir `uninstall.sh` — 2 paths errados + 3 faltando

**Files:**
- Modify: `scripts/uninstall.sh`

**Source of truth** (`cli-installer/lib/utils/path-resolver.js`) — no change needed here, already in English
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

**Issues in `uninstall.sh`:**
- `~/.copilot/skills` ❌ → should be `~/.github/skills`
- `~/.opencode/skills` ❌ → should be `~/.agent/skills`
- Missing: `~/.gemini/antigravity/skills`, `~/.cursor/skills`, `~/.adal/skills`

The `platform_dirs` array appears in **two places** in the file (functions `find_installed_skills` and `remove_skills`). Both need to be updated.

**Step 1: Update `find_installed_skills()` (line ~153-158)**

Locate:
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

**Step 2: Update `remove_skills()` (line ~316-321)**

Locate (same pattern, second occurrence):
```bash
    local platform_dirs=(
        "$HOME/.copilot/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.opencode/skills"
        "$HOME/.gemini/skills"
    )
```

Apply the same replacement from Step 1.

**Step 3: Update the help text (lines ~103-107)**

Locate:
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

Expected: no `~/.copilot/skills`, no `~/.opencode/skills`; presence of `~/.github/skills`, `~/.agent/skills`, `~/.cursor/skills`, `~/.adal/skills`, `~/.gemini/antigravity/skills`.

---

## Task 4: Corrigir `install.sh` — contagem 5→8

**Files:**
- Modify: `scripts/install.sh`

**Problem:** Line 443 says `Detected ${installed_count}/5 AI CLI tools`. The repo supports 8 platforms. The `detect_ai_tools()` function (line 284) detects only 5 (Copilot, Claude, Codex, OpenCode, Gemini) — Antigravity, Cursor, AdaL are missing.

**Step 1: Corrigir a string de contagem (linha 443)**

Localizar:
```bash
        print_info "Detected ${installed_count}/5 AI CLI tools on your system"
```

Substituir por:
```bash
        print_info "Detected ${installed_count}/8 AI CLI tools on your system"
```

**Step 2: Add Antigravity detection to `detect_ai_tools()` (after line ~334)**

Locate the Gemini CLI block (ending with `fi`) and add right after:

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

**Step 3: Add labels for the 3 new platforms in `display_name` (line ~357)**

Locate:
```bash
            gemini) display_name="Gemini CLI" ;;
```

Add after:
```bash
            antigravity) display_name="Antigravity" ;;
            cursor) display_name="Cursor IDE" ;;
            adal) display_name="AdaL CLI" ;;
```

**Step 4: Verify detection**

```bash
bash -n scripts/install.sh && echo "syntax OK"
grep -n "8\|antigravity\|cursor\|adal" scripts/install.sh | head -20
```

Expected: `syntax OK`; linhas com `8`, `antigravity`, `cursor`, `adal` presentes.

---

## Task 5: Fix reference in `audio-transcriber/README.md`

**Files:**
- Modify: `skills/audio-transcriber/README.md` (linha 94)

**Problem:** Line 94 instructs using `./scripts/install-skills.sh $(pwd)` (script removed in Task 1, which created symlinks).

**Step 1: Update the line**

Locate:
```
./scripts/install-skills.sh $(pwd)
```

Substituir por:
```
./scripts/local-install.sh
```

**Step 2: Verify surrounding context to ensure the instruction makes sense**

```bash
sed -n '88,100p' skills/audio-transcriber/README.md
```

Expected: Global installation paragraph now referencing `local-install.sh` without arguments (the script detects platforms automatically).

---

## Task 6: Atualizar CHANGELOG.md

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Add entry at the top of CHANGELOG (after the header, before the first `## [`)**

Insert:

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

**Step 2: Verify that the entry was inserted correctly**

```bash
head -40 CHANGELOG.md
```

Expected: `[2.0.1]` entry visible at the top.

---

## Task 7: Commit

**Step 1: Check git state**

```bash
git status
git diff --stat
```

Expected: 6 deletions, modifications in `local-install.sh`, `uninstall.sh`, `install.sh`, `audio-transcriber/README.md`, `CHANGELOG.md`.

**Step 2: Stage and commit**

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

**Step 3: Verify that removed scripts no longer exist**

```bash
ls scripts/ | sort
```

Expected: 17 files; absence of `install-skills.sh`, `setup-global-skills.sh`, `check-tools.sh`, `update-main-readme.sh`, `generate-catalog.js`, `generate-skills-index.js`.

---

## Completion Criteria

- [ ] `scripts/` contains exactly 17 files
- [ ] `bash -n scripts/local-install.sh` → syntax OK
- [ ] `bash -n scripts/uninstall.sh` → syntax OK
- [ ] `bash -n scripts/install.sh` → syntax OK
- [ ] `grep "vendor_imports\|\.copilot/skills\|\.opencode/skills" scripts/local-install.sh scripts/uninstall.sh` → sem output
- [ ] `grep "install-skills" skills/audio-transcriber/README.md` → sem output
- [ ] `grep "install-skills\|setup-global-skills\|check-tools\|update-main-readme\|generate-catalog\.js\|generate-skills-index\.js" .github/workflows/ cli-installer/package.json` → sem output
- [ ] CHANGELOG.md contains `[2.0.1]` entry
- [ ] `git log --oneline -1` shows cleanup commit
