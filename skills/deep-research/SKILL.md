---
name: deep-research
description: This skill should be used when the user needs deep, multi-step web research with source synthesis, citations, skeptical evidence evaluation, confidence/gap analysis, optional Markdown report saving, and optional dense/frontier research using parallel agents.
license: MIT
---

# Deep Research

## Purpose

Run structured, multi-step web research with evidence-first synthesis, source traceability, skeptical evaluation, and explicit confidence/gap analysis.

This skill works in native mode with built-in web research tools and does not require Google/Gemini, OpenAI, Anthropic, OpenRouter, or any other paid provider setup. When the user explicitly wants maximum depth, use dense/frontier mode to recommend the strongest available model and run a wider parallel research topology where the host platform supports subagents.

## When to Use This Skill

Use this skill when:
- Performing market analysis
- Conducting competitive landscaping
- Building literature or source reviews
- Doing technical due diligence
- Preparing decision memos with citations
- Producing dense, high-confidence, Perplexity-like research with adversarial critique
- Saving a comprehensive research report as Markdown

## Requirements

- Access to built-in web research tools (`WebSearch`, `WebFetch`)
- Clear research question and scope

No external API key is required for native mode.

## Progress Tracking

Display a progress gauge at each research phase:

```
[████░░░░░░░░░░░░░░░░] 20% — Phase 1/5: Objective, Scope & Decomposition
[████████░░░░░░░░░░░░] 40% — Phase 2/5: Parallel Source Collection
[████████████░░░░░░░░] 60% — Phase 3/5: Evidence Ledger & Triangulation
[████████████████░░░░] 80% — Phase 4/5: Synthesis & Confidence/Gaps
[████████████████████] 100% — Phase 5/5: Citation Audit & Final Review
```

## Operating Modes

### Native Research

Use native mode by default.

- Use built-in `WebSearch` and `WebFetch`.
- Decompose complex topics into 3-5 sub-questions.
- Run parallel `ResearchScout` agents where subagents are available.
- Produce an evidence ledger, citations, and `Confidence & Gaps`.

### Dense / Frontier Research

Use dense/frontier mode when the user asks for maximum depth, exhaustive research, "frontier model", "Perplexity-like" research, "turbinado", adversarial review, high-confidence evidence, or says cost is secondary to research quality.

- Recommend the strongest available model or model class before execution.
- Prefer the host platform's frontier model for synthesis and critique.
- Run a wider parallel topology for sub-questions, primary-source harvesting, contrarian evidence, recency checks, citation audit, and synthesis.
- Add critique and rebuttal rounds before final synthesis.
- Increase source quota and require deeper source extraction.
- Include a model/tooling note in the final report.

If dense/frontier mode is requested but frontier tooling is unavailable, continue with native mode and disclose the limitation.

## Frontier Model Recommendation

For dense/frontier research, recommend the strongest available model before execution:

- Use an Opus-class Claude model for high-stakes synthesis, adversarial judgment, and nuanced source conflict analysis when available.
- Use a GPT frontier reasoning/chat model for broad synthesis, structured reasoning, and tool-heavy research when available.
- Use a Codex-class model for code-heavy technical research, API analysis, repository analysis, and engineering claims.
- Use a Gemini Pro-class thinking model for long-context, multimodal, PDF-heavy, and Google-grounded research when available.
- Use OpenRouter when the user wants access to multiple frontier model families through one API or wants a latest-family alias.

State the recommendation in this form:

```
Recommended research model: <model or model class>.
Reason: <why this model fits the research task>.
Fallback: <native mode or next best model>.
```

Do not hard-code one model as universally best. Use the strongest available model/tooling path and disclose limitations.

## Research Protocol

