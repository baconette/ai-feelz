# Product Specification & Context

## 1. Vision & Strategy
* **Core Value Proposition**: [One-sentence summary of the product's primary value]
* **Target Audience**: [Define who uses this software and their main pain points]
* **Success Metrics**: [List 2-3 key business or engagement indicators]

## 2. Core Features & Scope
* **User Authentication**: [Brief summary of registration/login mechanics]
* **Primary Workflows**:
  * [Workflow A]: [Input -> Process -> Expected Output]
  * [Workflow B]: [Input -> Process -> Expected Output]
* **Out of Scope**: [Crucial negative constraints: list what the product will NOT do]

## 3. Product Persona & User Experience (UX)
* **Tone & Voice**: [e.g., Technical, concise, error-forgiving, minimalist]
* **UI Design Token Anchors**: Refer to global theme styles when generating components.
* **UX Principles**:
  * Prioritize low-latency interactions over complex animations.
  * Fail gracefully with descriptive, non-technical error messages.

## 4. Business & Domain Rules
* **Strict Calculations**: [e.g., Always apply regional tax logic post-discount]
* **Data Guardrails**: [e.g., Anonymize all user metadata before logging external events]
* **Term Glossary**:
  * `[Term A]`: [Precise definition to prevent AI inference errors]
  * `[Term B]`: [Precise definition to prevent AI inference errors]

## 5. Feature Implementation Workflow
* **Step 1 - Planning**: Write a 3-sentence functional design doc before modifying files.
* **Step 2 - Verification**: Define explicit acceptance criteria first.
* **Step 3 - Surgical Execution**: Change only the files strictly required by the user story.
