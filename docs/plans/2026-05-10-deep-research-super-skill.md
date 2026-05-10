# Deep Research Super Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Upgrade `deep-research` into a stronger evidence-first research skill with two operating modes: a default native mode that preserves the current no-API workflow, and a dense/frontier mode that intentionally maximizes research depth through parallel subagents, frontier-model recommendation, deeper source harvesting, adversarial critique, and a required confidence/gaps section.

**Architecture:** Keep `skills/deep-research/SKILL.md` as the source of truth and avoid hard-coding a single provider. Native mode remains platform-agnostic and free by default. Dense/frontier mode explicitly asks the user to approve a depth-first path, recommends the strongest available model for the job, and uses parallel research agents plus critique/synthesis agents where the host platform supports subagents. Evals and README must be updated so both modes are testable and documented.

**Tech Stack:** Markdown skills, JSON eval fixtures, shell validation scripts, repository catalog/index generators.

---

## Product Assessment

### What is already strong in the current skill

- **No external API dependency:** The current skill works with native `WebSearch` / `WebFetch`, keeping cost and setup friction low.
- **Platform portability:** It avoids Claude-only fields such as `model` or `agent_toolset_20260401`, which matters because this repo targets Claude Code, Codex, GitHub Copilot, Gemini CLI, OpenCode, Antigravity, Cursor, and AdaL.
- **Parallel research pattern:** `ResearchScout` agents are a real workflow improvement for broad research because search variants do not run sequentially.
- **Traceability requirement:** The current skill already asks for URL, title, date, publisher, and relevance notes.
- **Triangulation rule:** It already requires cross-checking key claims against multiple credible sources.
- **Output flexibility:** Executive brief, comparative analysis, and research log are useful reusable output modes.
- **Error handling:** It has explicit handling for no results, blocked pages, paywalls, insufficient sources, conflicting information, and broad scope.
- **Progress gauge:** The phased progress indicator is useful for long-running research tasks.

### What the proposed prompt improves

- **Concrete decomposition:** The prompt's "3-5 concrete sub-questions" is clearer and more enforceable than the current broader search-strategy instruction.
- **Source hierarchy:** It states a stronger preference for primary sources, official docs, peer-reviewed work, and authoritative sources over blogs and aggregators.
- **Claim extraction discipline:** It asks for specific claims, data points, and attributed evidence instead of only general summaries.
- **Skeptical posture:** "Be skeptical" and "Don't paper over uncertainty" should become explicit quality rules.
- **Confidence & gaps:** A final section for disagreements, missing coverage, and weak evidence is a high-value addition.
- **Sub-question report structure:** Structuring by sub-question improves auditability for research-heavy outputs.

### What not to adopt from the proposed prompt

- **Do not add `model: claude-sonnet-4-6`:** It makes the skill Claude-specific and breaks the repo's platform-agnostic positioning.
- **Do not add `tools: agent_toolset_20260401`:** It is provider/tooling-specific and may not exist in other platforms.
- **Do not require direct quotes everywhere:** Use short quotes only when wording matters; otherwise paraphrase with attribution to reduce copyright and noise risk.
- **Do not promise full-source reading for every source:** Require careful reading of the most relevant sections and full reading only when source length/access makes it reasonable.
- **Do not remove parallel `ResearchScout` execution:** That is one of the current skill's strongest operational features.

## Target Behavior

After implementation, `deep-research` should:

- Run in native no-API mode by default.
- Offer dense/frontier mode when the user asks for maximum depth, exhaustive research, "Perplexity-like" research, "frontier model", "most rigorous", "turbinado", or similar wording.
- Decompose any complex research topic into 3-5 concrete sub-questions.
- Build source strategy by sub-question.
- Launch parallel `ResearchScout` agents for sub-questions or query variants.
- In dense/frontier mode, launch additional parallel agents for primary-source harvesting, contrarian evidence, recency checks, and critique.
- Recommend a frontier model based on task type and available platform/provider.
- Prefer primary, official, peer-reviewed, regulatory, standards, and direct vendor sources.
- Capture an evidence ledger with source metadata and claim-level notes.
- Mark each important claim as confirmed, contested, weakly supported, or inferred.
- Surface source conflicts explicitly and explain credibility judgments.
- Produce a final `Confidence & Gaps` section in every non-trivial report.
- Keep output formats flexible but make evidence and uncertainty mandatory.

