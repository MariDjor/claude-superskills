# Skills Carve-Out Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Carve out 28 skills from `claude-superskills` into 3 focused repos: `obsidian-superskills` (6 skills), `career-superskills` (20 skills), and `avanade-superskills` (2 skills, private). Delete 3 low-value skills. Bump `claude-superskills` to v2.0.0 with 33 skills remaining.

**Architecture:** Each new repo is a full clone of the `claude-superskills` structure — complete with `cli-installer`, `scripts`, `docs`, `.github/workflows`, `.claude-plugin`, `CLAUDE.md`, `VERSIONING.md`, `CHANGELOG.md`, and `bundles.json`. The "copy everything, then adapt" strategy avoids missing files. The `avanade-superskills` repo is private and has no npm installer — install-only via Claude Code plugin.

**Tech Stack:** Node.js, npm, GitHub CLI (`gh`), Claude Code plugin model, GitHub Actions.

---

## Decisions Log

| Skill | Decision | Reason |
|-------|----------|--------|
| `code-method` | ❌ Delete | Nome genérico, sem bundle, baixo valor |
| `ai-native-product` | ❌ Delete | Overlap com `product-strategy` |
| `docling-converter` | ❌ Delete | `document-converter` cobre o caso |
| `storytelling-expert` | ✅ Fica em claude-superskills | Content/storytelling genérico |
| `slides` | ✅ Fica em claude-superskills | HTML + Chart.js, não é Avanade-branded |

---

## Skill Distribution After Carve-Out

### obsidian-superskills (6 skills) — novo repo público
`obsidian-markdown`, `obsidian-links`, `obsidian-frontmatter`, `obsidian-automation`, `obsidian-note-builder`, `obsidian-canvas`

### career-superskills (20 skills) — novo repo público
`academic-cv-builder`, `career-changer-translator`, `cover-letter-generator`, `creative-portfolio-resume`, `executive-resume-writer`, `interview-prep-generator`, `job-description-analyzer`, `linkedin-profile-optimizer`, `offer-comparison-analyzer`, `portfolio-case-study-writer`, `reference-list-builder`, `resume-ats-optimizer`, `resume-bullet-writer`, `resume-formatter`, `resume-quantifier`, `resume-section-builder`, `resume-tailor`, `resume-version-manager`, `salary-negotiation-prep`, `tech-resume-optimizer`

### avanade-superskills (2 skills) — novo repo PRIVADO, sem npm
`avanade-pptx`, `avanade-web`

### claude-superskills (33 skills) — bumpa para v2.0.0
Todos os demais: meta, planejamento, produto, pesquisa, conteúdo, UI/UX.

---

## Task 1: Criar obsidian-superskills

### 1.1 — Clonar estrutura base

```bash
cd ~/Library/CloudStorage/OneDrive-Avanade/14_Code_Projects

# Copia tudo do repo principal como base (exceto git history e artefatos)
cp -r claude-superskills obsidian-superskills
cd obsidian-superskills

# Remove git history — será um repo novo
rm -rf .git

# Remove artefatos gerados e específicos do repo original
rm -rf output/ proposta-media/ plugin-output/
rm -rf .codex/ .opencode/ .adal/ .agent/ .cursor/ .gemini/
rm -f .claude/settings.local.json
rm -f .DS_Store

# Remove planos internos do repo original
rm -rf docs/plans/ docs/plan/
```

### 1.2 — Manter apenas os 6 skills Obsidian

```bash
# Dentro de obsidian-superskills/

# Remove TODOS os skills
rm -rf skills/

# Recria a pasta e copia apenas os 6 obsidian
mkdir skills
for skill in obsidian-markdown obsidian-links obsidian-frontmatter obsidian-automation obsidian-note-builder obsidian-canvas; do
  cp -r ../claude-superskills/skills/$skill skills/
done
```

**Verificar:**
```bash
ls skills/ | wc -l   # deve retornar 6
```

### 1.3 — Atualizar cli-installer/package.json

Editar `cli-installer/package.json` — substituir todos os campos com referências ao repo original:

