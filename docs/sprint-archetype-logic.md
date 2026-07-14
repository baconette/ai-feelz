# Sprint Plan: Smarter Archetype Logic — Discovery & Design

**Dates:** TBD — 5 working days
**Team:** You (design/PM) + Claude (engineering/analysis)
**Sprint Goal:** Produce a validated scoring model + archetype set + content brief that engineering can implement, replacing the current single-average/4-tier placeholder in `lib/prototype/archetypes.ts`.

---

## Background: current logic

The prototype currently buckets a visitor into 1 of 4 fixed archetypes purely off the single overall average of their Likert ratings (1 = Never … 4 = All the time), ignoring the spread/shape of their ratings and any domain-level nuance. See [lib/prototype/archetypes.ts](../lib/prototype/archetypes.ts).

Content shape driving this sprint's constraints: ~10 domains, ~40+ subdomains, 103 total use cases, visitors rate in randomized bundles of 7 (per-visitor coverage of the full content set is always partial, especially early in a session).

---

## Factors to consider beyond variance/spread and domain-weighting

- **Coverage/confidence per domain** — with bundles of 7 across 10 domains, most domains a visitor touches will have exactly 1 rating. An "average" of n=1 isn't really an average. Logic should either require a minimum rating count before a domain counts toward the archetype, or explicitly downweight low-n domains.
- **Consistency/coherence vs. noise** — does the visitor show a legible pattern (e.g., consistently wary of personal/intimate domains, consistently open to transactional ones), or are their ratings scattered with no structure? A coherent pattern is more "archetype-worthy" than the same average produced by randomness.
- **Extremeness/polarization** — someone who rates everything 1s and 4s (strong opinions, no middle ground) is a meaningfully different person than someone who rates everything 3 (mild, non-committal), even though both could land on the same overall average. These are currently indistinguishable.
- **Subdomain-level clustering within a domain** — someone could love AI in Diagnostics but be uneasy about it in Reproductive Health, both under Healthcare. Domain-level averaging hides that split entirely.
- **The optional "why" free-text** — currently collected but unused. Even light theme-tagging (e.g., "privacy," "job loss," "not personal enough") could add a qualitative dimension to the archetype instead of relying purely on the numeric average.
- **Exposure-awareness in the copy itself** — the archetype should know how much of the picture it's actually working with, and say so ("based on 7 ratings across 4 domains so far" vs. implying broad, confident coverage).
- **Percentile/relative framing instead of fixed thresholds** — today's tiers are hand-authored absolute cutoffs (≤1.75, etc.). Once there's real aggregate data, archetypes could instead be defined by where a visitor falls relative to everyone else's distribution — this also lets the definitions self-correct over time instead of staying hardcoded guesses.
- **Empirically-derived archetypes vs. authored ones** — once there's enough real response volume, cluster analysis (e.g., k-means over domain-score vectors) could reveal what the actual natural groupings are, rather than tiers invented from a single axis.

## Considerations from the domain/subdomain/use-case counts specifically

- **103 use cases ÷ 7 per bundle ≈ 15 bundles to see everything.** Almost no one will complete all of them — the algorithm has to be designed for the *sparse* case (7–14 ratings) as the norm, not the exception.
- **10 domains, 7 per bundle** means a single bundle mathematically cannot cover every domain even once. On any given bundle, expect several domains with exactly 1 rating and several with zero. Domain-level scoring must have an explicit, deliberate policy for "not enough data in this domain" (today's code silently excludes domains with zero ratings, which is right — but it doesn't yet distinguish "0 ratings" from "1 noisy rating").
- **~40+ subdomains over 103 use cases ≈ 2–3 use cases per subdomain.** Subdomain-level insight is close to infeasible for an individual visitor in any reasonable session length — it should probably stay an aggregate/content-team signal, not something shown as "your subdomain profile."
- **Domains are uneven in size** (Legal & Public Services has 7 subdomains; Leisure & Hospitality has 2). Straight domain-averaging implicitly gives smaller domains equal weight to much larger ones. Whether that's desired or should be size-weighted is a real design decision, not a default to fall into.
- **Random, ungrouped bundling means coverage grows unevenly and unpredictably** across a session. The archetype's confidence should plausibly evolve as bundles accumulate — e.g., a "provisional" archetype after 1 bundle vs. a fuller one after covering most domains — rather than treating bundle-1 and bundle-5 results as equally authoritative.

---

## Capacity