## Operating Modes

### Mode 1: Native Research

Use when:

- The user does not ask for maximum depth.
- No external provider/API setup is available.
- Cost, speed, or platform portability matters.

Behavior:

- Use native `WebSearch` / `WebFetch`.
- Decompose into 3-5 sub-questions.
- Run parallel `ResearchScout` agents where subagents are available.
- Produce evidence ledger, citations, and confidence/gaps.

### Mode 2: Dense / Frontier Research

Use when:

- The user asks for the deepest possible research.
- The user says cost is secondary to research quality.
- The user asks for a "Perplexity turbinado", frontier model, exhaustive research, adversarial review, or high-confidence evidence memo.

Behavior:

- Recommend a frontier model before execution.
- Prefer the host platform's strongest available model for synthesis and critique.
- Run research in parallel by sub-question and evidence type.
- Add critique and rebuttal rounds before final synthesis.
- Increase source quota and require deeper source extraction.
- Include a model/tooling note in the final report explaining which model/path was used.

Suggested frontier-model guidance:

- Claude-heavy environment: recommend the latest Claude Opus-class model for synthesis/judgment, with Sonnet-class agents for parallel scouting when available.
- OpenAI/Codex-heavy environment: recommend the latest GPT frontier reasoning/chat model for synthesis; use Codex-class models for code-heavy technical research or repository/API analysis.
- Gemini-heavy environment: recommend Gemini Pro-class thinking model for long-context, multimodal, PDF, and Google-grounded research.
- OpenRouter-enabled environment: recommend querying the OpenRouter models endpoint or using latest-family aliases when freshness matters more than reproducibility; pin concrete model IDs for repeatable reports.

Do not hard-code one model as universally best. Ask for or infer the user's available platform, then recommend the strongest available model for the research type.

## Scope

### In scope

- Update `skills/deep-research/SKILL.md`.
- Update `skills/deep-research/README.md`.
- Update `skills/deep-research/evals/evals.json`.
- Update `skills/deep-research/evals/trigger-eval.json`.
- Regenerate `skills_index.json` and `CATALOG.md` if the generator reflects description/metadata changes.
- Optionally update `README.md` one-line description if wording changes materially.

### Out of scope

- Multi-LLM orchestration.
- External API key configuration.
- Provider adapters for OpenAI, Gemini, Claude, OpenRouter, or Codex.
- New npm installer commands.
- Version bump of the whole package unless maintainers decide this change ships as a release.

## Implementation Tasks

### Task 1: Baseline Review

**Files:**
- Read: `skills/deep-research/SKILL.md`
- Read: `skills/deep-research/README.md`
- Read: `skills/deep-research/evals/evals.json`
- Read: `skills/deep-research/evals/trigger-eval.json`

**Step 1: Inspect current skill content**

Run:

```bash
sed -n '1,260p' skills/deep-research/SKILL.md
```

Expected: current skill describes no-external-API research, native web tools, parallel `ResearchScout` agents, output formats, quality bar, and error handling.

**Step 2: Inspect current README and evals**

Run:

```bash
sed -n '1,220p' skills/deep-research/README.md
sed -n '1,240p' skills/deep-research/evals/evals.json
sed -n '1,260p' skills/deep-research/evals/trigger-eval.json
```

Expected: README and evals still describe native web research and do not yet enforce sub-question decomposition or confidence/gaps.

**Step 3: Confirm no provider-specific metadata is needed**

Search:

```bash
rg -n "model:|agent_toolset|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY|OPENROUTER_API_KEY" skills/deep-research
```

Expected: no provider-specific runtime dependency is present.

### Task 2: Strengthen Skill Description and Purpose

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Update frontmatter description**

Replace:

```yaml
description: This skill should be used when the user needs deep, multi-step research using native web tools (WebSearch/WebFetch) without external API keys.
```

With:

```yaml
description: This skill should be used when the user needs deep, multi-step web research with source synthesis, citations, skeptical evidence evaluation, and confidence/gap analysis using native web tools without external API keys.
```

**Step 2: Update title**

Replace:

```md
# Deep Research (No External API)
```

With:

```md
# Deep Research
```

**Step 3: Update purpose**

Replace the current purpose block with:

