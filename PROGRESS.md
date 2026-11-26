# Project progress

Last updated: 2026-11-26. This is a shared summary of verified work, not an automatic record of everything each person has done. Check linked Jira issues, branches and pull requests for current status. Add a short dated entry after substantive work and link to evidence; do not attribute or mark work complete without confirmation.

## Current status

- **Course materials:** copied from the public course repository's `main` at commit `602247e3155700aa2d306fd92d3378fd0286d49f`. The source snapshot contains the frozen ClinVar files, course PDFs and a BRCA1 alignment. The copy has no upstream Git history.
- **Split:** position grouping and domain / neighbour handling are tracked in [KAN-5](https://meeteu.atlassian.net/browse/KAN-5) and [KAN-10](https://meeteu.atlassian.net/browse/KAN-10). A pre-registered split file was not found in the supplied materials; confirm team status before stating otherwise.
- **Features:** work is planned in the [Features epic](https://meeteu.atlassian.net/browse/KAN-12). The supplied alignment should be inspected before deciding whether to build another.
- **Visualisation:** an interactive BRCA1 protein viewer is tracked in [KAN-9](https://meeteu.atlassian.net/browse/KAN-9).
- **Baselines, classifier and final predictions:** no implementation or results are included in this initial copy; confirm team status before making claims about work elsewhere.

## Recent work

### 2026-11-26 — Viewer deployment preparation

- **Work:** Prepared a GitHub Actions workflow to validate the viewer and publish its static files to GitHub Pages after changes reach `main`. Set the repository's Pages source to GitHub Actions.
- **Evidence:** [deployment workflow](.github/workflows/deploy-viewer.yml) and [viewer deployment instructions](viewer/README.md).
- **Next / blockers:** Commit and push the workflow, merge it into `main`, and verify the first deployment.

### 2026-11-25 — KAN-9 viewer prototype

- **Work:** Added a browser-based BRCA1 reference-protein explorer with AlphaFold confidence, frozen ClinVar record filtering, residue search and separate human experimental and mouse homolog views. The dataset itself and split policy are unchanged.
- **Evidence:** [viewer documentation](viewer/README.md), [data preparation](scripts/prepare_viewer_data.py), [structure checks](scripts/check_viewer_structures.py) and [dataset tests](tests/test_viewer_data.py). The 6,388 single-substitution records map without reference-residue mismatches; all 4,606 targets are included. Human 7LYB and 8RS8 resolved sequences match their respective displayed regions; 7K3S differs at six of 30 aligned mouse residues.
- **Next / blockers:** Review the prototype and its classification display with the team; it requires network access and WebGL. Interactive overlay, publication and final project integration are not included.
- **Interface update:** Reworked the prototype into a compact viewer with a sequence navigation strip and a tabular residue-details panel, following user feedback.
- **Workflow:** Renamed the local work branch to `feature/kan-9-protein-viewer` and updated [CONTRIBUTING.md](CONTRIBUTING.md) to use tool-neutral branch and commit descriptions.
- **Range selection:** Added separate zoom shortcuts and combinable region-visibility controls, including a custom human-residue range; partial or missing experimental coverage is reported in the viewer. The two candidate low-confidence AlphaFold helices (372–390 and 849–863) are selectable separately from the remaining regions; neither selection is an experimental disorder annotation. Updated the script URL version to prevent browsers from pairing the new buttons with cached old region logic.
- **Classification display:** Added multi-select classification filters, separate colored markers for positions with multiple selected categories, and dataset / visible-structure counts, including prediction-target coverage.
- **Research notes:** Added [BRCA1 protein structure notes](Docs/BRCA1_STRUCTURE_NOTES.md) covering the selected experimental structures, AlphaFold confidence and current uncertainties; linked them from the project README.

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
