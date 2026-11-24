# BRCA1 variant project plan

Status: initial team draft, 2026-11-24. This file records requirements, proposed approaches and open decisions; a proposal is not an implemented result. Update shared research decisions through a pull request and explain the reasoning. The [instructors' project plan](Docs/brca1_variant_project_plan.pdf) takes precedence for course requirements.

## Objective and deliverables

Predict whether each of the 4,606 BRCA1 target variants damages function, with a calibrated probability and uncertainty. Provide a damaging / tolerated / unknown call and an evidence-supported mechanism for damaging variants; use `damaging, mechanism unknown` when evidence is insufficient. Deliver one row for every target, ten mechanism cards, a pre-registered split-policy file, methods report, reproducible code and final presentation/poster as specified by the course.

The initial source is the frozen ClinVar snapshot dated 2026-10-05: 4,606 targets, 696 reference-labelled variants and a full query extract. Do not refresh or rebuild the prediction set. Record the source and version of additional evidence. The core data are in [Data/](Data/); the course repository and source commit are documented in [README.md](README.md).

## Prediction unit — open team decision

The team is considering a residue-oriented approach and position-level features. The required output, however, is one prediction for each variant. Different substitutions at the same residue may have different effects, and distinct DNA changes can produce the same amino-acid change while affecting splicing differently. Decide whether and how a residue-level model will generate variant-specific outputs; do not assume all substitutions at a position are equivalent.

## Validation and split — planned, not yet declared

Before fitting or label-informed tuning, agree and pre-register a train / validation / test split and rationale covering every labelled variant used. A position-grouped split is planned for investigation in [KAN-5](https://meeteu.atlassian.net/browse/KAN-5); [KAN-10](https://meeteu.atlassian.net/browse/KAN-10) covers neighbouring positions and domains. The actual grouping, boundaries, proportions and treatment of external labelled data remain team decisions until documented and approved.

Keep the prediction targets separate from labelled train / validation / test assignments. Fit learned preprocessing and model parameters only on the appropriate training partition; use validation for development and reserve the test partition for final evaluation. Document pretraining and assay/clinical-label overlap: grouping the team's split does not remove external data circularity.

## Proposed pipeline

1. **Curate and map variants:** preserve genomic, transcript and protein identifiers; validate strand, genome build, reference residue and multi-nucleotide cases.
2. **Prepare features:** investigate evolutionary conservation and protein language-model scores; structural stability, exposure, contacts and model confidence; interaction and modification-site context; RNA/splicing evidence; and available assay and population-frequency information. Track provenance, coverage and missingness.
3. **Establish baselines:** reproduce at least two published predictors; compare on equivalent held-out cases and disclose overlap and coverage.
4. **Model and calibrate:** combine at least two independent kinds of evidence as required by the course. The model type and representation are open decisions. Distinguish measured assay effects, clinical reference classifications and predicted functional damage.
5. **Evaluate:** report discrimination, calibration, uncertainty, coverage, abstention and appropriate confidence intervals; perform the required shuffled-label negative control. Make no label-informed selections using final test outcomes.
6. **Assign mechanisms and produce results:** support mechanism calls with biological evidence, preserve an unknown option, generate one output row per target, and select ten evidence-based mechanism cards.

Every stage should be reproducible from documented inputs. Scores may be unavailable for some variants; missing is not zero or evidence of no effect.

## Initial parallel work

- Split design and the handling of neighbours/domains: [KAN-5](https://meeteu.atlassian.net/browse/KAN-5), [KAN-10](https://meeteu.atlassian.net/browse/KAN-10).
- Explore the existing course alignment and conservation features: [KAN-11](https://meeteu.atlassian.net/browse/KAN-11). Its suitability and any processing remain to be evaluated.
- Protein language-model, structural, interface, modification-site and RNA features: [Features epic](https://meeteu.atlassian.net/browse/KAN-12).
- Map evidence coverage: [KAN-24](https://meeteu.atlassian.net/browse/KAN-24).
- Interactive BRCA1 protein visualisation: [KAN-9](https://meeteu.atlassian.net/browse/KAN-9).
- Investigate assay data and reproduce two published baselines before the mid-term.

## Course dates

- Mid-term checkpoint: 2026-12-04.
- Submission freeze: 2027-01-26.
- Final workshop: 2027-01-29, Warsaw.

## Open decisions

- Exact prediction unit and how outputs distinguish substitutions and DNA-level effects.
- Split policy, domain boundaries, neighbour handling, class balance and external labelled-data overlap.
- Which baseline tools and feature sources to use; their versions, coverage, licences and pretraining data.
- Model architecture, probability calibration, uncertainty and abstention rules.
- Evidence and mechanism-integration strategy, including how to handle absent or conflicting information.
- Repository owner, collaborators and actual branch-protection availability.