| Person | Available Days | Allocation | Notes |
|--------|---------------|------------|-------|
| You (design/PM) | 4 of 5 | ~70% | 1 day reserved for other work |
| Claude (engineering/analysis) | 5 of 5 | ~100% | Available for prototyping, synthetic test cases, and implementation |
| **Total** | **9** | **~85% avg** | |

## Sprint Backlog

| Priority | Item | Estimate | Owner | Dependencies |
|----------|------|----------|-------|--------------|
| P0 | Define the confidence model — minimum ratings-per-domain to count, and how the archetype should read when data is sparse (bundle 1) vs. fuller (bundle 3+) | 1 day | You | None |
| P0 | Decide domain-weighting policy — equal per domain vs. size-weighted by subdomain count, and document the rationale | 0.5 day | You | Needs current domain/subdomain counts from Notion (have — see above) |
| P0 | Prototype 2–3 candidate scoring approaches (e.g., confidence-weighted average, variance-adjusted, percentile-relative) against synthetic rating sets covering sparse/dense/polarized/consistent cases | 1 day | Claude | P0 confidence model decision |
| P1 | Draft an expanded archetype set informed by the new model (likely more than 4 tiers if adding a variance or polarization dimension) | 1 day | You (content) | Scoring approach selected |
| P1 | Light-touch "why" text theme-tagging spike — feasibility only, not full NLP | 0.5 day | Claude | None, can run in parallel |
| P2 (stretch) | Sketch percentile/relative framing using the existing mock aggregate dataset as a stand-in, to preview how it'd look once real data exists | 0.5 day | You | P0 items done |

### Planned Capacity: 9 days | Sprint Load: ~4.5 days (~50% of capacity)

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No real visitor data yet to validate against | Model gets tuned on synthetic/assumed distributions, may not match real behavior | Ship as a "v1 heuristic," re-tune once real ratings accumulate (10+ responses per PRD threshold) |
| Scope creep into full multi-axis rating redesign | Sprint balloons past 1 week | Explicitly out of scope: changing the Likert axis itself (Never → All the time) stays fixed for this sprint |
| Archetype count grows unmanageably if every new factor becomes a new tier | Confusing/diluted results, hard to write good copy for 10+ archetypes | Cap at ~6–8 archetypes max; treat additional factors (polarization, confidence) as modifiers/badges layered on top of a core archetype, not a combinatorial explosion of new tiers |

## Definition of Done

- [ ] Scoring model documented with the "why" behind each decision (confidence thresholds, weighting policy)
- [ ] Archetype list finalized with headline + summary copy for each
- [ ] Synthetic test cases (sparse, dense, polarized, consistent) show the model producing sensible, distinct results
- [ ] Handoff doc ready for engineering to implement in `lib/prototype/archetypes.ts`
- [ ] Design/PM sign-off on whether this ships to the prototype or waits for real aggregate data

## Key Dates

| Date | Event |
|------|-------|
| Day 1 | Sprint start — confidence model + domain-weighting decisions |
| Day 3 | Mid-sprint check-in — review candidate scoring approaches |
| Day 5 | Sprint end / demo — walk through synthetic test cases + finalized archetype list |
| Day 5 (or next Monday) | Retro |

---

## Progress Log

### P0 — Done, shipped to the prototype

