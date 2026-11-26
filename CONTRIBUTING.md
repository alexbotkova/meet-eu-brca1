# Contributing

## Branches and pull requests

Create a short-lived branch for each task; avoid direct work on `main`. Examples:

- `feature/kan-11-conservation`
- `fix/kan-14-residue-mapping`
- `docs/kan-5-split-policy`
- `feature/kan-9-protein-viewer`

Branch names should describe the work, regardless of the tools used. Use a Jira key when available. Open a pull request targeting `main`; describe the problem, work completed, validation and limitations. Include a factual `PROGRESS.md` update for meaningful work and resolve conflicts without dropping another contributor's entries. Propose substantive `PLAN.md` changes through a PR and flag any research decision that needs discussion.

The configured repository setting requires a PR for changes to `main`, with zero required approvals, no force pushes or branch deletion, and administrator bypass disabled. GitHub enforces the branch protection rule while the public repository remains eligible for it. A PR can be merged without approval by a user with sufficient permission if zero reviews are required.

## Semantic commit messages

Use the [Semantic Commit Messages guide](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716): `<type>: <short present-tense description>`; a scope is optional in the guide. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Examples:

- `feat: add conservation scoring`
- `fix: correct BRCA1 residue mapping`
- `docs: explain the split policy`
- `test: check for position overlap`

Commit messages should describe the work, regardless of the tools used. Personal agent instructions may impose a stricter format for that agent's own work.

## Data and research safeguards

Keep the frozen course data intact; document external sources, version and licence or usage permissions. Do not commit credentials, private data or papers without suitable redistribution permission. Pre-register the split before fitting, keep the final test set for final evaluation and report potential circularity. Follow [PLAN.md](PLAN.md) and the course plan.
