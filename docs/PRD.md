# PRD: AI Use Case Sentiment Explorer
**Status:** Draft v0.5 — Early Exploration
**Audience:** Millennials & Gen Z consumers (U.S.)
**Stage:** Pre-design / Concept

---

## Problem Statement

As AI tooling becomes more prevalent across creative, professional, and personal domains, consumer attitudes toward AI vary widely — but there is no engaging, interactive way for people to articulate, explore, and compare their own opinions. Visitors to this app lack a structured way to understand where *they* personally draw the line between human creativity and AI-generated output, and how their views relate to those of their peers. Without this, conversations about AI's role in society remain abstract and polarized rather than nuanced and personal.

---

## Goals

1. **Prompt meaningful self-reflection** — at least 70% of visitors complete the full rating exercise (not just one or two domains).
2. **Deliver a personalized insight** — every visitor receives a unique, shareable summary of their own AI attitude profile upon completion.
3. **Make aggregate data legible** — visitors can compare their ratings to the broader pool in a way that surfaces genuine surprise or validation ("I'm more skeptical than most people my age").
4. **Educate through exposure** — visitors who complete the experience can name at least 3 AI use cases they hadn't previously considered (validated via optional post-experience prompt).
5. **Drive social sharing** — at least 20% of completers share their individual results or the aggregate visualization externally.

---

## Non-Goals

1. **Not a research or survey platform** — this is a consumer experience product, not an academic data collection tool. Rigorous sampling, demographic weighting, and longitudinal tracking are out of scope for v1. Lightweight optional demographic self-report (age range, gender, region) is in scope as a P1 feature to enable filtered aggregate views.
2. **Not a debate or opinion platform** — no comments, discussion threads, or social reactions between visitors. This is a reflective individual experience, not a forum.
3. **Not a product recommendation engine** — the app will not suggest AI tools to try based on ratings. That would shift the experience from exploratory to commercial.
4. **Not account-based** — v1 does not require sign-up or login. All data is anonymous; visitor identity is not persisted across sessions.
5. **Not a mobile-native app** — this is a web app; native iOS/Android builds are out of scope for v1.

---

## User Stories

### First-time Visitor

- As a first-time visitor, I want to understand what this experience is about within 10 seconds so that I decide whether it's worth my time.
- As a first-time visitor, I want to rate AI use cases across domains that feel relevant to my life so that I can see where I actually stand on AI.
- As a first-time visitor, I want my ratings to feel consequential and expressive — not like a boring survey — so that I stay engaged through the full experience.
- As a first-time visitor, I want to immediately see how my results compare to others like me so that I feel the experience was worth completing.
- As a first-time visitor who completes the optional self-report, I want to see how my ratings compare specifically to people who share my age range, gender, and region so that the comparison feels personally relevant rather than generic.
- As a first-time visitor who skips self-report, I want to still see a meaningful aggregate comparison against all visitors so that skipping does not diminish my results experience.

### Returning / Sharing Visitor

- As a visitor arriving via a shared link, I want to see someone else's AI attitude profile alongside my own so that I can compare our views and feel motivated to complete my own rating.
- As a visitor who completed the experience, I want a visually distinctive shareable artifact so that I can post it and invite others to compare theirs.

### Curious Explorer

- As someone unfamiliar with AI use cases, I want brief, jargon-free descriptions of each use case so that I can form an opinion without needing prior knowledge.
- As someone unfamiliar with AI use cases, I can provide feedback about a use case by clicking a button to say "I don't understand this use case"
- As someone interested in the "human V ai" debate, I want to optionally share why I wouldn't want AI to handle one of the use cases presented.
- As someone interested in the "human vs. AI creativity" debate, I want a visualization that helps me articulate my own intuitions so that I can engage more confidently in that conversation.

---

## Requirements

### P0 — Must Have

