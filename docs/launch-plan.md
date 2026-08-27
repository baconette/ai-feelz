# Launch Plan & Checklist

**Status:** Working doc — Epic 1 in progress
**References:** [product.md](../product.md) · [docs/PRD.md](PRD.md) · [docs/archetype-logic.md](archetype-logic.md)

---

## Real goal: this is a portfolio piece, not a growth product

The PRD's audience (Millennials & Gen Z consumers) and success metrics (completion rate, share rate, referral rate) are still the product's real design targets — a launch with weak engagement numbers doesn't impress anyone. But the *purpose* of marketing this launch is to generate conversations with **recruiters and product design hiring managers**, not to grow a consumer app.

That means two audiences, two funnels, one product:

| | Consumer funnel (PRD) | Recruiter funnel (real goal) |
|---|---|---|
| Who | Millennials/Gen Z visitors | Hiring managers, recruiters, design peers |
| What they do | Rate use cases, get an archetype, compare, share | Skim a case study, judge craft/rigor, reach out |
| What "success" looks like | ≥70% completion, ≥20% share rate | Inbound messages, portfolio traffic, interview requests |
| Primary channel | Owned landing page + rented consumer platform | LinkedIn + design-community spaces + a case study |

Consumer engagement numbers aren't the finish line here — they're **evidence inside the case study**. A hiring manager isn't going to run the rating flow themselves in most cases; they're going to read how you thought about the archetype false-positive-rate problem in [archetype-logic.md](archetype-logic.md#open-items) and judge the rigor. Design every launch asset with that reader in mind, not just the visitor.

---

## Launch-readiness gates

Two things block moving past Phase 2, independent of marketing readiness:

- [ ] **Archetype threshold tuning resolved** — `MIN_STANDOUT_DEVIATION` is currently a placeholder (0.3) with a 91–99% false-positive rate at 3+ confident domains (see [archetype-logic.md](archetype-logic.md#open-items)). Until this is tuned, most visitors with genuinely no preference will get handed a specific domain archetype instead of "Even Keel" — a real credibility risk the moment this is shared publicly. **Do not open Phase 3 (Beta) until this is re-validated.**
- [ ] **25-respondent aggregate threshold met** — comparison view (Requirement 3) shows a placeholder below 25 responses. Phase 2 exists specifically to clear this before any external/borrowed-channel traffic arrives.
- [ ] **Archetype tone finalized** — avatar + title + one-sentence description doubles as the OG share image copy (Requirement 4). In progress; must land before Phase 3, since beta testers are your first real read on whether the tone lands.

---

## Phase 1: Internal Launch — *now*

**Goal:** Validate the rating mechanic and archetype output feel right, not the funnel.

- [ ] Recruit 5–10 people 1:1 (team + close network) to run a full session on the current build
- [ ] Confirm use-case phrasing is jargon-free to someone with zero AI background (P0 acceptance criterion)
- [ ] Confirm the archetype result (avatar/title/description) feels accurate and fun, not generic, across a few different rating patterns
- [ ] Sanity-check the "Blank Slate" and "Even Keel" catch-alls specifically — these are the states most likely to appear early since real coverage will be sparse
- [ ] Decide whether to stand up a waitlist landing page now for Phase 2 (owned channel #1)

**Owner:** _TBD_ · **Exit criteria:** core loop (rate → archetype → share) works without confusion in every 1:1 session

---

## Phase 2: Alpha Launch — clear the 25-response floor

**Goal:** Get to 25+ real respondents through people you can personally invite, before anyone external sees the app.

- [ ] Minimal landing page live (owned channel) — concept explainer + direct link, doesn't need to be polished
- [ ] Personally invite your network (friends/team) — each invite also tests the friend-comparison default view end-to-end
- [ ] Track completions until comfortably past 25 aggregate responses
- [ ] Spot-check OG preview rendering on X, iMessage, and Instagram using real archetype results (not placeholder copy)
- [ ] Confirm "request better phrasing" flag action works and requests are actually landing somewhere the content team sees them

**Owner:** _TBD_ · **Exit criteria:** 25+ responses banked, comparison view shows real aggregate data, no placeholder states left for new visitors

**Do not post publicly or reach out to borrowed-channel contacts yet.**

---

## Phase 3: Beta Launch

**Goal:** Broaden past your immediate network on the consumer side, while starting to build the recruiter-facing narrative in parallel.

- [ ] Archetype tone finalized and shipped (see gate above)
- [ ] **Start drafting the case study** (see Recruiter Track below) using real Phase 1–2 learnings — don't wait for full launch to start writing
- [ ] Identify 1–2 borrowed-channel contacts for the *consumer* side (AI/tech/culture creators) — send free early access, no strings, no paid ask. This still matters for engagement-metric evidence, just isn't the primary goal anymore.
- [ ] Pick **one** rented platform for consumer teasers (Instagram/TikTok-shaped quiz-share behavior fits the shareable-result mechanic)
- [ ] Post 1–2 light teasers on that platform — problem-framing, not full reveal
- [ ] Add a visible "Beta" signal in-app if still iterating post-launch expectations matter
- [ ] Instrument and start watching the PRD's own funnel metrics: completion rate, per-use-case drop-off, share-click rate — these become case-study evidence

**Owner:** _TBD_ · **Exit criteria:** completion rate trending toward the ≥70% target, no single use case driving >15% abandonment, share rate signal starting to show, case study first draft underway

---

## Phase 4: Early Access Launch

**Goal:** Scale respondents meaningfully, validate aggregate data at real scale, lock messaging before full launch — and get the case study to a shareable draft.

- [ ] Start surfacing real results-screen screenshots/GIFs as creative assets — this is the strongest asset the product has, for both funnels
- [ ] Decide: batch invites (5–10% at a time) vs. open "early access" framing to everyone on the waitlist
- [ ] Run a lightweight product/market fit or exit-survey pass with engaged beta users
- [ ] Finalize the narrative/positioning hook based on what actually drove shares in Phase 3 (this resolves the PRD's still-open P1 #9 framing decision in practice, even though the feature itself stays P1)
- [ ] **Case study near-final** — process, decisions, and real metrics from Phases 1–3 written up; ready for a design pass
- [ ] Update portfolio site / resume / LinkedIn "featured" section to point at the case study once it's ready

**Owner:** _TBD_ · **Exit criteria:** messaging validated against real share behavior, case study ready for final review, ready to write launch-day copy for both funnels

---

## Phase 5: Full Launch (incl. Product Hunt)

**Goal:** Maximum visibility for the consumer product, and — the actual point — the case study in front of as many product design hiring managers and recruiters as possible.

**Pre-launch-day**
- [ ] Product Hunt listing drafted — tagline sells the *personal, shareable result* ("see your AI attitude profile, compare with friends"), not the AI-ethics framing. PH's real value here is a credibility signal ("shipped and launched") for the case study, not user acquisition.
- [ ] Demo GIF/video shows the **results screen**, not the rating UI — the payoff is the visual
- [ ] Line up Phase 3 borrowed-channel contact + beta users to comment/upvote in the first hour
- [ ] BetaList / Hacker News listings prepped as secondary rented channels for the same week
- [ ] Remove any "Beta" markers from the live app
- [ ] Announcement email drafted for the owned list built across Phases 2–4
- [ ] Case study published (portfolio site or a platform like Medium/UX Collective) with the consumer-launch numbers as evidence
- [ ] LinkedIn post drafted around the case study — written for a hiring-manager reader, not a general audience: lead with the interesting design/technical decision (e.g. the archetype threshold problem), not the app pitch

**Launch day**
- [ ] Announcement email sent
- [ ] Product Hunt listing live, team engaging all day (respond to every comment)
- [ ] Social posts live on the one core consumer rented platform
- [ ] LinkedIn post live, tagged/shared into relevant design-community spaces
- [ ] BetaList/HN submitted
- [ ] Monitor completion funnel and error rates in real time

**Post-launch**
- [ ] Follow up with everyone who engaged on launch day, including any recruiter/hiring-manager replies on LinkedIn
- [ ] Fold the announcement into the next owned-channel roundup (if a recurring email/community update exists)
- [ ] Revisit consumer funnel metrics against PRD targets: ≥70% completion, ≥20% share rate, ≥30% referral-driven new visitors (measure at 1 week, then 1 month) — feed real numbers back into the case study
- [ ] Track the recruiter funnel separately (see below) — this is the metric that actually matters for the stated goal

---

## Recruiter track — parallel to the consumer launch

This track runs alongside every phase above, using the same product but different assets and channels.

**Assets**
- [ ] Case study (own site or a design publication) — process, key decisions, trade-offs, real metrics. Draft starts Phase 3, published Phase 5.
- [ ] Portfolio site / resume updated to link the project and case study
- [ ] LinkedIn "featured" section updated at launch

**Candidate case study angles**

Three moments in the project where the "obvious" first answer was checked against evidence or theory and revised — a stronger throughline than presenting any single decision as if it were obvious from the start.

- **Archetype threshold false-positive analysis** — the placeholder deviation threshold that decides whether a visitor gets a specific domain archetype or the "Even Keel" catch-all was never validated, so a synthetic simulation was run against visitors with no real domain preference by construction. It showed the threshold mislabels those visitors as having a strong AI-attitude lean 91–99% of the time once they'd rated 3+ domains — worse the more data they gave — exposing a real flaw before it shipped rather than after. See [archetype-logic.md](archetype-logic.md#open-items).
- **The rating-scale decision that got overturned** — [Sprint_Rating_Scale.md](Sprint_Rating_Scale.md) documents a structured evaluation of five candidate framings for the core rating scale (authorship, sentiment, moral stance, labor/agency, trust), scored against completion risk, data richness, and shareability, landing on a clear recommendation (an "Uneasy ↔ Enthusiastic" sentiment axis). The scale that actually shipped in the PRD diverges from that recommendation entirely, in favor of a role-assignment framing (who should perform this, a human or an AI). The story is the options analysis and the willingness to revise a documented recommendation, not the final scale itself.
- **Sequencing the comparison view around anchoring bias** — Requirement 3 in the PRD deliberately shows individual results before any aggregate/comparison data, and withholds aggregate data entirely below a 25-response threshold, showing a designed placeholder instead. Both are direct applications of known behavioral-psychology failure modes (anchoring bias, premature social proof) to concrete UI sequencing and gating decisions, not abstract principles. See [PRD.md:104-110](PRD.md).

**Channels**
- [ ] LinkedIn — primary. Posts written for a hiring-manager reader: lead with a specific decision or problem (the archetype false-positive analysis, the domain-agnostic Supabase schema requirement, the anchoring-bias sequencing of individual-results-before-aggregate), not a generic "check out my app" pitch.
- [ ] Design-community spaces — Designer Hangout, r/UXDesign, Read.cv, ADPList, UX Collective/Bootcamp (Medium) — post the case study, not just the app link
- [ ] Product Hunt / HN — secondary credibility signal, not primary reach for this audience

**Metrics that actually matter for the stated goal**
- [ ] Case study / portfolio site traffic
- [ ] LinkedIn post engagement, specifically from design-industry accounts
- [ ] Inbound messages, connection requests, or interview requests referencing the project
- [ ] Saves/shares of the case study within design communities

**Note:** consumer engagement metrics (completion rate, share rate) are *inputs* to this track, not the goal — they're the proof points the case study cites.

---

## Channel plan (ORB)

| Type | Channel | Role | Funnel |
|---|---|---|---|
| Owned | Landing page (Phase 2) | Primary link target for all invites and posts | Consumer |
| Owned | Email list (built via Phase 2–4 invites) | Launch-day announcement, post-launch roundup | Consumer |
| Owned | Case study + portfolio site | Primary recruiter-facing asset | Recruiter |
| Rented | One platform, TBD in Phase 3 (Instagram/TikTok-leaning) | Teasers, launch-day posts, funnel to landing page | Consumer |
| Rented | LinkedIn | Case study distribution, hiring-manager reach | Recruiter |
| Rented | Product Hunt / BetaList / Hacker News | Phase 5 visibility spike + credibility signal | Both |
| Borrowed | 1–2 consumer creator contacts, TBD in Phase 3 | Engagement-metric evidence for the case study | Consumer |
| Borrowed | Design-community spaces (Designer Hangout, r/UXDesign, ADPList, UX Collective) | Case study reach within the design industry | Recruiter |

---

## Open decisions to fill in

- [ ] Owners for each phase
- [ ] Target rented platform for the consumer teaser (Phase 3)
- [ ] Borrowed-channel contact shortlist, consumer side (Phase 3)
- [ ] Whether to run Phase 4 as batched or open early access
- [ ] Where the case study lives (own site vs. Medium/UX Collective vs. both)
- [ ] Case study angle/hook — pick one of the three candidates above to lead with, or thread all three together