```json
{
  "name": "obsidian-superskills",
  "version": "1.0.0",
  "description": "6 AI skills for Obsidian knowledge management — notes, wikilinks, frontmatter, automation, canvas. Works with Claude Code, GitHub Copilot, and 6 more AI platforms.",
  "main": "lib/index.js",
  "bin": {
    "obsidian-superskills": "bin/cli.js"
  },
  "scripts": {
    "test": "echo '✅ obsidian-superskills - test passed'",
    "build": "cd .. && ./scripts/build-skills.sh",
    "prebuild": "cd .. && ./scripts/build-skills.sh",
    "link": "npm link",
    "unlink": "npm unlink -g obsidian-superskills",
    "generate-index": "cd .. && python3 scripts/generate-skills-index.py",
    "generate-catalog": "cd .. && python3 scripts/generate-catalog.py",
    "generate-all": "npm run build && npm run generate-index && npm run generate-catalog",
    "prepublishOnly": "npm run build && npm test",
    "version": "git add -A"
  },
  "keywords": ["obsidian", "claude", "copilot", "ai", "skills", "cli", "knowledge-management", "note-taking", "pkm"],
  "author": "Eric Andrade",
  "license": "MIT",
  "engines": { "node": ">=14.0.0" },
  "files": ["bin/", "lib/", "README.md"],
  "dependencies": {
    "adm-zip": "^0.5.16",
    "axios": "^1.6.5",
    "chalk": "^4.1.2",
    "commander": "^11.1.0",
    "fs-extra": "^11.2.0",
    "inquirer": "^8.2.5",
    "js-yaml": "^4.1.0",
    "ora": "^5.4.1",
    "semver": "^7.5.4"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ericgandrade/obsidian-superskills.git"
  },
  "bugs": { "url": "https://github.com/ericgandrade/obsidian-superskills/issues" },
  "homepage": "https://github.com/ericgandrade/obsidian-superskills#readme"
}
```

Deletar `cli-installer/package-lock.json` — será regenerado.

### 1.4 — Atualizar cli-installer/bin/cli.js

Fazer busca-e-substituição em `cli-installer/bin/cli.js`:
- `claude-superskills` → `obsidian-superskills`
- `ericgandrade/claude-superskills` → `ericgandrade/obsidian-superskills`
- Qualquer referência ao skill count (`64 skills`, `55 skills`) → `6 skills`

### 1.5 — Atualizar cli-installer/lib/core/downloader.js

Fazer busca-e-substituição:
- `claude-superskills` → `obsidian-superskills`
- `ericgandrade/claude-superskills` → `ericgandrade/obsidian-superskills`

O campo de cache path (`~/.claude-superskills/`) pode permanecer ou ser alterado para `~/.obsidian-superskills/` — manter `~/.claude-superskills/` é aceitável se o downloader usa o nome do pacote como subdir.

### 1.6 — Atualizar .claude-plugin/plugin.json

```json
{
  "name": "obsidian-superskills",
  "version": "1.0.0",
  "description": "6 AI skills for Obsidian knowledge management — notes, wikilinks, frontmatter, automation, and canvas.",
  "author": "Eric Andrade",
  "license": "MIT",
  "skills": "skills/"
}
```

### 1.7 — Atualizar .claude-plugin/marketplace.json

```json
{
  "plugins": [
    {
      "name": "obsidian-superskills",
      "description": "6 skills for Obsidian users: note building, wikilink management, frontmatter standardization, vault automation, and canvas workspaces.",
      "source": "github",
      "repo": "ericgandrade/obsidian-superskills"
    }
  ]
}
```

### 1.8 — Atualizar bundles.json (raiz)

Substituir o conteúdo completo por:

```json
{
  "version": "1.0.0",
  "generated": "2026-05-07T00:00:00Z",
  "bundles": {
    "all": {
      "name": "All Obsidian Skills",
      "description": "Complete toolkit for Obsidian knowledge management.",
      "skills": [
        "obsidian-markdown",
        "obsidian-links",
        "obsidian-frontmatter",
        "obsidian-automation",
        "obsidian-note-builder",
        "obsidian-canvas"
      ],
      "use_cases": [
        "Creating well-structured Obsidian notes",
        "Managing wikilinks and knowledge graphs",
        "Standardizing frontmatter properties",
        "Automating vault tasks with CLI scripts",
        "Building visual workspaces with Canvas"
      ],
      "target": "Obsidian users, knowledge workers, researchers"
    }
  }
}
```

### 1.9 — Atualizar scripts/release.js

Fazer busca-e-substituição:
- `Claude Superskills` → `Obsidian Superskills`
- `claude-superskills` → `obsidian-superskills`

### 1.10 — Atualizar README.md