**1. AI Use Case Rating Module**
- Visitors rate each AI use case on a scale to be finalized (see Open Questions #1). Rating scale options under consideration and to be decided by Design: **(a) human ↔ AI** (where does this use case sit on the authorship spectrum?) and **(b) uneasy ↔ enthusiastic** (how do you feel about this use case?). Additional narrative framings to explore: **(c) should exist ↔ should not exist** (a normative/ethical axis), **(d) replaces humans ↔ augments humans** (a labor/agency axis), **(e) trust ↔ distrust** (a credibility axis). Each framing produces meaningfully different data and a different emotional experience for visitors — this decision is a **design team action item**.
- Use cases are organized into discrete **domains**, each with one or more **subdomains**. Confirmed domains and their subdomains, sourced from the Notion `AI-use-cases` database (103 use cases total): **Healthcare** (Diagnostics, Mental Health, Wellness & Fit Tracking, Disease Management/RPM, Robotics, Reproductive Health, End of Life), **Finances** (Finance Advisement, Wealth Management, Consumer Credit, Banking, Insurance, Real Estate), **Home & Personal Life** (Robotics, Home Management, Personal Assistance, Relationships), **Leisure & Hospitality** (Leisure, Travel), **Robotics** (Retail, Food Supply, Public Safety, Housing Supply, Hospitality), **Productivity** (Personal Assistance, Time Management, Media Management), **Mobility** (Autonomous Vehicles, Travel, Automotive, Insurance), **Education** (Skill Development, Career Development, Higher Education, K-12, Consumer Credit), **Legal & Public Services** (Accounting, Government Benefits, Public Services, Consumer Protection, Legal Self-Serve, Identity, Housekeeping), and **Media & Culture** (Writing, Film & TV, Visual Arts, Music, Fashion). Additional use cases may be added in future epics via new Notion records — no schema changes required.
- The app must support incremental use case addition without requiring a full re-deploy.
- Each use case may include a short, plain-language description (≤2 sentences) — descriptions are optional per use case; when present, they require no assumed AI knowledge to understand.
- If a use case has no description, or a visitor doesn't understand it as written, the visitor can request that an explanation/description be added to it. This is a lightweight flag/request action, not a live AI-generated explanation — requests are queued for the content team to address.
- If a visitor rates a use case as **should not exist**, **uneasy**, or **distrust** (whichever negative pole applies under the selected rating axis, see Open Questions #1), they are offered an optional free-text field to explain why they chose that rating. This field is never required and only appears after one of these specific negative ratings is selected — it is not shown for neutral or positive ratings.
- Although use cases are organized into domains and subdomains at the data layer, the visitor may or may not them grouped or labeled that way. The visitor is served **7 randomized use cases per bundle**, drawn without regard to domain or subdomain, so the rating experience feels like a continuous stream rather than a category-by-category survey. After completing a 7-use-case bundle, the visitor chooses whether to continue with another randomized bundle or stop. Domains and subdomains remain the organizing structure for content management, the Supabase schema, and analytics — not for the visitor-facing rating flow.
- After finishing each 7-use-case bundle, the visitor can view their results visualization (see Requirement 2) before deciding whether to continue rating another bundle. Results reflect all bundles completed so far, not just the most recent one.
- Acceptance criteria:
  - [ ] A visitor can complete all ratings in a single session without account creation
  - [ ] Each use case is presented with its description visible before rating, when a description exists for that use case
  - [ ] Use case descriptions are jargon-free and require no prior AI knowledge to understand
  - [ ] A visitor can request an explanation/description be added to a use case, whether or not it currently has one
  - [ ] A visitor who rates a use case as should not exist, uneasy, or distrust is shown an optional free-text field asking why
  - [ ] The optional free-text field does not appear for any other rating value
  - [ ] The interaction is touch and mouse compatible
  - [ ] Use cases are served in randomized bundles of 7, drawn across domains and subdomains without visible grouping or labeling
  - [ ] Progress is visible so visitors know how far along they are within the current 7-use-case bundle
  - [ ] After completing a bundle, the visitor is presented with a clear choice to view results or continue to another bundle
  - [ ] The results visualization reflects the visitor's cumulative ratings across all bundles completed so far
  - [ ] New domains and subdomains can be added to the underlying data without breaking existing use cases or visitor flows

**2. Individual Results Visualization**
- Upon completing a 7-use-case bundle (or choosing to stop after any bundle), the visitor sees a personalized visualization of their results, reflecting all ratings submitted so far.
- The visualization must make the visitor's overall "AI attitude profile" legible at a glance — not just a list of scores.
- Visualization type is a **design team action item**, to be decided after rating scale and domain list are confirmed (see Open Questions #2).
- Acceptance criteria:
  - [ ] Results appear immediately after the final rating, with no loading state > 2 seconds
  - [ ] The visualization is readable without any additional explanation copy
  - [ ] The visitor can see their rating for each individual use case within the visualization or on demand

**3. Comparison Visualization**
- After viewing individual results:
  - Visitors can see how their ratings compare to the friend that shared the link with them (default view)
  - Visitors can see how their ratings compare to an aggregate of all previous visitors.
- All ratings are stored anonymously server-side in **Supabase**. This is the confirmed architecture — no PII is collected or stored.
- Aggregate data updates in real time (or near-real time) as new visitors complete the experience.
- A minimum response threshold of 25 respondents must be met before aggregate data is surfaced, to ensure social proof is meaningful rather than misleading. **Exact threshold is a design team action item** (see Open Questions #4).
- The Supabase schema must treat domains and use cases as configurable records, not hardcoded structures. This ensures new domains can be added at the data layer without schema migrations or breaking changes to existing domain data.
- Acceptance criteria:
  - [ ] Anonymous ratings are written to Supabase on submission
  - [ ] Aggregate data is visible after individual results, not before (to prevent anchoring bias)
  - [ ] The comparison view shows both the visitor's data and aggregate data simultaneously
  - [ ] If the response threshold has not been met, a designed placeholder state is shown instead of aggregate data
  - [ ] Adding a new domain and its use cases requires no schema changes — only new records

**4. Shareable Results Artifact**
- Visitors can share their individual results as a unique URL.
- The shared URL encodes or retrieves the visitor's result profile and prompts the viewer to take the experience themselves.
- The shared encoded URL is used to compare a new visitor's results with the results from the encoded URL that led them to the app.
- The shared artifact must be visually self-contained and interpretable without context.
- Acceptance criteria:
  - [ ] A "Share" or "Copy link" action is available on the results screen
  - [ ] The shared link renders a meaningful preview on major platforms (Twitter/X, Instagram, iMessage) via OG meta tags
  - [ ] The shared link loads the sharer's results profile and prompts the viewer to take the experience themselves

---

### P1 — Nice to Have

**5. AI Impact Explainer — contextual consequence layer**
- After rating a use case (or domain), visitors can optionally dive deeper into the real-world consequences of that AI application across four impact dimensions: **jobs/labor**, **economy**, **health**, and **industry/sector**.
- Recommended format: a **scrollable, card-based explainer panel** that surfaces after rating — not before, to avoid priming responses. Each impact card is brief (2–3 sentences + a key stat), scannable, and editorially curated. Think less "Wikipedia article," more "what your informed friend would tell you."
- Alternative formats to explore: inline tooltip on hover (lighter lift, lower engagement), a dedicated "impact" tab on the results screen, or a full-screen contextual drawer. Format is a **design decision**.
- This feature turns the app from a pure sentiment tool into something with lasting educational value — a meaningful differentiator.
- Acceptance criteria:
  - [ ] Impact content is optional and never shown before the visitor submits their rating (no priming)
  - [ ] Each use case has at least one impact card across at least two dimensions (jobs, economy, health, or industry)
  - [ ] Content is written in plain language appropriate for a general Millennial/Gen Z audience
  - [ ] The explainer is skippable — visitors can proceed to results without engaging with it

**6. Domain-level filtering in aggregate view**
- Visitors can filter the aggregate comparison by domain (e.g., "how do my creative AI ratings compare to others' creative ratings").

**7. Lightweight Demographic Self-Report**
- After completing all ratings and before results are shown, visitors are presented with an optional self-report screen collecting three fields: **age range**, **gender**, and **region** (U.S. state or broad region).
- The screen is explicitly optional and skippable — visitors who skip proceed directly to their individual results with no penalty.
- Visitors who complete self-report unlock a **filtered aggregate view**, allowing them to compare their ratings against peers who share their demographic profile rather than the full visitor pool.
- Demographic data is stored anonymously in Supabase alongside the visitor's ratings, with no PII attached.
- Acceptance criteria:
  - [ ] Self-report screen appears after final rating submission and before the results visualization
  - [ ] All three fields (age range, gender, region) are presented on a single screen — no multi-step flow
  - [ ] The screen is skippable via a clearly labeled action (e.g., "Skip to results")
  - [ ] Visitors who complete self-report see a filtered aggregate view segmented by their demographic profile
  - [ ] Visitors who skip self-report see the standard unfiltered aggregate view
  - [ ] Demographic fields are stored anonymously in Supabase alongside ratings — no PII collected

**8. Animated / progressive reveal of results**
- Results visualization builds progressively as the visitor completes ratings, creating anticipation and engagement.

**9. "Human vs. AI creativity" narrative summary**
- After completing ratings, visitors receive a one-line characterization of their overall stance (e.g., "You're a skeptical pragmatist" or "You're an early adopter with creative guardrails") — framing TBD and is a **content/design decision**.

---

### P2 — Future Considerations

**10. Facilitated group / cohort mode**
- Organizations (schools, companies, conferences) can run a facilitated version where a group completes the experience simultaneously and results are aggregated live for the group.

**11. Revisit & compare over time**
- Visitors can optionally save their results (via a generated unique URL) and return to see how their views change over time or after new AI developments.

**12. Curator / editorial layer**
- A curated editorial experience that adds context to outlier data points — e.g., "People who work in creative fields rated AI music generation 30% lower than the general population."

---

## Success Metrics

### Leading Indicators (measure at 1 week and 1 month post-launch)

| Metric | Target | Measurement |
|---|---|---|
| Completion rate | ≥70% of visitors who start finish all ratings in a domain | Analytics: session funnel |
| Time to complete | Median session 4–8 min | Analytics: session duration for completers |
| Share rate | ≥20% of completers click share | Analytics: share action event |
| Drop-off point | No single use case causes >15% abandonment | Analytics: per-step drop-off |

### Lagging Indicators (measure at 1 and 3 months)

| Metric | Target | Measurement |
|---|---|---|
| Referral-driven new visitors | ≥30% of visitors arrive via shared link | Analytics: referral source |
| Return visit rate | ≥10% of completers return within 30 days | Analytics: returning session rate |
| Social impressions | Shared artifacts generate measurable organic reach | Social listening / UTM tracking |

---

## Open Questions

| Question | Owner | Status | Notes |
|---|---|---|---|
| **Rating scale / narrative framing**: Which axis (or axes) will visitors rate on? Options: (a) human ↔ AI, (b) uneasy ↔ enthusiastic, (c) should exist ↔ should not exist, (d) replaces ↔ augments, (e) trust ↔ distrust. Shapes data model and all visualizations. | **Design** | 🔴 Action item — blocks data model | E&C will prototyped 2, 3, 5 range input designs · Don't want AI to do this, Do want AI to do this · Will polish axes names later · Or how could answers generate axes relevant to user? |
| **Individual results viz type**: What visual form best represents an individual's AI attitude profile? To be decided after rating scale and domain list are confirmed. | **Design** | 🔴 Action item — blocks front-end build | Come up with categories for people to be classified into based on their answers and categories · Compare with friend based on the link they shared |
| **Use case list per domain**: What are the specific use cases within each domain? Should any be intentionally provocative to create differentiation in responses? | **Design + Content** | 🔴 Action item — blocks rating module per epic | |
| **Aggregate minimum threshold**: How many responses before aggregate data is shown? What placeholder state is shown before the threshold is met? | **Design + Engineering** | 🔴 Action item — blocks aggregate view | |
| **Anchoring bias mitigation**: Aggregate shown after individual results only, or offer a toggle? What if the visitor wants to see aggregate *while* rating? | **Design** | 🟡 Non-blocking — affects UX flow | |
| **Shareability format**: Unique URL only (v1), or also a downloadable static image? Static image requires server-side rendering infrastructure and is a scope decision. | **Engineering** | 🟡 Non-blocking — URL confirmed for v1, image is P1 | |
| **Mobile responsiveness**: Desktop-first with graceful mobile degradation, or full mobile parity from the start? | **Design + Engineering** | 🟡 Non-blocking — affects build scope | |
| **"Attitude profile" framing**: Labeled archetype vs. purely visual/quantitative profile? Archetypes risk oversimplification. | **Design + Content** | 🟢 P1 — decide before Phase 2 | |
| **Demographic slice minimum threshold**: The filtered aggregate view (unlocked by self-report) faces the same minimum response problem as the main aggregate, but compounded by smaller slice sizes. Should each demographic slice require its own minimum threshold before the filtered view is shown? If the slice has not met the threshold, do we fall back to the full aggregate, show a confidence caveat, or hide the filtered view entirely? | **Design + Engineering** | 🟡 Non-blocking — must resolve before P1 #6 ships | |

> **Resolved:** Data persistence → anonymous ratings stored server-side in Supabase. No PII collected. Privacy risk: low.

---

## Inspiration & Reference Apps

Comparable interactive experiences worth studying for UX patterns, visual language, rating mechanics, and results presentation:

| App | URL | What to study |
|---|---|---|
| **thredUP Fashion Footprint Calculator** | [thredup.com/fashionfootprint](https://www.thredup.com/fashionfootprint/) | Step-by-step input flow, personal results reveal, strong visual identity tied to the brand mission |
| **Carbon Crux Total Calculator** | [carboncrux.com/calculators/total](https://carboncrux.com/calculators/total) | Domain-by-domain input structure, aggregate benchmarking, how complex data is made feel personal |
| **Quartz AI Jobs Calculator** | [Image reference](https://buzzsumo.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=uploads/2018/08/quartz-calcuator.png&width=0) | Slider-based rating mechanic, sector-by-sector framing, how labor/economy impact is visualized accessibly |
| **Quartz At Work Reactions** | [Image reference](https://buzzsumo.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=uploads/2022/01/quartz-at-work-reactions-buzzsumo.jpg&width=0) | Emotional/attitudinal response framing, aggregate sentiment display, tone for a professional-but-accessible audience |
| **Player Motivation** | [apps.quanticfoundry.com/profiles/gamerprofile/LKBuFs8rhb7bnefdnbWMvE](https://apps.quanticfoundry.com/profiles/gamerprofile/LKBuFs8rhb7bnefdnbWMvE/) | Radar chart showing six facets of player motivations/interest, option to see additional facets w/ click of a button, link to motivations explainer, in-page explainer of the components of each facet, link to video game recos |
| **Bill the Patriarchy** | [billthepatriarchy.com](https://www.billthepatriarchy.com/) | |

---

## Timeline Considerations

- **No hard deadlines identified** — project is in early exploration.
- Delivery model: **continuous, domain-by-domain**. Each domain (Creative, Productivity, Personal, Civic/Professional) is a self-contained epic that can be scoped, built, and shipped independently.
- Recommended sequencing:
  - **Pre-build:** Resolve action items #1, #3, and #2 (in that order) before writing engineering tickets for any domain.
  - **Epic 1:** Rating module + individual results viz + aggregate + share link for Domain 1. Engineering must deliver a domain-agnostic Supabase schema in this epic — domains and use cases as configurable records, not hardcoded structures. This is a prerequisite for all subsequent epics.
  - **Epic 2–N:** Additional domains, each adding use cases to an established, working system.
  - **Phase 2:** P1 features layered in after two or more domains are live and aggregate data is meaningful.
- Recommend a design sprint on open questions #1 and #3 as the immediate next step.
