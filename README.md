# Meet-EU BRCA1 team project

A shared workspace for the Meet-EU project on predicting the effects and mechanisms of BRCA1 missense variants. This is a history-free copy of the course materials, extended with team documentation and collaboration guidance.

## Start here

- [PLAN.md](PLAN.md): research objectives, course requirements and team decisions.
- [PROGRESS.md](PROGRESS.md): current status, recent work and next actions.
- [CONTRIBUTING.md](CONTRIBUTING.md): branches, commit messages and pull requests.
- [AGENTS.md](AGENTS.md): guidance for coding agents working in this repository.
- [Course overview](COURSE_README.md), [project plan](Docs/brca1_variant_project_plan.pdf) and [dataset description](Data/README.md).
- [BRCA1 protein structure notes](Docs/BRCA1_STRUCTURE_NOTES.md): biological context, structural evidence and current uncertainties.
- [BRCA1 protein explorer](viewer/README.md): instructions for running the KAN-9 interactive viewer locally.
- [Jira project](https://meeteu.atlassian.net/jira/software/projects/KAN/boards): team work items; access depends on the team member's Jira permissions.

## Course data

`Data/` contains the instructors' frozen ClinVar files and an alignment included in the course repository. Keep the ClinVar snapshot unchanged. It comprises 4,606 target variants, 696 reference-labelled variants and the full 6,463-record query. See [Data/README.md](Data/README.md) and file headers before processing them.

The reference materials came from [meet-eu-26-27/shared-material](https://github.com/meet-eu-26-27/shared-material), `main` commit `602247e3155700aa2d306fd92d3378fd0286d49f` (checked 2026-11-24). That commit ID records provenance; the copy does not retain the source repository's Git history. `COURSE_README.md` preserves its original README content. Course updates should be reviewed and incorporated deliberately without refreshing the frozen ClinVar prediction set.

## Team workflow

Work on a feature branch, update progress with verified work, and open a pull request into `main`. The `main` branch is configured to require pull requests without requiring reviewer approval. The repository does not yet contain an implemented classifier or reproducible pipeline.

The course materials include a BRCA1 alignment at [Data/aliP38398.fasta](Data/aliP38398.fasta). Investigate its source and suitability before deciding whether to build or replace an alignment.