```md
Run structured, multi-step web research with evidence-first synthesis, source traceability, skeptical evaluation, and explicit confidence/gap analysis.

This skill is designed to work with native web research tools and does not require Google/Gemini, OpenAI, Anthropic, OpenRouter, or any other paid provider setup.
```

Expected: the skill still communicates no external API dependency, but the quality promise is stronger.

### Task 3: Add Sub-Question Decomposition Gate

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Replace workflow step 1**

Change the current "Define objective and output format" section so it includes:

```md
1. Define objective, scope, and decomposition
- Restate the original research question in one sentence.
- Identify audience, decision context, time horizon, geography/market scope, and requested output format.
- Decompose the topic into 3-5 concrete sub-questions.
- Each sub-question must cover a distinct dimension of the original question.
- Together, the sub-questions should be sufficient to answer the main question.
- If the topic is too broad to decompose cleanly, narrow the scope before searching.
```

**Step 2: Add decomposition examples**

Add a compact example under the step:

```md
Example decomposition:
- Market landscape: who are the major players?
- Evidence base: what reliable data exists?
- Differentiation: what capabilities or positions differ?
- Risks: what claims are uncertain, contested, or under-sourced?
- Decision implication: what should the target audience do with this evidence?
```

Expected: any future use of the skill has a mandatory decomposition stage before search.

### Task 4: Upgrade Search Strategy and Source Hierarchy

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Replace search strategy bullets**

Update "Build search strategy" to:

```md
2. Build search strategy by sub-question
- Create targeted query variants for each sub-question.
- Include broad, narrow, comparative, opposing, primary-source, and recent-source queries when relevant.
- Prefer sources in this order:
  1. Primary sources: official docs, filings, regulatory pages, standards bodies, government data, company pages
  2. Scholarly sources: peer-reviewed papers, preprints with clear methodology, university research
  3. Reputable secondary sources: analyst reports, established media, expert organizations
  4. Supporting context only: blogs, newsletters, aggregators, marketing pages, review sites
- Use low-authority sources only when they provide unique firsthand evidence or market/customer sentiment.
```

**Step 2: Add source rejection criteria**

Add:

```md
Reject or down-rank sources that:
- Do not identify publisher, author, or date when those details matter
- Make numerical claims without methodology
- Repeat another source without adding primary evidence
- Are mostly promotional unless the research question is about vendor positioning
- Conflict with stronger primary evidence
```

Expected: source quality becomes explicit and testable.

### Task 5: Keep and Refine Parallel ResearchScout Execution

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Preserve the parallel execution rule**

Keep the rule:

```md
Do NOT run searches sequentially.
```

**Step 2: Change agent mapping**

Replace the existing table with a version that supports both query-type and sub-question assignment:

```md
Launch one `ResearchScout` agent per sub-question or major query type simultaneously in a single block.

| Agent | Assignment |
|-------|------------|
| `ResearchScout-SQ1` | Research sub-question 1 with primary-source preference |
| `ResearchScout-SQ2` | Research sub-question 2 with primary-source preference |
| `ResearchScout-SQ3` | Research sub-question 3 with primary-source preference |
| `ResearchScout-Contrarian` | Find credible conflicting or critical evidence |
| `ResearchScout-Recent` | Date-filtered search for recent developments when time-sensitive |
```

**Step 3: Strengthen ResearchScout output contract**

Replace the current prompt snippet with:

```md
# ResearchScout -- Targeted Web Research Agent
Role: Execute assigned web research using WebSearch/WebFetch. Collect authoritative sources, extract claim-level evidence, identify contradictions, and return structured results.

Required output:
- Sub-question or query assignment
- Queries attempted
- Source inventory with URL, title, publisher, date, and relevance
- Key claims and data points with source attribution
- Short direct quotes only when exact wording matters
- Evidence quality notes
- Conflicts, gaps, and inaccessible/paywalled sources
```

Expected: ResearchScout outputs are structured enough for synthesis and evidence ledger construction.

### Task 5A: Add Dense / Frontier Parallel Agent Topology

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Add dense-mode topology**

Add:

```md
## Dense / Frontier Agent Topology

When the user requests maximum-depth research, run a wider parallel topology where the host platform supports subagents:

| Agent | Purpose |
|-------|---------|
| `ResearchLead` | Normalize scope, define sub-questions, assign agents, and maintain evidence standards |
| `ResearchScout-SQ1..SQ5` | Research one sub-question each with source traceability |
| `PrimarySourceHunter` | Find official docs, filings, papers, regulatory pages, datasets, and primary evidence |
| `ContrarianScout` | Find credible disagreement, failures, criticism, and negative evidence |
| `RecencyScout` | Search for recent developments and date-sensitive updates |
| `CitationAuditor` | Check whether claims are properly supported and sources are credible |
| `SynthesisJudge` | Consolidate findings, resolve conflicts, and write the final report |
```

**Step 2: Add execution rule**

Add:

```md
Launch independent scout agents in one parallel batch whenever the host platform supports subagents. If subagents are unavailable, simulate the topology sequentially while preserving the same roles and output contracts.
```

Expected: the skill explicitly parallelizes research and has a fallback when a platform does not support subagents.

### Task 5B: Add Frontier Model Recommendation Step

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Add model-selection section**

Add:

```md
## Frontier Model Recommendation

For dense/frontier research, recommend the strongest available model before execution.

Selection rules:
- Use an Opus-class Claude model for high-stakes synthesis, adversarial judgment, and nuanced source conflict analysis when available.
- Use a GPT frontier reasoning/chat model for broad synthesis, structured reasoning, and tool-heavy research when available.
- Use a Codex-class model for code-heavy technical research, API analysis, repository analysis, and engineering claims.
- Use a Gemini Pro-class thinking model for long-context, multimodal, PDF-heavy, and Google-grounded research when available.
- Use OpenRouter when the user wants access to multiple frontier model families through one API or wants a latest-family alias.

State the recommendation in this form:

`Recommended research model: <model or model class>. Reason: <why this model fits the research task>. Fallback: <native mode or next best model>.`

Do not block execution if the recommended model is unavailable. Use the strongest available model/tooling path and disclose the limitation.
```

Expected: the skill can suggest a frontier model without becoming locked to one provider.

### Task 6: Add Evidence Ledger and Claim Status

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Replace source collection section**

Update the source collection step to:

```md
3. Build an evidence ledger
- Deduplicate sources by canonical URL.
- For each source, capture URL, title, publisher/author, publication or update date, source type, sub-question addressed, and relevance notes.
- Extract specific claims, data points, methodologies, and limitations.
- Mark claim status:
  - `confirmed`: supported by strong evidence or multiple credible independent sources
  - `contested`: credible sources disagree
  - `weak`: only one weak or indirect source supports it
  - `inferred`: reasoned conclusion based on evidence, not directly stated by sources
- Use short direct quotes only when wording materially affects interpretation.
```

**Step 2: Add evidence ledger mini-template**

Add:

```md
Evidence ledger fields:
- Claim
- Status
- Source(s)
- Source quality
- Notes / limitations
```

Expected: synthesis can separate facts from interpretations and recommendations.

### Task 7: Strengthen Skeptical Validation

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Replace validation section**

Update validation to:

```md
4. Validate, triangulate, and challenge
- Cross-check key claims with at least 2 independent credible sources where possible.
- For numerical claims, prefer original methodology or primary data.
- Identify where sources cite each other rather than independently confirming a claim.
- Surface contradictions explicitly instead of smoothing them over.
- When sources conflict, explain which source is more credible and why using recency, methodology, primary-source status, independence, and domain expertise.
- If evidence is thin, say so plainly and lower confidence.
```

**Step 2: Add critical rule**

Under "Critical Rules", add:

```md
- Do not paper over uncertainty with confident-sounding prose.
```

Expected: the skill adopts the strongest skeptical instruction from the proposed prompt.

### Task 8: Upgrade Output Formats

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Add default report format**

Before the existing output format options, add:

```md
Default structure for non-trivial research:
- Objective
- Scope and assumptions
- Sub-questions
- Findings by sub-question
- Evidence matrix
- Contradictions and disputed claims
- Recommendations or implications, when requested
- Confidence & gaps
- Sources
```

**Step 2: Add required Confidence & Gaps section**

Add:

```md
Every substantive report must close with `Confidence & Gaps`:
- Overall confidence: high / medium / low
- Strongest evidence
- Weakest evidence
- Known disagreements across sources
- Missing or inaccessible information
- Recommended follow-up research
```

**Step 3: Update existing formats**

Modify Executive Brief, Comparative Analysis, and Research Log so each includes:

```md
- Confidence & gaps
```