Decided together and implemented in `lib/prototype/archetypes.ts` (merged via [PR #16](https://github.com/baconette/ai-feelz/pull/16)):

- **Confidence model**: a domain needs ≥2 ratings before it counts toward the archetype or shows in the domain breakdown (`MIN_RATINGS_PER_DOMAIN`). Single-rating noise is filtered out.
- **Sparse-data UX**: no change from original behavior — the archetype always shows at full confidence regardless of sample size. No "provisional" tag, no withholding.
- **Domain weighting**: equal-domain-weight. The overall score averages each domain's average together, rather than pooling every individual rating — so a domain the random bundle happened to serve more often doesn't quietly dominate the score. Falls back to the raw per-rating average until any domain crosses the confidence threshold.

### P1 — Content brainstorm: expanded archetype set (drafted, not yet implemented)

Decided to build the expanded set around a **2-axis model**: the existing 4-tier average (level) crossed with a new **polarization** axis (steady vs. polarized), for exactly 8 archetypes — landing right at the sprint's 6–8 cap. Names stay as originally proposed (not revisited).

| Level | Archetype | Variant | Triggers when... | Summary copy |
|---|---|---|---|---|
| Skeptical (≤1.75) | The Skeptical Observer | Steady | Default — your ratings consistently cluster low, no notable exceptions. | "You'd rather a human handled most of this — AI hasn't earned much trust from you yet." |
| Skeptical (≤1.75) | The Selective Skeptic | Polarized | Your ratings are mostly Never/Rarely, but you gave a real handful of use cases Often or Always. | "You're wary of AI almost everywhere — except the handful of places you've decided it's earned your trust." |
| Cautious (1.76–2.5) | The Cautious Pragmatist | Steady | Default — your ratings consistently sit in the guarded-but-open middle, no notable extremes. | "You're wary of AI by default, but not opposed — you just want a clear reason before you hand something over." |
| Cautious (1.76–2.5) | The Selective Realist | Polarized | Your average lands in the middle, but only because your ratings genuinely span both extremes and cancel out. | "You're not moderate, you're mixed — fully on board in some places, hard no in others, and it averages out to 'it depends.'" |
| Curious (2.51–3.25) | The Curious Adopter | Steady | Default — your ratings consistently sit in the warm-but-not-sold middle, no notable extremes. | "You're warm to AI without being sold on it — moderately open, pretty even about it, no strong swings either way." |
| Curious (2.51–3.25) | The Selective Enthusiast | Polarized | Your average is fairly positive, but a meaningful chunk of your ratings are flat-out Never in specific areas. | "You don't do 'AI is fine' — you do 'AI is great here, no thanks over there.' You judge it case by case, and you judge it hard." |
| Enthusiastic (>3.25) | The Enthusiastic Early Adopter | Steady | Default — your ratings consistently cluster high, no notable exceptions. | "You're eager to let AI take the wheel across most of what you rated." |
| Enthusiastic (>3.25) | The Selective Believer | Polarized | You're rating almost everything Often/Always, but a few clear Never ratings stand out against that pattern. | "You're almost entirely sold on AI — with a few lines you've drawn and won't move on." |

Note: this required rewriting two of the original *steady* summaries, which had accidentally been written with case-by-case/swing language that actually describes polarization:
- **Cautious Pragmatist** — old *"you're open to AI here and there"* → new (above) — removed the swing implication.
- **Curious Adopter** — old *"you just judge it case by case"* → new (above) — that phrase now lives on **Selective Enthusiast** instead, where it's actually true.

### P1 — Polarization threshold logic (proposed, not yet implemented)

Not yet built into `archetypes.ts`. Proposal to review before implementing:

```
POLE_LOW = 1    // Never
POLE_HIGH = 4   // Always
MIN_POLE_COUNT = 2       // at least 2 ratings at each pole — one outlier isn't a pattern
MIN_POLE_SHARE = 0.15    // each pole must also be ≥15% of total ratings, so 2-out-of-50 doesn't count once sample grows
MIN_RATINGS_FOR_SHAPE_CHECK = 7   // can't assess shape before one full bundle

isPolarized =
  totalRatings >= MIN_RATINGS_FOR_SHAPE_CHECK
  AND lowCount  >= MIN_POLE_COUNT AND (lowCount  / totalRatings) >= MIN_POLE_SHARE
  AND highCount >= MIN_POLE_COUNT AND (highCount / totalRatings) >= MIN_POLE_SHARE
```

Then: **archetype = pickTier(overallAverage) × (isPolarized ? Polarized : Steady)**.

Key design decisions baked into this proposal, worth re-confirming before implementing:
- **Requires literal presence of both true poles** (a Never *and* an Always), not just above/below-average spread — considered a pure stdDev approach and rejected it because it doesn't guarantee the "strong opinions at both ends" the copy promises.
- **Runs on raw individual ratings, not the equal-domain-weighted average** — deliberate difference from the confidence-model decision above, since domain-averaging can hide real bimodality (e.g., a domain with one Never and one Always nets to a domain average of 2.5, erasing the extremes).

Sanity-checked against real data during the brainstorm: a visitor who rated one bundle all "Often" and one bundle all "Never" (14 ratings, `lowCount=7, highCount=0`) correctly resolves to Steady (no "Always" ratings ever given, so no real positive extreme exists). A visitor with 4 Never + 4 Always ratings (average 2.5) correctly resolves to Polarized → **The Selective Realist**.

### Next steps for whoever picks this up

1. Confirm/adjust the polarization threshold constants above (or the naming/copy in the archetype table) — nothing here is final.
2. Implement `isPolarized()` in `lib/prototype/archetypes.ts`, cross it with the existing `pickTier()`, and expand `TIERS` (or a new lookup) to the 8-row table above.
3. Validate against synthetic sparse/dense/polarized/consistent cases per the original Definition of Done.
4. Update `docs/PRD.md` Open Questions ("Attitude profile" framing row) once this ships, since it currently still reads as unresolved.