Substituir conteúdo do README.md:
- Título: `# 🧠 Obsidian Superskills v1.0.0`
- Badge de versão: `version-1.0.0`
- Skill count badge: `skills-6`
- Descrição: foco em Obsidian knowledge management
- Tabela de skills: apenas os 6 obsidian
- Instruções de install: `npx obsidian-superskills`
- Links do repo: `github.com/ericgandrade/obsidian-superskills`
- Footer: `*Version 1.0.0 | May 2026*`
- Adicionar seção: `## Part of the Superskills Family` com links para `claude-superskills` e `career-superskills`

### 1.11 — Atualizar CLAUDE.md

Fazer busca-e-substituição:
- `claude-superskills` → `obsidian-superskills`
- `v1.25.0` → `v1.0.0`
- skill count: `64` → `6`
- Skill list na architecture tree: manter apenas os 6 obsidian
- npm package name: `obsidian-superskills`

### 1.12 — Atualizar CHANGELOG.md

Substituir com conteúdo inicial:
```markdown
# Changelog

## [1.0.0] - 2026-05-07

### Added
- Initial release — 6 Obsidian knowledge management skills carved out from claude-superskills v1.25.0
- obsidian-markdown: Creates well-structured Obsidian notes
- obsidian-links: Manages wikilinks and knowledge graphs
- obsidian-frontmatter: Standardizes frontmatter properties
- obsidian-automation: Automates vault tasks via CLI scripts
- obsidian-note-builder: Builds structured notes from templates
- obsidian-canvas: Creates visual workspaces with Obsidian Canvas
```

### 1.13 — Atualizar .github/workflows/publish-npm.yml

Substituir `claude-superskills` por `obsidian-superskills`. Remover o step `Deprecate old cli-ai-skills package` (não aplicável).

### 1.14 — Atualizar docs/

- `docs/INSTALLATION.md` — substituir nome do pacote e URLs
- `docs/guides/getting-started.md` — substituir nome e skill list
- `docs/guides/skill-anatomy.md` — substituir referências ao repo
- `docs/bundles/bundles.md` — substituir com bundles do obsidian

### 1.15 — Reinstalar dependências do cli-installer

```bash
cd cli-installer
npm install
cd ..
```

### 1.16 — Inicializar git e criar repo no GitHub

```bash
git init
git add .
git commit -m "feat: initial release v1.0.0 — 6 Obsidian skills carved out from claude-superskills"

gh repo create ericgandrade/obsidian-superskills \
  --public \
  --description "6 AI skills for Obsidian knowledge management — notes, wikilinks, frontmatter, automation, and canvas"

git remote add origin https://github.com/ericgandrade/obsidian-superskills.git
git branch -M main
git push -u origin main
git tag v1.0.0
git push origin v1.0.0
```

Tag push aciona o GitHub Actions workflow → publica no npm automaticamente.

**Verificar:**
```bash
# Aguardar ~2min para o Actions completar, depois:
npx obsidian-superskills --version   # deve retornar 1.0.0
claude --plugin-dir ./obsidian-superskills   # deve carregar 6 skills
```

---

## Task 2: Criar career-superskills

### 2.1 — Clonar estrutura base

```bash
cd ~/Library/CloudStorage/OneDrive-Avanade/14_Code_Projects

cp -r claude-superskills career-superskills
cd career-superskills
rm -rf .git output/ proposta-media/ plugin-output/
rm -rf .codex/ .opencode/ .adal/ .agent/ .cursor/ .gemini/
rm -f .claude/settings.local.json .DS_Store
rm -rf docs/plans/ docs/plan/
```

### 2.2 — Manter apenas os 20 skills de carreira

```bash
rm -rf skills/
mkdir skills
for skill in \
  academic-cv-builder career-changer-translator cover-letter-generator \
  creative-portfolio-resume executive-resume-writer interview-prep-generator \
  job-description-analyzer linkedin-profile-optimizer offer-comparison-analyzer \
  portfolio-case-study-writer reference-list-builder resume-ats-optimizer \
  resume-bullet-writer resume-formatter resume-quantifier resume-section-builder \
  resume-tailor resume-version-manager salary-negotiation-prep tech-resume-optimizer; do
  cp -r ../claude-superskills/skills/$skill skills/
done
```

**Verificar:**
```bash
ls skills/ | wc -l   # deve retornar 20
```

### 2.3 — Atualizar cli-installer/package.json

```json
{
  "name": "career-superskills",
  "version": "1.0.0",
  "description": "20 AI skills for job search, resume optimization, and career development. Works with Claude Code, GitHub Copilot, and 6 more AI platforms.",
  "bin": { "career-superskills": "bin/cli.js" },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ericgandrade/career-superskills.git"
  },
  "bugs": { "url": "https://github.com/ericgandrade/career-superskills/issues" },
  "homepage": "https://github.com/ericgandrade/career-superskills#readme"
}
```
(manter todas as outras seções do package.json iguais ao obsidian-superskills)

