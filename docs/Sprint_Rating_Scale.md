# Design Sprint: Rating Scale
**Product:** AI Use Case Sentiment Explorer
**Sprint focus:** Defining the narrative axis (or axes) visitors use to rate AI use cases
**Status:** In review — decision blocks data model and all visualizations
**Owner:** Design

---

## Why this decision matters

The rating scale is the most foundational design decision in the product. It determines:

- What data gets collected and what questions it can answer
- The emotional register of the entire experience — analytical vs. affective vs. moral
- What the individual results visualization can show
- What the aggregate comparison can surface
- What the shareable artifact communicates about the visitor

Getting this wrong means rebuilding the data model, the UI, and the visualization layer. It should be resolved before any engineering tickets are written.

---

## The five options

### A. Human ↔ AI
*"Who or what is really making this?"*

The **authorship axis**. Visitors place each use case on a spectrum from fully human-made to fully AI-made.

| | |
|---|---|
| **What it produces** | Data about perceived AI agency per use case — e.g., "visitors see AI therapy as more 'AI' than AI music generation" |
| **Emotional register** | Analytical, slightly academic. Feels like a classification task. |
| **Risk** | Visitors may feel there's a "correct" answer rather than an opinion. Some use cases are objectively more AI-driven, which reduces expressiveness. |
| **Best for** | Visitors who already have opinions about AI and want to articulate them precisely. |

---

### B. Uneasy ↔ Enthusiastic
*"How does this make you feel?"*

The **comfort axis**. Purely affective — no right answer, just gut reaction.

| | |
|---|---|
| **What it produces** | Sentiment data by use case — e.g., "visitors are enthusiastic about AI coding tools but uneasy about AI companionship" |
| **Emotional register** | Personal, honest, low-stakes. Feels like a confessional or a vibe check — culturally native to a Millennial/Gen Z audience. |
| **Risk** | Less intellectual depth. Visitors may not feel like they learned something about *why* they feel how they feel. |
| **Best for** | Maximum completion rates and shareability. Easier to form a strong opinion on comfort than on authorship. |

---

### C. Should Exist ↔ Should Not Exist
*"Do you think this is okay?"*

The **normative/ethical axis**. The most provocative framing — asks visitors to take a moral stance, not just report a feeling or classify a tool.

| | |
|---|---|
| **What it produces** | Ethical permissibility data — e.g., "most visitors think AI medical diagnosis should exist but AI courtroom arguments should not" |
| **Emotional register** | Charged, opinionated, tribal. Can feel empowering or anxiety-inducing depending on the use case. |
| **Risk** | Highest drop-off potential on use cases where visitors feel unqualified to have an opinion. Risks feeling political. |
| **Best for** | The most differentiated and shareable data — strong opinions drive sharing. Best as a *secondary* axis rather than primary. |

---

### D. Replaces Humans ↔ Augments Humans
*"Is this AI working with us or instead of us?"*

The **labor/agency axis**. More nuanced than A but still analytical. Asks visitors to think about the relationship between AI and human workers rather than just the output.

| | |
|---|---|
| **What it produces** | Data on perceived human displacement — e.g., "visitors see AI customer service as replacing humans, but AI design tools as augmenting them" |
| **Emotional register** | Thoughtful, slightly anxious — mirrors the broader cultural conversation about AI and jobs. |
| **Risk** | Requires more cognitive effort per use case. Visitors may not feel informed enough about labor dynamics in specialized fields. |
| **Best for** | Pairing with the AI Impact Explainer (P1 #9) — forms a natural narrative bridge between rating and impact content. |

---

### E. Trust ↔ Distrust
*"Would you rely on this?"*

The **credibility axis**. Asks visitors how much they'd personally depend on AI in a given context — closer to a consumer behavior question than a philosophical one.

| | |
|---|---|
| **What it produces** | Practical adoption intent data — e.g., "visitors trust AI navigation but distrust AI mental health support" |
| **Emotional register** | Pragmatic and personal. Feels like it has stakes — "would *you* actually use this?" |
| **Risk** | Collapses nuance. A visitor might trust AI music generation as a product but still feel uneasy about it culturally — the two are different things. |
| **Best for** | If the product goal leans toward consumer behavior insight over cultural attitude mapping. |

---

## Recommendation

### Primary axis: B — Uneasy ↔ Enthusiastic

The most emotionally native framing for a Millennial/Gen Z audience. Produces the clearest shareable narrative ("your gut reactions to AI") and maximizes completion. The poles should be renamed to something more vivid — e.g., *"makes me nervous" ↔ "I'm here for it"* — to read as distinctly conversational in register.

### Secondary axis to consider: C — Should Exist ↔ Should Not Exist

Run as a second pass after the primary rating, or as an optional "hot take" layer. The most likely to generate strong opinions and therefore social sharing. The combination of *how it makes you feel* + *whether you think it should exist* produces a genuinely rich 2D profile per visitor.

### Future pairing: D — Replaces ↔ Augments

Worth revisiting once the AI Impact Explainer (P1 #9) is in scope. Would form a natural narrative bridge between the rating experience and the impact content layer.

---

## Comparison at a glance

| Option | Axis type | Emotional register | Completion risk | Data richness | Shareability |
|---|---|---|---|---|---|
| A. Human ↔ AI | Authorship | Analytical | Medium | Medium | Low |
| B. Uneasy ↔ Enthusiastic | Affective | Personal / low-stakes | Low | Medium | High |
| C. Should Exist ↔ Should Not | Normative | Charged / opinionated | High | High | Very high |
| D. Replaces ↔ Augments | Labor/agency | Thoughtful / anxious | Medium-high | High | Medium |
| E. Trust ↔ Distrust | Credibility | Pragmatic | Low | Medium | Medium |

---

## Decision needed

- [ ] Confirm primary axis
- [ ] Confirm whether a secondary axis is in scope for v1 or P1
- [ ] If B is primary: agree on final pole language (e.g., "makes me nervous" ↔ "I'm here for it")
- [ ] If C is secondary: decide whether it runs in parallel per use case or as a separate pass after primary rating

**This decision blocks:** data model design, individual results visualization type (Open Question #2), and aggregate comparison view logic.