1. Define objective, scope, output destination, and decomposition
- Restate the original research question in one sentence.
- Identify audience, decision context, time horizon, geography/market scope, and requested output format.
- Ask whether to save the final report as a Markdown file unless the user already specified a destination.
- If the user wants a file and filesystem tools are available, plan to save to `research/YYYY-MM-DD-<topic-slug>.md` unless another path is requested.
- If filesystem tools are unavailable, produce the final report as Markdown in the response and state that it was not saved.
- Decompose the topic into 3-5 concrete sub-questions.
- Each sub-question must cover a distinct dimension of the original question.
- Together, the sub-questions should be sufficient to answer the main question.
- If the topic is too broad to decompose cleanly, narrow the scope before searching.

Example decomposition:
- Market landscape: who are the major players?
- Evidence base: what reliable data exists?
- Differentiation: what capabilities or positions differ?
- Risks: what claims are uncertain, contested, or under-sourced?
- Decision implication: what should the target audience do with this evidence?

2. Build search strategy by sub-question
- Create targeted query variants for each sub-question.
- Include broad, narrow, comparative, opposing, primary-source, and recent-source queries when relevant.
- Prefer sources in this order:
  1. Primary sources: official docs, filings, regulatory pages, standards bodies, government data, company pages
  2. Scholarly sources: peer-reviewed papers, preprints with clear methodology, university research
  3. Reputable secondary sources: analyst reports, established media, expert organizations
  4. Supporting context only: blogs, newsletters, aggregators, marketing pages, review sites
- Use low-authority sources only when they provide unique firsthand evidence or market/customer sentiment.

Reject or down-rank sources that:
- Do not identify publisher, author, or date when those details matter
- Make numerical claims without methodology
- Repeat another source without adding primary evidence
- Are mostly promotional unless the research question is about vendor positioning
- Conflict with stronger primary evidence

### Parallel Query Execution

Do NOT run searches sequentially. Launch one `ResearchScout` agent per sub-question or major query type simultaneously in a single block where the host platform supports subagents.

Use `references/agent-topology.md` for agent assignments, role contracts, and scout prompt templates.

### Dense / Frontier Agent Topology

When the user requests maximum-depth research, load `references/agent-topology.md` and run the dense/frontier topology. If subagents are unavailable, simulate the same roles sequentially while preserving their output contracts.

3. Build an evidence ledger
- Deduplicate sources by canonical URL.
- For each source, capture URL, title, publisher/author, publication or update date, source type, sub-question addressed, and relevance notes.
- Extract specific claims, data points, methodologies, and limitations.
- Mark claim status as `confirmed`, `contested`, `weak`, or `inferred`.
- Use `references/evidence-ledger.md` for status definitions, validation rules, and matrix templates.
- Use short direct quotes only when wording materially affects interpretation.

4. Validate, triangulate, and challenge
- Cross-check key claims with at least 2 independent credible sources where possible.
- For numerical claims, prefer original methodology or primary data.
- Identify where sources cite each other rather than independently confirming a claim.
- Surface contradictions explicitly instead of smoothing them over.
- When sources conflict, explain which source is more credible and why using recency, methodology, primary-source status, independence, and domain expertise.
- If evidence is thin, say so plainly and lower confidence.

5. Synthesize output
- Structure findings by sub-question unless the user requested another format.
- Cite every non-obvious factual claim inline.
- Separate confirmed facts, interpretations, recommendations, and unresolved gaps.
- In dense/frontier mode, include critique/rebuttal notes from `ContrarianScout` and `CitationAuditor`.
- If the user approved Markdown saving, write the final report to the agreed `.md` path and mention the saved path in the final response.

## Output Formats

Choose one based on request:

Default structure for non-trivial research:
- Objective
- Scope and assumptions
- Recommended model/tooling path, when dense/frontier mode is used
- Sub-questions
- Findings by sub-question
- Evidence matrix
- Contradictions and disputed claims
- Recommendations or implications, when requested
- Confidence & gaps
- Sources

### 1) Executive Brief
- Objective
- Top findings (5-10)
- Risks / unknowns
- Recommendations
- Confidence & gaps
- Sources

### 2) Comparative Analysis
- Criteria matrix
- Option-by-option strengths/weaknesses
- Trade-offs
- Recommendation + rationale
- Confidence & gaps
- Sources

