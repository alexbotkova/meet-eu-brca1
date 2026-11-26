# BRCA1 protein structure: research notes

Last updated: 2026-11-25. These are working notes for the team, not a clinical interpretation or a record of agreed modelling decisions. Update the evidence and date as the project develops. For viewer controls, exact files, checksums and residue-mapping checks, see the [protein explorer documentation](../viewer/README.md).

## What is being shown?

**BRCA1 is the gene; the BRCA1 protein is its product.** The protein participates in maintaining genome integrity, including repair of DNA double-strand breaks. It interacts with different partners through different regions. The viewer depicts protein structures, rather than the DNA gene.

The course's frozen dataset uses transcript **NM_007294.4** and protein **NP_009225.1**, 1,863 amino acids long ([dataset documentation](../Data/README.md)). For the full-length view we use the human canonical BRCA1 model **AF-P38398-F1, version 6**, associated with [UniProt P38398](https://www.uniprot.org/uniprotkb/P38398/entry) and the [AlphaFold database](https://alphafold.ebi.ac.uk/entry/P38398). The frozen single-substitution records' reference amino acids agree with the AlphaFold sequence at their reported positions; this check does not independently validate every genomic or transcript-level mapping.

## Regions and available structural evidence

| Region | Biological context | What we use and what it supports |
|---|---|---|
| **RING and flanks** | Near the start of BRCA1. The RING region participates in binding **BARD1**; zinc coordination contributes to its structure. | [7LYB](https://www.rcsb.org/structure/7LYB) is an experimental **human** cryo-EM structure of a larger complex; our view uses BRCA1 author chain M residues **4–97** and can show BARD1. Reported overall resolution is **3.28 Å**. The viewer's 1–109 navigation preset is broader than the resolved BRCA1 coordinates in this entry. |
| **Coiled-coil** | A region that can bind **PALB2**, connecting BRCA1 with the BRCA2 repair machinery. | [7K3S](https://www.rcsb.org/structure/7K3S) is an experimental solution-NMR structure of a **mouse** BRCA1–PALB2 heterodimer. Mouse BRCA1 construct positions 15–44 align to human positions **1394–1423**; 24 of 30 residues are identical. It is a useful homolog comparison, not an experimental human structure. Its NMR ensemble does not have a directly comparable crystallographic resolution in ångströms. |
| **BRCT repeats** | Near the end of BRCA1. The tandem repeats recognize phosphorylated motifs in partner proteins. | [8RS8](https://www.rcsb.org/structure/8RS8) is an experimental **human** X-ray structure of BRCT with a RIF1 phosphopeptide, with reported **1.31 Å** resolution. The displayed BRCA1 chain A has resolved residues **1650–1859**; the 1646–1859 navigation preset is a broader selection. |
| **Central and remaining regions** | Much of the long central region is flexible, with interaction and regulatory functions; lack of a stable fold does not mean lack of function. | Experiments on central-region fragments found that much of the region lacks independently folded globular domains and that fragments can interact with DNA or proteins ([Mark et al., 2005](https://pubmed.ncbi.nlm.nih.gov/15571721/)). A separate study identified DNA binding in a larger **340–554** fragment ([Naseem et al., 2006](https://pmc.ncbi.nlm.nih.gov/articles/PMC1462700/)). These results do not establish an atomic structure or the behavior of every residue. |

The structure entries are examples selected for the viewer, not an exhaustive ranking of every available experimental BRCA1 structure. Overall resolution, construct sequence, local quality, molecular partners, missing residues, and relevance to the biological question all matter when choosing a structure.

## AlphaFold predictions and confidence

AlphaFold provides a **predicted model** of the full 1,863-residue human reference protein. Its coordinates cover the sequence; they do not demonstrate that every displayed region has a stable, experimentally confirmed shape. The model used here is a BRCA1 monomer and does not contain BARD1 or PALB2.

- **pLDDT** is a per-residue estimate of confidence in the local predicted structure. A low score is a reason for caution, not proof by itself that a residue is disordered or unimportant. A flexible region may adopt structure under particular binding conditions.
- **PAE** describes predicted uncertainty in the relative positions of pairs of residues. It is relevant when judging the arrangement of distant domains; a confident local fold alone does not establish a reliable whole-protein arrangement. See the [EMBL-EBI guide to model confidence](https://www.ebi.ac.uk/training/online/courses/analysing-evaluating-macromolecular-models/global-quality-assessment/key-global-validation-metrics/metrics-based-on-experimental-data-fit/key-things-alphafold/). The current viewer displays pLDDT, not a PAE plot.
- The viewer's **Remaining regions** control is a convenience for showing the sequence outside the named selections. It is **not** a residue-by-residue disorder annotation. It includes regions thought to be largely disordered, but the boundaries were not derived from a disorder predictor or an experiment.

### Two candidate helices

During a local PyMOL inspection of AlphaFold model v6, we identified two **candidate** helical segments around human residues **372–390** and **849–863**. The current viewer groups those ranges under **Predicted helices** so they can be examined separately. The boundaries are model-dependent navigation choices; we have not confirmed that they correspond to every helix noticed visually or established that these precise segments form stable helices in cells.

In the model file used for the viewer, their pLDDT values range approximately **33–67** and **37–65**, respectively. These are mostly low-confidence predictions. We did not find a suitable experimental atomic structure for either exact segment in our preliminary search; that is not an exhaustive proof that no relevant structure exists. The DNA-binding result for the broader 340–554 fragment does not establish the 372–390 helix.

## Using structures for this project

- Use structural views to **generate hypotheses**, such as a substitution affecting a fold, zinc coordination or a protein interface. A residue's position alone does not establish a mechanism or clinical classification.
- A displayed structure is of the **reference protein or experimental construct**; coloring a variant position does not create or validate a mutant structure. Different substitutions—and different DNA changes producing the same substitution—can have different effects.
- The selected PDB structures are separate local views. Aligning fragments independently to a full-length prediction can be useful for comparison, but does not validate the full-length relative placement of domains or partners.
- Record whether evidence is experimental or predicted, the organism, structure and chain, modeled residues, confidence or experimental quality, and any mapping uncertainty. Missing structural evidence is not evidence of no effect.
- The protein-only view does not show possible effects on **RNA splicing**. Assess those separately at the DNA/transcript level. All 4,606 prediction targets still need to be retained, including those with limited structural evidence.

## Questions to revisit

- Are there additional relevant human experimental structures or complexes with better coverage or more appropriate biological context for specific questions?
- How much of the frozen target set is covered by each structure after validated residue mapping? What structural features are missing or unreliable elsewhere?
- Which evidence supports disorder, binding, or a particular mechanism for an individual region or substitution? Keep predictions and experimental measurements distinct.
- If structural or external predictor scores are used for modelling, how were they generated, which variants do they cover, and could their training or evidence overlap with ClinVar labels?
