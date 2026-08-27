# Product Specification & Context

## 1. Vision & Strategy
* **Core Value Proposition**: An interactive experience that lets visitors rate real AI use cases (human vs. AI/robot), see a personalized "AI attitude profile," and compare it against friends and the broader visitor pool — turning an abstract, polarized debate into something personal and legible.
* **Overarching Goal**: Beyond the consumer experience itself, this product is a portfolio piece — the primary purpose of building and launching it is to demonstrate product/design craft to **recruiters and product design hiring managers** and generate hiring conversations. Product decisions should hold up to consumer usage *and* be defensible/legible as case-study material (see [docs/launch-plan.md](docs/launch-plan.md) for the recruiter-facing launch track).
* **Target Audience**:
  * Primary (product usage): Millennials & Gen Z consumers (U.S.) who are curious about AI's role in their lives but lack a structured, engaging way to articulate or compare their own attitudes toward it.
  * Secondary (real objective): Recruiters and product design hiring managers evaluating the work as evidence of craft — they engage via a case study and launch narrative, not necessarily the rating flow itself.
* **Success Metrics**:
  * Consumer funnel: ≥55% of visitors complete more than 5 bundles of rating AND click through to the AI Impact Explainer; ≥20% of completers share their individual results or the aggregate visualization externally; ≥30% of new visitors arrive via a shared link (referral-driven growth)
  * Recruiter funnel: case study / portfolio traffic, inbound recruiter/hiring-manager contact, interview requests referencing the project — these are the metrics that matter for the overarching goal; consumer metrics above are supporting evidence, not the end in themselves

## 2. Core Features & Scope
* **User Authentication**: None. v1 is fully anonymous and session-based — no sign-up, login, or persisted visitor identity. All ratings are written anonymously to Supabase.
* **Primary Workflows**:
  * **Rating a bundle**: Visitor is served a randomized bundle of 10 use cases (first-time visitors get 10 featured use cases, 2 from each of 5 domains) -> Visitor rates each on a 0–3 scale (Never/Some/Most/Always) with domain badges visible and a back button to revise -> Visitor sees their cumulative individual results and can continue rating another bundle if desired.
  * **Viewing results & comparison**: Visitor completes/stops a bundle -> App renders an archetype narrative summary + per-domain visualization from cumulative ratings, then (after individual results, to avoid anchoring bias) a comparison to a friend's shared results (default) or the aggregate of all visitors (once the 25-response minimum threshold is met) -> Visitor sees where they agree/disagree with peers.
  * **Sharing**: Visitor completes a results view -> Clicks "Share"/"Copy link" -> A unique URL encoding their result profile is generated, with OG meta tags for rich previews on X, Instagram, and iMessage -> A new visitor opening that link sees the sharer's profile and is prompted to take the experience themselves, with their eventual results compared back against the sharer.
* **Out of Scope**:
  * Not a research/survey platform — no rigorous sampling, demographic weighting, or longitudinal tracking in v1 (lightweight optional demographic self-report is a P1, not v1, feature)
  * Not a debate/discussion platform — no comments, threads, or social reactions between visitors
  * Not a product recommendation engine — the app never suggests AI tools to try based on ratings
  * Not account-based — no sign-up/login; identity is not persisted across sessions
  * Not a native mobile app — web app only for v1

## 3. Product Persona & User Experience (UX)
* **Tone & Voice**: Jargon-free, plain-language, editorially curated — "what your informed friend would tell you," not a Wikipedia article or academic survey. Approachable for someone with no prior AI knowledge.
* **UI Design Token Anchors**: Refer to global theme styles when generating components.
* **UX Principles**:
  * Prioritize low-latency interactions over complex animations — results must appear within 2 seconds of the final rating in a bundle.
  * Fail gracefully with descriptive, non-technical error messages.
  * Never prime responses: aggregate/comparison data and optional impact-context content are only shown *after* the visitor submits ratings, never before.
  * Make results legible at a glance — an archetype plus a per-domain visualization, not a raw list of scores.
  * Touch and mouse compatible throughout the rating interaction.

## 4. Business & Domain Rules
* **Strict Calculations**: Rating scale is fixed at 0–3 (Never · Some · Most · Always), no neutral midpoint, describing whether a human or an AI/robot should perform a use case — this scale is not configurable per use case.
* **Data Guardrails**:
  * No PII is ever collected or stored; all ratings are anonymous and stored server-side in Supabase.
  * If/when demographic self-report (P1) is added, it stores only age range, gender, and region — no PII — and is always optional/skippable.
  * Aggregate data is only surfaced once a minimum of 25 respondents has been reached; below that threshold, the aggregate data legend and signifier is hidden rather than showing aggregate data.
  * Domains, subdomains, and use cases are configurable Supabase records, not hardcoded structures — new domains/use cases must be addable via new records only, with no schema changes or re-deploys required.
* **Term Glossary**:
  * `Domain`: A top-level category grouping related AI use cases (e.g., a creative or professional life area); the organizing structure for content, schema, and analytics.
  * `Subdomain`: A finer-grained grouping within a domain, used for content organization but not surfaced as a separate step in the visitor-facing rating flow.
  * `Use case`: A single, discrete AI application statement that a visitor rates on the 0–3 scale (103 total at time of writing).
  * `Bundle`: A set of 10 use cases served to a visitor in one rating pass, drawn across domains/subdomains without regard to category (first-time visitors get a fixed featured bundle of 10 across 5 domains).
  * `Archetype`: A categorization of a visitor's overall AI attitude profile, derived from their cumulative ratings via defined archetype logic.
  * `Aggregate view`: The comparison of a visitor's ratings against all prior visitors' ratings, only shown once the 25-response threshold is met.
  * `Featured first-time visitor use cases`: The fixed set of 10 use cases (2 per domain, across 5 domains) flagged in the database and served to a visitor's first bundle, rather than a random draw.

## 5. Feature Implementation Workflow
* **Step 1 - Planning**: Write a 3-sentence functional design doc before modifying files.
* **Step 2 - Verification**: Define explicit acceptance criteria first.
* **Step 3 - Surgical Execution**: Change only the files strictly required by the user story.
