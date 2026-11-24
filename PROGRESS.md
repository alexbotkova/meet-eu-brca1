# Project progress

Last updated: 2026-11-24. This is a shared summary of verified work, not an automatic record of everything each person has done. Check linked Jira issues, branches and pull requests for current status. Add a short dated entry after substantive work and link to evidence; do not attribute or mark work complete without confirmation.

## Current status

- **Course materials:** copied from the public course repository's `main` at commit `602247e3155700aa2d306fd92d3378fd0286d49f`. The source snapshot contains the frozen ClinVar files, course PDFs and a BRCA1 alignment. The copy has no upstream Git history.
- **Split:** position grouping and domain / neighbour handling are tracked in [KAN-5](https://meeteu.atlassian.net/browse/KAN-5) and [KAN-10](https://meeteu.atlassian.net/browse/KAN-10). A pre-registered split file was not found in the supplied materials; confirm team status before stating otherwise.
- **Features:** work is planned in the [Features epic](https://meeteu.atlassian.net/browse/KAN-12). The supplied alignment should be inspected before deciding whether to build another.
- **Visualisation:** an interactive BRCA1 protein viewer is tracked in [KAN-9](https://meeteu.atlassian.net/browse/KAN-9).
- **Baselines, classifier and final predictions:** no implementation or results are included in this initial copy; confirm team status before making claims about work elsewhere.

## Recent work

### 2026-11-24 — Repository setup

- Prepared a history-free team copy of the course materials and initial planning / collaboration documents. Created the public GitHub repository and verified that the main-branch protection rule applies. The initial project setup is being proposed in a pull request.
- Existing local paper guides and downloaded papers in the separate `shared-material/BRCA1-key-references/` folder were not automatically copied into this repository.

## Next actions

- Agree and pre-register the split policy before model fitting.
- Inspect the supplied MSA, document its origin and evaluate its suitability for conservation analysis.
- Identify and assess two baseline predictors and investigate assay data and coverage.
- Decide the prediction unit and variant-specific output strategy.

## Open questions and blockers

- Team access and the merge of the initial setup pull request need to be arranged.
- Split proportions, neighbouring-position handling and domain treatment are undecided.
- Coverage and data overlap for external scores and assays have not yet been established in this repository.

## Entry template

### YYYY-MM-DD — contributor (if known)

- **Work:** concise description of what was done.
- **Evidence:** issue, commit / PR, file or reproducible result.
- **Next / blockers:** remaining work, uncertainty or relevant decision.
