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

### New direction — domain-affinity archetypes (supersedes the 8-archetype table above)

The tier × polarization table and its polarization proposal are **on hold, not implemented, and not the current plan** — a design pivot changes what the archetype is even for. Instead of naming *how strongly* someone feels overall, the archetype now names *which domain they diverge on most* — meant to read as more fun and more concretely tied to the content than an abstract level label.

**Scope note:** this also reopens something the original sprint explicitly fixed — "changing the Likert axis itself... stays fixed for this sprint." That constraint is being lifted: the rating scale is moving from 4-point to 5-point.

**5-point Likert scale**: Never (1) · Rarely (2) · Sometimes (3) · Often (4) · Always (5), midpoint 3. `MIN_RATINGS_PER_DOMAIN` and any absolute cutoffs need re-deriving against the new range — nothing from the 4-point tiers carries over numerically.

**Model: 10 domains × 2 directions = 20 domain archetypes, plus 2 catch-alls = 22 total**

Decision reversed from the first pass: rather than one name per domain with copy branching by direction, warm and cool now get **fully distinct names per domain** (like the old Steady/Polarized split) — this doubles the domain-archetype count from 10 to 20 and pushes the total past the original 6–10 cap. Deliberate tradeoff, made for the sake of sharper, more specific copy per direction rather than one name doing double duty.

#### Mechanics, in detail