Expected: the new prompt's strongest final-output requirement becomes mandatory across formats.

### Task 9: Update Error Handling

**Files:**
- Modify: `skills/deep-research/SKILL.md`

**Step 1: Add rows to the error handling table**

Add:

```md
| Source lacks author/date/methodology | Source quality is unclear | Use only as weak/supporting context or discard for critical claims |
| Sources cite each other circularly | Apparent agreement is not independent confirmation | Mark evidence as weak and search for primary source |
| Strong sources disagree | Different methods, dates, jurisdictions, or definitions | Present both claims, explain credibility factors, and lower confidence if unresolved |
| Too many low-quality sources | Query is attracting SEO/marketing content | Add primary-source, filetype, site, institution, or regulatory terms to query |
```

Expected: source-quality failures are handled explicitly.

### Task 10: Update README

**Files:**
- Modify: `skills/deep-research/README.md`

**Step 1: Update summary**

Replace:

```md
Multi-step research skill using native web tools (WebSearch/WebFetch) to synthesize comprehensive findings with citations — no external API keys required.
```

With:

```md
Multi-step research skill using native web tools (WebSearch/WebFetch) to decompose complex questions, gather authoritative sources, synthesize claim-level evidence, cite findings, and report confidence/gaps -- no external API keys required.
```

**Step 2: Update "What is included"**

Add bullets for:

```md
- Sub-question decomposition into 3-5 concrete research threads
- Evidence ledger with source quality notes and claim status
- Required confidence/gaps section
- Skeptical conflict handling for contradictory sources
```

**Step 3: Update "What's New"**

Add a new section:

```md
## What's New in v2.2

- **Sub-question decomposition** -- Complex topics are broken into 3-5 concrete research threads before searching
- **Evidence ledger** -- Claims are tracked with source metadata, source quality, and evidence status
- **Skeptical synthesis** -- Conflicts and weak evidence are surfaced instead of smoothed over
- **Confidence & gaps** -- Reports close with confidence level, source disagreements, and missing coverage
```

**Step 4: Update metadata version if chosen**

If maintainers want this to be a skill-level release, update:

```md
| Version | 2.2.0 |
| Updated | 2026-05-10 |
```

Expected: README reflects the upgraded skill behavior.

### Task 11: Update Evals

**Files:**
- Modify: `skills/deep-research/evals/evals.json`
- Modify: `skills/deep-research/evals/trigger-eval.json`

**Step 1: Strengthen existing eval expectations**

For each existing eval in `evals.json`, add expectations:

```json
"Output decomposes the research topic into 3-5 concrete sub-questions",
"Output includes an evidence matrix or evidence ledger",
"Output distinguishes confirmed, contested, weak, and inferred claims where relevant",
"Output closes with a confidence & gaps section"
```

**Step 2: Add a conflict-heavy eval**

Add a third eval:

```json
{
  "id": 3,
  "prompt": "Deep research whether remote work improves or reduces software engineering productivity. I need a balanced evidence review that separates peer-reviewed findings, company surveys, and opinion pieces, and explains why sources disagree.",
  "expected_output": "A balanced evidence review with sub-questions, source hierarchy, contested claims, confidence assessment, and gaps",
  "expectations": [
    "Output decomposes the topic into 3-5 concrete sub-questions",
    "Output separates peer-reviewed research, company surveys, and opinion/commentary",
    "Output identifies conflicting claims about productivity, collaboration, retention, or innovation",
    "Output explains which evidence is more credible and why",
    "Output cites sources for major claims",
    "Output includes a confidence & gaps section"
  ]
}
```

**Step 3: Update trigger eval description**

Replace:

```json
"description": "Triggers for multi-step deep research using native web tools"
```

With:

```json
"description": "Triggers for multi-step deep web research with source synthesis, citations, skeptical evaluation, and confidence/gap analysis"
```

**Step 4: Add trigger examples**

Add positive examples:

```json
{"id": 21, "query": "Deep research and compare the evidence for remote work productivity claims, including source disagreements", "should_trigger": true},
{"id": 22, "query": "Build a cited research brief on AI coding agents with confidence levels and gaps", "should_trigger": true}
```

Add negative examples:

```json
{"id": 23, "query": "Give me a quick answer: what is RAG?", "should_trigger": false},
{"id": 24, "query": "Rewrite this paragraph with citations I already have", "should_trigger": false}
```

