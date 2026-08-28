# Archetype Logic

Scoring model for the AI-attitude archetype shown to visitors: which of 22 archetypes a visitor gets, based on where their ratings diverge from their own baseline.

## Content shape

- 10 domains, ~40+ subdomains, 103 use cases total, domains uneven in size (2–7 subdomains each).
- Visitors rate in randomized bundles of 7, drawn without regard to domain — a single bundle can't cover every domain, so partial/sparse coverage is the norm, not an edge case.

## The model

**4-point Likert scale**: Never (1) · Some (2) · Most (3) · Always (4).

**10 domains × 2 directions (warm/cool) = 20 domain archetypes, plus 2 catch-alls (Even Keel, Blank Slate) = 22 total.** Warm and cool get fully distinct names per domain (not one name with branching copy) — sharper, more specific copy per direction.

**Mechanics:**

1. **Confident domains** — a domain counts only once it has ≥ `MIN_RATINGS_PER_DOMAIN` ratings (2). Below that, it's excluded entirely, not downweighted. Kept at 2 rather than raised: a noise-floor simulation showed confident-domain *count* — not ratings-per-domain — is what drives false standouts, so that's what the standout threshold below is indexed on instead (see `scripts/simulate-archetypes.ts`).
2. **Own overall baseline** — the equal-domain-weighted mean of all confident domains' averages. This is the visitor's personal reference point, not a fixed scale midpoint.
3. **Per-domain deviation** — for every confident domain: `deviation = domainAverage − ownOverallAverage`. Measures divergence from *this visitor's own* norm, not an absolute scale.
4. **Standout selection**:
   - `confidentDomains.length < 2` → **The Blank Slate** (not enough coverage yet for a real comparison — a data gap, not a personality signal).
   - Else `maxAbsDeviation = max(|deviation_d|)` across confident domains. If it's below the standout threshold for that visitor's confident-domain count (table below) → **The Even Keel** (enough data, genuinely no divergence — a real profile, not a gap).
   - Otherwise, standout domain = the one with the largest `|deviation|`. **Tie-break**: equal/near-equal `|deviation|` goes to the domain with the higher rating count. (Tie-break only decides between two already-close domains — it's a separate, narrow mechanism from whether a deviation crosses the standout threshold at all.)
5. **Direction & naming** — `sign(deviation_standout)` picks the domain's warm name (`> 0`) or cool name (`< 0`).

**Standout threshold, by confident-domain count** (`STANDOUT_THRESHOLD_BY_DOMAIN_COUNT` in `lib/prototype/archetypes.ts`): a flat number is wrong for everyone, since the noise floor — how large `maxAbsDeviation` gets for a visitor with *no real domain preference*, by chance alone — scales with how many domains they've rated (it's a max over more samples). Each value below is the smallest threshold (searched in 0.01 steps against a 300k-trial synthetic simulation) whose false-positive rate — the share of no-preference visitors who'd still get a domain archetype instead of The Even Keel — is ≤10%. Low domain counts have few achievable deviation values, so a plain percentile lookup can land mid-gap and badly overshoot the target (e.g. the 90th percentile at 2 domains gives a 28% false-positive rate, not 10%) — searching directly for the target rate avoids that. Real rates land 6–9.5% across the table, comfortably at or under target:

| Confident domains | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Threshold | 0.60 | 0.90 | 1.05 | 1.15 | 1.15 | 1.18 | 1.22 | 1.26 | 1.29 |
| False-positive rate | 8.5% | 7.3% | 6.7% | 6.2% | 9.4% | 9.0% | 9.0% | 9.3% | 9.1% |

**Worked example**: Healthcare `[4, 4, 3]` (avg 3.67), Mobility `[2, 1]` (avg 1.5), Finances `[3]` (n=1, excluded), Education `[3, 4, 3, 3]` (avg 3.25). Own baseline = `(3.67 + 1.5 + 3.25) / 3 = 2.81`. Deviations: Healthcare +0.86, Mobility −1.31, Education +0.44. Standout = Mobility (cool) → **The Backseat Driver**.

**Archetype set (22 total)**

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
| — | The Even Keel | ≥2 confident domains, max\|deviation\| below the standout threshold for that domain count | "You're remarkably consistent — whatever your take on AI, it holds steady across everything you've rated so far, no domain pulling ahead of the rest." |
| — | The Blank Slate | <2 confident domains | "You haven't rated enough across different domains yet for a clear lean to show — keep going and we'll find where you stand out." |