Deletar `cli-installer/package-lock.json`.

### 2.4 — Atualizar cli-installer/bin/cli.js e downloader.js

Busca-e-substituição:
- `claude-superskills` → `career-superskills`
- `ericgandrade/claude-superskills` → `ericgandrade/career-superskills`
- Skill count → `20 skills`

### 2.5 — Atualizar .claude-plugin/plugin.json

```json
{
  "name": "career-superskills",
  "version": "1.0.0",
  "description": "20 AI skills for job search, resume optimization, career transitions, and professional development.",
  "author": "Eric Andrade",
  "license": "MIT",
  "skills": "skills/"
}
```

### 2.6 — Atualizar .claude-plugin/marketplace.json

```json
{
  "plugins": [
    {
      "name": "career-superskills",
      "description": "20 skills for career development: resume optimization, ATS tuning, cover letters, LinkedIn, interview prep, salary negotiation, job search, and portfolio building.",
      "source": "github",
      "repo": "ericgandrade/career-superskills"
    }
  ]
}
```

### 2.7 — Atualizar bundles.json (raiz)

```json
{
  "version": "1.0.0",
  "generated": "2026-05-07T00:00:00Z",
  "bundles": {
    "resume": {
      "name": "Resume & CV",
      "description": "Skills for building, optimizing, and tailoring resumes and CVs.",
      "skills": ["resume-tailor","resume-formatter","resume-quantifier","resume-bullet-writer",
                 "resume-section-builder","resume-ats-optimizer","resume-version-manager",
                 "executive-resume-writer","tech-resume-optimizer","academic-cv-builder",
                 "creative-portfolio-resume"],
      "target": "Job seekers, career changers"
    },
    "job-search": {
      "name": "Job Search",
      "description": "Skills for the full job search cycle: applications, interviews, and offers.",
      "skills": ["job-description-analyzer","offer-comparison-analyzer","interview-prep-generator",
                 "salary-negotiation-prep","cover-letter-generator","linkedin-profile-optimizer",
                 "career-changer-translator"],
      "target": "Active job seekers"
    },
    "portfolio": {
      "name": "Portfolio & Presence",
      "description": "Build your professional brand and online presence.",
      "skills": ["portfolio-case-study-writer","reference-list-builder",
                 "linkedin-profile-optimizer","creative-portfolio-resume"],
      "target": "Creatives, consultants, executives"
    },
    "all": {
      "name": "All Career Skills",
      "description": "Complete career development toolkit — all 20 skills.",
      "skills": ["academic-cv-builder","career-changer-translator","cover-letter-generator",
                 "creative-portfolio-resume","executive-resume-writer","interview-prep-generator",
                 "job-description-analyzer","linkedin-profile-optimizer","offer-comparison-analyzer",
                 "portfolio-case-study-writer","reference-list-builder","resume-ats-optimizer",
                 "resume-bullet-writer","resume-formatter","resume-quantifier","resume-section-builder",
                 "resume-tailor","resume-version-manager","salary-negotiation-prep","tech-resume-optimizer"],
      "target": "All career stages"
    }
  }
}
```

### 2.8 — Atualizar scripts/release.js, README.md, CLAUDE.md, CHANGELOG.md, docs/

Mesmas substituições que Task 1.9–1.14, com:
- `Obsidian Superskills` → `Career Superskills`
- `obsidian-superskills` → `career-superskills`
- Skill count: `20 skills`
- Título: `# 💼 Career Superskills v1.0.0`

### 2.9 — Reinstalar dependências e publicar

```bash
cd cli-installer && npm install && cd ..

git init
git add .
git commit -m "feat: initial release v1.0.0 — 20 career skills carved out from claude-superskills"

gh repo create ericgandrade/career-superskills \
  --public \
  --description "20 AI skills for job search, resume optimization, and career development"

git remote add origin https://github.com/ericgandrade/career-superskills.git
git branch -M main
git push -u origin main
git tag v1.0.0 && git push origin v1.0.0
```

**Verificar:**
```bash
npx career-superskills --version    # deve retornar 1.0.0
claude --plugin-dir ./career-superskills   # deve carregar 20 skills
```

---

## Task 3: Criar avanade-superskills (privado, sem npm)