### 3) Research Log
- Queries used
- Source inventory
- Evidence quality notes
- Open questions
- Next research steps
- Confidence & gaps

Every substantive report must close with `Confidence & Gaps`:
- Overall confidence: high / medium / low
- Strongest evidence
- Weakest evidence
- Known disagreements across sources
- Missing or inaccessible information
- Recommended follow-up research

## Markdown Report Saving

At the start of a research task, ask:

```
Do you want me to save the final research report as a Markdown file?
Default path: research/YYYY-MM-DD-<topic-slug>.md
```

Rules:
- Do not save a file unless the user explicitly agrees or requested a file upfront.
- Use lowercase kebab-case for `<topic-slug>`.
- Create the destination folder if needed and filesystem tools are available.
- Save only the final polished report, not raw agent notes.
- Include source URLs in the saved report.
- If saving fails, return the report in the response and state the failure plainly.

## Comprehensive Report Template

Use `references/report-template.md` for dense/frontier research and for any research saved to Markdown.

Load this reference only when:
- The user asks to save the research as Markdown
- Dense/frontier mode is active
- The user asks for a comprehensive research report

## Quality Bar

- Evidence before conclusions
- Date-aware and source-aware claims
- Contradictions surfaced, not hidden
- No uncited critical claims
- Claim status visible for material claims
- Dense/frontier outputs include model/tooling limitations
- Saved Markdown reports follow the comprehensive report template unless the user requests a different structure

## Time & Cost

- Native mode time: usually 5-20 minutes depending on scope
- Dense/frontier mode time: usually 15-45+ minutes depending on source count, critique rounds, and platform support
- Native mode cost: no external API cost for this skill
- Dense/frontier mode cost: depends on the host platform or selected frontier model; disclose model/tooling choice before execution

## Safety

- Never fabricate sources or citations.
- If evidence is insufficient, state it clearly.
- Distinguish confirmed facts from inference.

## Critical Rules

- Always include citations for material claims.
- Always separate facts from interpretations and recommendations.
- Always mark uncertainty explicitly when evidence is weak or conflicting.
- Do not paper over uncertainty with confident-sounding prose.
- Never claim a source was read in full unless it was actually accessible and reviewed.

## Error Handling

| Error | Likely Cause | Action |
|-------|-------------|--------|
| WebSearch returns no results | Query too specific, misspelled, or topic very niche | Broaden query, try alternate phrasing, report low-coverage finding |
| WebFetch times out or blocked | Site is down, bot-blocking, or paywalled | Skip that source, note it as inaccessible, continue with other sources |
| Insufficient sources found | Topic has limited public information | Report coverage gaps; recommend user provide domain-specific sources |
| Conflicting information across sources | Different sources cite different facts | Flag the conflict explicitly; present both sides with sources |
| Query too broad | Research question covers too many sub-topics | Ask user to narrow the scope or prioritize specific dimensions |
| Paywalled content | Article requires subscription | Note the source as paywalled; use abstract/preview if available |
| Source lacks author/date/methodology | Source quality is unclear | Use only as weak/supporting context or discard for critical claims |
| Sources cite each other circularly | Apparent agreement is not independent confirmation | Mark evidence as weak and search for primary source |
| Strong sources disagree | Different methods, dates, jurisdictions, or definitions | Present both claims, explain credibility factors, and lower confidence if unresolved |
| Too many low-quality sources | Query is attracting SEO/marketing content | Add primary-source, filetype, site, institution, or regulatory terms to query |
| Frontier model unavailable | Host platform lacks requested model/tooling | Use native mode or strongest available model and disclose limitation |
| Markdown save fails | Filesystem unavailable, path invalid, or permission denied | Return the report in the response and state that saving failed |

## Example Usage

1. "Use deep-research to compare 3 vector databases for enterprise use."
2. "Use deep-research to summarize regulatory updates from the last 12 months."
3. "Use deep-research to produce a source-backed buy-vs-build memo."
4. "Use dense deep-research with a frontier model to produce a Perplexity-like evidence report."
5. "Use dense deep-research and save the final report as Markdown."