1. **Ratings input**: each use case rating is 1–5 under the new scale (Never…Always).
2. **Confident domains**: a domain counts only once it has `≥ MIN_RATINGS_PER_DOMAIN` ratings (currently 2, per the P0 decision above — needs re-deriving for the 5-point range, but the *mechanism* — excluding low-n domains entirely rather than downweighting them — is unchanged). Domains below this are excluded from every step below, not just discounted.
3. **Own overall baseline**: the equal-domain-weighted mean of all confident domains' averages (P0 decision, unchanged) — this is the visitor's personal reference point, not a fixed midpoint like 3.
4. **Per-domain deviation**: for every confident domain, `deviation = domainAverage − ownOverallAverage`. This measures how that domain compares to *this visitor's own* norm, not an absolute scale.
5. **Standout selection** — this is where the two new catch-alls plug in:
   - If `confidentDomains.length < 2` → **The Blank Slate**. With only one (or zero) confident domains, deviation is either undefined or trivially `0` by construction (a single domain's average *is* the overall average under equal-domain-weighting) — that's a data-coverage gap, not a real personality signal, so it gets its own coverage-aware archetype rather than being misread as "perfectly flat."
   - Else, compute `maxAbsDeviation = max(|deviation_d|)` across confident domains. If `maxAbsDeviation < MIN_STANDOUT_DEVIATION` (proposed `0.3` on the 5-point scale, open to tuning) → **The Even Keel**. Here there's enough data to compare domains, and they genuinely don't diverge — a real, distinct profile, not a data gap.
   - Otherwise, **standout domain** = the confident domain with the largest `|deviation|`. **Tie-break**: equal (or near-equal) `|deviation|` is resolved in favor of the domain with the higher rating count — more data behind the signal wins.
6. **Direction & naming**: `sign(deviation_standout)` picks which of the two distinct archetype names for that domain applies — positive (`> 0`) → warm name, negative (`< 0`) → cool name. Each of the 10 domains has its own warm and cool name and copy (20 total), fully independent text, not a shared template.
7. **Badges layer on top, unconditionally**: Level (5-point overall average, bucketed — cutoffs TBD) and Polarization (steady vs. polarized, pole logic from the proposal above with poles redefined as 1 and 5) are computed independently of the standout-domain logic and rendered as badges alongside *whichever* of the 22 archetypes was selected, including the two catch-alls (e.g. "The Even Keel · Curious · Steady").

#### Worked example

A visitor has rated: Healthcare `[4, 5, 4]` (n=3, avg 4.33), Mobility `[2, 1]` (n=2, avg 1.5), Finances `[3]` (n=1 — below `MIN_RATINGS_PER_DOMAIN`, excluded), Education `[3, 4, 3, 3]` (n=4, avg 3.25).

- Confident domains: Healthcare (4.33), Mobility (1.5), Education (3.25). Finances is dropped for insufficient count.
- Own overall baseline = `(4.33 + 1.5 + 3.25) / 3 = 3.03`.
- Deviations: Healthcare `+1.30`, Mobility `−1.53`, Education `+0.22`.
- `maxAbsDeviation = 1.53` (Mobility), which clears the `0.3` standout threshold, so no catch-all triggers.
- Standout domain = Mobility, deviation is negative → cool direction → **archetype = The Backseat Driver**, badges rendered alongside it based on the overall average (3.03) and the separate polarization check.

Two supporting cases for the catch-alls:

- **Even Keel case**: confident domains Healthcare (3.1), Finances (3.0), Education (2.9), Media & Culture (3.2) → own average `3.05`; deviations `+0.05, −0.05, −0.15, +0.15`. `maxAbsDeviation = 0.15 < 0.3` → **The Even Keel** triggers regardless of the actual domain values.
- **Blank Slate case**: a visitor who has only completed part of one 7-card bundle, with ratings spread thin enough that only one domain reaches `n ≥ 2` (all others sit at `n=1` or `n=0`) → confident domain count `= 1 < 2` → **The Blank Slate** triggers, independent of what that one domain's rating was.

#### Archetype set (22 total)

| Domain | Archetype | Trigger | Summary copy |
|---|---|---|---|
| Healthcare | The Trusting Patient | Standout = Healthcare, deviation > 0 | "When it comes to your health, you're the first to hand AI the chart — this is where your trust runs deepest." |
| Healthcare | The Second Opinion | Standout = Healthcare, deviation < 0 | "Your body is where you draw the clearest line — you want a human take before AI gets a say." |
| Finances | The Open Ledger | Standout = Finances, deviation > 0 | "Money is where you're most willing to let AI take the wheel — numbers don't lie, and apparently neither does the algorithm." |
| Finances | The Penny Pincher | Standout = Finances, deviation < 0 | "Your money is the one thing you're keeping firmly in human hands — no algorithm gets near the account." |
| Home & Personal Life | The Open Door | Standout = Home & Personal Life, deviation > 0 | "Home is where you've let AI in the most — from your calendar to your relationships, it's practically part of the household." |
| Home & Personal Life | The Private Room | Standout = Home & Personal Life, deviation < 0 | "Home is sacred ground — this is the one room AI hasn't been invited into." |
| Leisure & Hospitality | The Concierge | Standout = Leisure & Hospitality, deviation > 0 | "Vacation planning and downtime are where you hand it over gladly — let the algorithm book the trip." |
| Leisure & Hospitality | The Do-Not-Disturb | Standout = Leisure & Hospitality, deviation < 0 | "Your downtime is yours — this is the one place you don't want AI's fingerprints." |
| Robotics | The Machine Whisperer | Standout = Robotics, deviation > 0 | "Robots and automation are where you're most at ease — bring on the machines." |
| Robotics | The Uncanny Valley | Standout = Robotics, deviation < 0 | "Physical automation is where your comfort runs out fastest — a screen is one thing, a machine in the room is another." |
| Productivity | The Inbox Zero | Standout = Productivity, deviation > 0 | "Getting things done is where you're most eager to offload to AI — anything that saves you time earns your trust fast." |
| Productivity | The Slow Burn | Standout = Productivity, deviation < 0 | "How you spend your time is oddly the one thing you don't want managed for you — some things are worth doing slow." |
| Mobility | The Cruise Control | Standout = Mobility, deviation > 0 | "Getting from A to B is where you're most comfortable letting AI take over — hands off the wheel, literally." |
| Mobility | The Backseat Driver | Standout = Mobility, deviation < 0 | "Getting around is the one place you still want a human hand on the wheel." |
| Education | The Extra Credit | Standout = Education, deviation > 0 | "Learning and skill-building are where you're most willing to let AI teach — you'll take the help wherever it gets you further." |
| Education | The Hall Monitor | Standout = Education, deviation < 0 | "Learning is the one place you don't want a shortcut — this still feels like something you should do yourself." |
| Legal & Public Services | The Open Case | Standout = Legal & Public Services, deviation > 0 | "Paperwork, benefits, and bureaucracy are where you're most relieved to have AI step in — no one enjoys reading fine print." |
| Legal & Public Services | The Fine Print | Standout = Legal & Public Services, deviation < 0 | "Rules, rights, and paperwork are the one place you don't trust a shortcut — too much on the line to hand it over." |
| Media & Culture | The Remix | Standout = Media & Culture, deviation > 0 | "Art, writing, and culture are where you're most open to AI — you care more about the result than who (or what) made it." |
| Media & Culture | The Art Defender | Standout = Media & Culture, deviation < 0 | "Creativity is the one place you want to stay entirely human-made — this is where AI hasn't earned a seat." |
| — | The Even Keel | ≥2 confident domains, max\|deviation\| < 0.3 | "You're remarkably consistent — whatever your take on AI, it holds steady across everything you've rated so far, no domain pulling ahead of the rest." |
| — | The Blank Slate | <2 confident domains | "You haven't rated enough across different domains yet for a clear lean to show — keep going and we'll find where you stand out." |

### Next steps for whoever picks this up

1. Tune `MIN_STANDOUT_DEVIATION` (proposed `0.3`) and the re-derived `MIN_RATINGS_PER_DOMAIN` for the 5-point scale against real or synthetic data — neither is validated yet.
2. Decide and document the 5-point level badge cutoffs (replacing the old 4-point tier thresholds) and confirm the polarization pole redefinition (1 and 5 instead of 1 and 4).
3. Implement in `lib/prototype/archetypes.ts`: per-domain deviation from the visitor's own overall average, the Blank Slate / Even Keel / standout-domain branch (with the ratings-count tie-break), the 20 domain archetypes keyed by `(domainId, direction)`, and level/polarization rendered as badges rather than folded into `TIERS`.
4. Validate against synthetic sparse/dense/polarized/consistent cases, plus explicit Blank Slate, Even Keel, and tie-break cases (two domains with equal `|deviation|` and equal counts) to confirm behavior is deterministic.
5. Update `docs/PRD.md` Open Questions ("Attitude profile" framing row) once this ships.
