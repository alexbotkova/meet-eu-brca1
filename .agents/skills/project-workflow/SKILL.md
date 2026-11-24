---
name: project-workflow
description: Carry out substantive work in the Meet-EU BRCA1 repository while preserving the frozen data, split policy, verified shared progress and team pull-request conventions.
---

# BRCA1 team workflow

1. Read `README.md`, `PLAN.md` and `PROGRESS.md`, plus the relevant task and source documentation. Distinguish established decisions from proposals and verify the state of files or linked work before relying on it.
2. Perform the authorized task. Preserve the frozen ClinVar snapshot and pre-registered split, keep all prediction targets, and document data provenance, missingness and potential leakage. Coordinate independent feature work without using held-out labels for model selection.
3. Validate the actual changes appropriately. Record uncertainty and limitations, and never invent results, authorship, teammate progress or completion.
4. For substantive work, update `PROGRESS.md` with a concise dated entry, a contributor only if known, evidence and next steps or blockers. Preserve concurrent entries. Follow higher-priority user approval requirements; do not make a progress edit for read-only answers.
5. Propose substantive shared-plan changes through a PR. Follow `CONTRIBUTING.md` for branch and semantic commit naming. Do not commit, push, create a PR or modify external settings without authorization.
