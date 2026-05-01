---
name: code-method
description: This skill should be used when the user wants an overview of the CODE Method (Context Oriented Development for Enterprises) — a structured SDLC framework with 9 specialized agents and 8 workflow phases covering discovery, planning, architecture, UX, stories, sprint management, implementation, and code review. Use when unsure which CODE Method skill to invoke, or when setting up the methodology on a new project.
license: MIT
---

## Purpose

The **CODE Method** (Context Oriented Development for Enterprises) is a structured software development methodology that guides teams through the full SDLC using specialized AI agents and conversational workflows. It replaces ad-hoc prompting with repeatable, quality-gated phases — from product discovery to deployment.

## When to Use

- Starting a new software project and unsure where to begin
- Onboarding a team to the CODE Method framework
- Exploring which agent or workflow to use for a specific task
- Setting up the methodology config for a project (`config.yaml`)
- Navigating between phases of an existing project

## The 9 Agents

Each CODE Method skill embodies a specialized agent persona:

| Agent | Name | Role | Skill |
|-------|------|------|-------|
| Analyst | **Mary** | Discovery & market analysis | `code-brief` |
| Product Manager | **James** | PRD creation and validation | `code-prd` |
| Architect | **William** | Architecture decisions | `code-architecture` |
| UX Designer | **Sophie** | User experience planning | `code-ux` |
| Product Owner | **Patricia** | Epics & stories | `code-stories` |
| Scrum Master | **Robert** | Sprint planning & tracking | `code-sprint` |
| Developer | **Tom** | Story implementation | `code-dev` |
| QA Engineer | **Carol** | Adversarial code review | `code-review` |
| Orchestrator | **Alex** | Multi-agent coordination | `code-method` |

## Workflow

### Step 1: Identify Project State

Determine which SDLC phase the project is in:

```
Greenfield (new project):
  → code-brief → code-prd → code-ux → code-architecture
  → code-stories → code-sprint → [loop] code-dev → code-review

Brownfield (existing codebase):
  Small change: → code-dev (quick mode)
  Large change: → code-prd → code-architecture → code-stories → code-sprint → code-dev → code-review

Quick win / bug fix:
  → code-dev (quick-dev mode, no planning needed)
```

### Step 2: Configure the Project

Create `.code-method/config.yaml` at the project root:

```yaml
# CODE Method Configuration
user_name: "Your Name"
communication_language: "en-US"
output_folder: "docs"
artifacts_folder: ".code-output"

settings:
  show_reasoning_chain: true
  require_elicitation: true
  auto_save_outputs: true

naming:
  prd_prefix: "PRD-"
  story_prefix: "STORY-"
  epic_prefix: "EPIC-"
  adr_prefix: "ADR-"
```

### Step 3: Run the Appropriate Skill

Present the user with the full menu based on their project state:

**Discovery Phase:**
- `code-brief` — Create a lightweight product brief before committing to a full PRD
- `code-prd` — Create, validate, or edit a Product Requirements Document

**Design Phase:**
- `code-ux` — Plan user experience, journeys, and design system decisions
- `code-architecture` — Make architectural decisions (tech stack, patterns, structure)

**Planning Phase:**
- `code-stories` — Decompose PRD + Architecture into epics and implementation-ready stories
- `code-sprint` — Populate and track sprint status from epics

**Implementation Phase:**
- `code-dev` — Implement a story (full mode) or execute a quick task (quick-dev mode)
- `code-review` — Run adversarial code review before merge

### Step 4: Quality Gates

Enforce these gates before advancing phases:

| Gate | Requirement |
|------|------------|
| Before Architecture | PRD validated (>85% score, no critical gaps) |
| Before Stories | PRD + Architecture both complete |
| Before Sprint | Epics and stories created in `epics.md` |
| Before Merge | Code review completed, 0 critical issues, >80% test coverage |

## Critical Rules

- NEVER skip the Product Brief + PRD phase for projects >1 day of development
- ALWAYS configure `config.yaml` before starting a new project
- NEVER merge code that has not passed `code-review`
- ALWAYS use `code-dev` quick mode for tasks <1 day; full mode for tasks >1 day
- NEVER start architecture before the PRD exists and is validated
- ALWAYS save artifacts to the configured `artifacts_folder`

## Example Usage

```
User: "I need to build a new SaaS product"
→ Invoke code-method, then route to code-brief → code-prd

User: "Which CODE Method skill handles sprint tracking?"
→ Describe code-sprint, provide usage example

User: "Set up CODE Method on my project"
→ Create .code-method/config.yaml, explain the agent roster and workflow sequence

User: "I have a PRD and architecture done, what's next?"
→ Route to code-stories

User: "Quick bug fix needed"
→ Route to code-dev (quick-dev mode)
```