O `avanade-superskills` é mais simples — não tem cli-installer nem GitHub Actions de publicação.

### 3.1 — Criar estrutura mínima

```bash
cd ~/Library/CloudStorage/OneDrive-Avanade/14_Code_Projects
mkdir avanade-superskills && cd avanade-superskills
git init

mkdir -p skills .claude-plugin docs
```

### 3.2 — Copiar e renomear os 2 skills Avanade

Os skills existem como `ava-pptx` e `ava-web` em `claude-superskills`. Precisam ser copiados **e renomeados** para `avanade-pptx` e `avanade-web`.

```bash
# Copia com novo nome de diretório
cp -r ../claude-superskills/skills/ava-pptx skills/avanade-pptx
cp -r ../claude-superskills/skills/ava-web  skills/avanade-web
```

Atualizar o campo `name` no frontmatter de cada SKILL.md:

`skills/avanade-pptx/SKILL.md` — linha 2:
```yaml
name: avanade-pptx
```

`skills/avanade-web/SKILL.md` — linha 2:
```yaml
name: avanade-web
```

Verificar se há referências internas ao nome antigo no corpo dos SKILL.md:
```bash
grep -r "ava-pptx\|ava-web" skills/
# Se encontrar, substituir manualmente por avanade-pptx / avanade-web
```

### 3.3 — Criar .claude-plugin/plugin.json

```json
{
  "name": "avanade-superskills",
  "version": "1.0.0",
  "description": "Avanade-branded AI skills for PowerPoint and web generation following official Ava brand guidelines.",
  "author": "Eric Andrade",
  "license": "MIT",
  "skills": "skills/"
}
```

### 3.4 — Criar CLAUDE.md

```markdown
# avanade-superskills

Avanade-branded AI skills. Private repository — not published to npm.

## Skills
- `avanade-pptx` — PowerPoint presentations following Ava brand guidelines
- `avanade-web` — Web page generation following Ava brand guidelines

## Install
claude --plugin-dir ./avanade-superskills

## Version
v1.0.0
```

### 3.5 — Criar README.md, CHANGELOG.md, .gitignore, LICENSE

Copy `.gitignore` and `LICENSE` from `claude-superskills`.

README.md mínimo com install instructions e link para Avanade brand guidelines.

CHANGELOG.md:
```markdown
## [1.0.0] - 2026-05-07
- Initial release — avanade-pptx and avanade-web carved out from claude-superskills v1.25.0
```

### 3.6 — Criar repo privado e push

```bash
git add .
git commit -m "feat: initial release v1.0.0 — Avanade-branded skills"

gh repo create ericgandrade/avanade-superskills \
  --private \
  --description "Avanade-branded AI skills (internal — not published to npm)"

git remote add origin https://github.com/ericgandrade/avanade-superskills.git
git branch -M main
git push -u origin main
git tag v1.0.0 && git push origin v1.0.0
```

**Não criar GitHub Actions workflow** — sem npm publication.

**Verificar:**
```bash
claude --plugin-dir ./avanade-superskills   # deve carregar 2 skills
# Confirmar que o repo está PRIVATE no GitHub:
gh repo view ericgandrade/avanade-superskills --json visibility -q .visibility   # deve retornar PRIVATE
```

---

## Task 4: Limpar claude-superskills e bumpar para v2.0.0

### 4.1 — Deletar skills removidos

```bash
cd ~/Library/CloudStorage/OneDrive-Avanade/14_Code_Projects/claude-superskills

# Remove obsidian skills (agora em obsidian-superskills)
git rm -r skills/obsidian-markdown skills/obsidian-links skills/obsidian-frontmatter \
           skills/obsidian-automation skills/obsidian-note-builder skills/obsidian-canvas

# Remove career skills (agora em career-superskills)
git rm -r skills/academic-cv-builder skills/career-changer-translator skills/cover-letter-generator \
           skills/creative-portfolio-resume skills/executive-resume-writer skills/interview-prep-generator \
           skills/job-description-analyzer skills/linkedin-profile-optimizer skills/offer-comparison-analyzer \
           skills/portfolio-case-study-writer skills/reference-list-builder skills/resume-ats-optimizer \
           skills/resume-bullet-writer skills/resume-formatter skills/resume-quantifier \
           skills/resume-section-builder skills/resume-tailor skills/resume-version-manager \
           skills/salary-negotiation-prep skills/tech-resume-optimizer

# Remove ava skills (agora em avanade-superskills como avanade-pptx / avanade-web)
git rm -r skills/ava-pptx skills/ava-web

# Deleta skills de baixo valor (decisão 2026-05-07)
git rm -r skills/code-method skills/ai-native-product skills/docling-converter
```