Expected: evals now test the new behavior.

### Task 12: Update Public Descriptions and Generated Files

**Files:**
- Modify if needed: `README.md`
- Regenerate if needed: `skills_index.json`
- Regenerate if needed: `CATALOG.md`

**Step 1: Update root README description**

Find:

```md
| **deep-research** | v2.1.0 | Multi-step research workflow with citations using native web tools (no Google API required) |
```

If bumping skill version, replace with:

```md
| **deep-research** | v2.2.0 | Multi-step research workflow with sub-question decomposition, evidence ledger, citations, and confidence/gap analysis using native web tools |
```

If not bumping skill version, keep `v2.1.0` and update only the purpose text.

**Step 2: Regenerate index and catalog**

Run:

```bash
python3 scripts/generate-skills-index.py
python3 scripts/generate-catalog.py
```

Expected:

- `skills_index.json` includes the updated deep-research description.
- `CATALOG.md` includes updated generated metadata.

### Task 13: Validate Skill Content

**Files:**
- Validate: `skills/deep-research/SKILL.md`
- Validate: `skills/deep-research/evals/evals.json`
- Validate: `skills/deep-research/evals/trigger-eval.json`

**Step 1: Validate JSON**

Run:

```bash
jq empty skills/deep-research/evals/evals.json
jq empty skills/deep-research/evals/trigger-eval.json
```

Expected: both commands exit with status 0.

**Step 2: Validate skill content**

Run:

```bash
./scripts/validate-skill-content.sh skills/deep-research
```

Expected: validation completes. A word-count warning is acceptable if the skill remains below 5000 words.

**Step 3: Validate skill YAML/frontmatter**

Run:

```bash
./scripts/validate-skill-yaml.sh
```

Expected: validation passes.

**Step 4: Run build validation**

Run:

```bash
./scripts/build-skills.sh
```

Expected: build validation passes without creating platform skill directories.

### Task 14: Review Diff for Elegance and Scope

**Files:**
- Review all modified files.

**Step 1: Inspect diff**

Run:

```bash
git diff -- skills/deep-research/SKILL.md skills/deep-research/README.md skills/deep-research/evals/evals.json skills/deep-research/evals/trigger-eval.json README.md skills_index.json CATALOG.md
```

Expected:

- Changes are limited to deep-research behavior and related docs/generated metadata.
- No provider-specific API keys or model names were introduced.
- Current no-API promise remains intact.
- Parallel ResearchScout execution remains intact.
- New decomposition/evidence/confidence rules are clear but not bloated.

**Step 2: Staff-engineer check**

Confirm:

- Is the new skill more rigorous without becoming too long?
- Does it preserve portability across all supported platforms?
- Does it avoid paid/multi-LLM complexity?
- Are confidence and gaps mandatory but not repetitive?
- Does the output remain usable for executive, comparative, and research-log use cases?

**Step 3: Commit when ready**

Only after validation passes, run:

```bash
git add skills/deep-research/SKILL.md skills/deep-research/README.md skills/deep-research/evals/evals.json skills/deep-research/evals/trigger-eval.json README.md skills_index.json CATALOG.md
git commit -m "feat: strengthen deep research evidence workflow"
```

Expected: commit contains only the intended deep-research upgrade.

## Acceptance Criteria

- `deep-research` still works without external API keys.
- `SKILL.md` requires 3-5 sub-questions before substantive research.
- `SKILL.md` preserves parallel `ResearchScout` execution.
- `SKILL.md` includes authoritative source hierarchy.
- `SKILL.md` includes evidence ledger / claim status.
- `SKILL.md` requires skeptical handling of source conflicts.
- `SKILL.md` requires `Confidence & Gaps` in substantive reports.
- README documents the upgraded behavior.
- Evals test decomposition, evidence quality, source conflicts, and confidence/gaps.
- JSON validation passes.
- Skill validation passes.
- Build validation passes.
- Diff does not introduce Claude-only `model` or `agent_toolset` fields.

## Execution Handoff

Plan complete. Recommended execution path:

1. Implement Tasks 1-9 in `skills/deep-research/SKILL.md`.
2. Implement Task 10 in `skills/deep-research/README.md`.
3. Implement Task 11 in eval files.
4. Regenerate metadata only after content changes are stable.
5. Run validation and review diff before committing.