**Verificar:**
```bash
ls skills/ | wc -l   # deve retornar 33
```

### 4.2 — Atualizar bundles.json

Remover dos bundles `all`, `content`, `ui-ux`, `career`, `obsidian`:
- Todos os career skills
- Todos os obsidian skills
- `avanade-pptx`, `avanade-web`
- `code-method`, `ai-native-product`, `docling-converter`

Remover completamente os bundles `career` e `obsidian` (agora são repos separados).

### 4.3 — Bumpar para v2.0.0

```bash
node scripts/release.js major
```

Editar `CHANGELOG.md` — substituir o placeholder gerado pelo release.js com:
```markdown
## [2.0.0] - 2026-05-07

### Breaking Changes
- Removed 6 Obsidian skills → now available at github.com/ericgandrade/obsidian-superskills (`npx obsidian-superskills`)
- Removed 20 career/resume skills → now available at github.com/ericgandrade/career-superskills (`npx career-superskills`)
- Removed 2 Avanade-branded skills (`ava-pptx` → renamed to `avanade-pptx`, `ava-web` → renamed to `avanade-web`) → now in private repo ericgandrade/avanade-superskills

### Removed
- Deleted low-value skills: `code-method`, `ai-native-product`, `docling-converter`

### Changed
- claude-superskills is now focused: 33 skills across meta, planning, product, research, content, and UI/UX
```

### 4.4 — Atualizar README.md

- Título: `# 🤖 Claude Superskills v2.0.0`
- Skill count badge: `skills-33`
- Remover tabelas de skills removidos
- Adicionar seção `## Related Packages`:
  ```markdown
  ## Related Packages
  | Package | Skills | Focus |
  |---------|--------|-------|
  | [obsidian-superskills](https://github.com/ericgandrade/obsidian-superskills) | 6 | Obsidian knowledge management |
  | [career-superskills](https://github.com/ericgandrade/career-superskills) | 20 | Job search & career development |
  ```

### 4.5 — Atualizar CLAUDE.md

- Skill count: `64` → `33`
- Remover skills da architecture tree
- Adicionar referências aos novos repos em "Related Packages"
- Atualizar versão: `v1.25.0` → `v2.0.0`

### 4.6 — Atualizar GitHub About

```bash
gh repo edit ericgandrade/claude-superskills \
  --description "33 Universal AI Skills for Claude Code, GitHub Copilot & 6 more platforms. Planning, orchestration, product strategy, research, UI/UX and content workflows."
```

### 4.7 — Commit, tag, push

```bash
git add .
git commit -m "feat!: carve out obsidian/career/ava skills into dedicated repos — bump to v2.0.0"
git tag v2.0.0
git push origin main && git push origin v2.0.0
```

---

## Validation Checklist Final

Execute cada check antes de considerar o plano concluído:

```bash
# obsidian-superskills
npx obsidian-superskills --version              # → 1.0.0
ls ~/Library/CloudStorage/.../obsidian-superskills/skills/ | wc -l   # → 6
claude --plugin-dir ./obsidian-superskills      # carrega 6 skills sem erro
gh repo view ericgandrade/obsidian-superskills --json visibility -q .visibility  # → PUBLIC

# career-superskills
npx career-superskills --version               # → 1.0.0
ls ~/Library/CloudStorage/.../career-superskills/skills/ | wc -l     # → 20
claude --plugin-dir ./career-superskills       # carrega 20 skills sem erro
gh repo view ericgandrade/career-superskills --json visibility -q .visibility    # → PUBLIC

# avanade-superskills
ls ~/Library/CloudStorage/.../avanade-superskills/skills/ | wc -l        # → 2
claude --plugin-dir ./avanade-superskills          # carrega 2 skills sem erro
gh repo view ericgandrade/avanade-superskills --json visibility -q .visibility       # → PRIVATE

# claude-superskills
npx claude-superskills --version               # → 2.0.0
ls ~/Library/CloudStorage/.../claude-superskills/skills/ | wc -l     # → 33
claude --plugin-dir ./claude-superskills       # carrega 33 skills sem erro

# npm packages visíveis
npm view obsidian-superskills version          # → 1.0.0
npm view career-superskills version            # → 1.0.0
npm view avanade-superskills 2>/dev/null || echo "NOT PUBLISHED (correct)"  # → NOT PUBLISHED
```
