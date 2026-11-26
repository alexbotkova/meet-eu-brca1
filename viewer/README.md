# BRCA1 protein explorer — KAN-9

A browser-based research viewer for the frozen ClinVar snapshot. It is a reference-protein visualization, not a prediction of mutant structures or a clinical interpretation tool. No classifier or test split is created here.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory viewer
```

Open <http://127.0.0.1:8000/>. The browser needs WebGL and internet access: it loads 3Dmol.js 2.5.5 from cdnjs, structures from AlphaFold DB and RCSB PDB. These services will see the browser's network request. No ClinVar rows or search selections are sent to these services by the viewer. Keep the terminal running while using the page. Opening the HTML directly as a file is not supported. When changing `app.js`, update its version query in `index.html` so returning browsers load the matching script.

## GitHub Pages

The [deployment workflow](../.github/workflows/deploy-viewer.yml) checks pull requests targeting `main` and publishes the `viewer/` directory after validation on `main`. Set the repository's **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Once the workflow has been merged and successfully deployed, the expected public address is <https://alexbotkova.github.io/meet-eu-brca1/>. The page and its published files are publicly accessible; it still needs WebGL and access to the external services described above. A workflow can also be started manually from `main` in the Actions tab.

## Interactions

- Drag to rotate, scroll to zoom and Ctrl-drag to translate. Search for a human position or select a residue on the structure. A gold sphere marks the selected position.
- Use **Color by** to switch between confidence/structure coloring and ClinVar classifications. The classification checkboxes allow any combination; initially pathogenic/likely pathogenic and benign/likely benign are selected. Uncertain, conflicting and unclassified records are initially hidden, so the displayed count makes clear that none of the 4,606 target records match until the relevant categories are selected.
- In classification mode, a position matching one selected category has that category's color. If multiple selected categories occur at a position, separate colored dots mark it. Dot positions are offset for visibility and do not represent variant structures or imply that the same variant has all those labels. Click a dot or residue to inspect the individual records. Gray means no selected match or an overlap represented by dots; it does not mean benign. Unchecking every category gives no matches.
- The filter applies to the 3D coloring and details table. Counts distinguish matching records and positions in the entire frozen snapshot, the number of matching prediction targets, and records and positions present in the currently selected structure and visible regions. A count is of ClinVar records, not necessarily unique protein substitutions.
- **Zoom to** focuses the camera on a representative residue within RING, coiled-coil or BRCT. If that residue is hidden or unavailable in the selected structure, its details explain why it cannot be shown.
- Under **Show regions**, choose any combination of RING plus flanking helices (1–109), coiled-coil (1391–1424), BRCT including its linker (1646–1859), **Predicted helices** (372–390 and 849–863), and **Remaining regions** (110–371, 391–848, 864–1390, 1425–1645 and 1860–1863). The helix ranges are candidate secondary structures from the AlphaFold model, not experimentally confirmed structures; their confidence is mostly low. The remaining category includes largely disordered stretches but is not a disorder annotation. Region choices change visibility without moving the camera. With no choices active, the full protein is shown; **Show full protein** clears them all.
- Drag across the sequence track or enter inclusive human reference positions and select **Apply range** to add one custom range to the active regions. Applying another range replaces the previous custom range; **Remove custom range** removes it. The track gives an approximate selection and the numbered inputs allow exact boundaries.
- Selections persist when changing structures. The coverage message reports the intersection with modeled residues; an empty selection can still show a binding partner if **Show partners** is checked. If a searched residue lies outside the currently visible regions, its records remain visible with a warning. These ranges are navigational choices, not an assertion that other residues have no function.
- Individual records remain separate even when different DNA changes produce the same amino-acid substitution. Each record links to ClinVar, whose live page may have changed since the frozen snapshot.
- For 7K3S, human positions 1394–1423 map to mouse construct numbering 15–44; the panel reports the reference differences. The human records describe homologous positions only. The PDB parser displays its first NMR model, not the complete ensemble.

## Data preparation and validation

`variants.json` is a generated derivative of `Data/brca1_clinvar_2026-10-05_all.tsv`, not a replacement for it. It preserves each single-amino-acid-substitution record, including unclassified records. The 75 records that are not single substitutions on the reference transcript cannot be mapped as single substitutions and are omitted from the viewer, not deleted from the source. All 4,606 prediction targets remain represented. The model's reference residue agrees with all 6,388 mapped records; this validates their amino-acid references against the model but is not an independent verification of every transcript or genomic mapping.

To reproduce the JSON, download the exact [AlphaFold P38398 v6 PDB](https://alphafold.ebi.ac.uk/files/AF-P38398-F1-model_v6.pdb) and run:

```sh
python3 scripts/prepare_viewer_data.py --model /path/to/AF-P38398-F1-model_v6.pdb
python3 -m unittest discover -s tests -v
```

The script verifies the model's SHA-256 and refuses mismatched reference residues, unexpected input counts or a different target count. The JSON records both input hashes. The viewer verifies structure-file hashes before displaying their mappings; if the upstream file changes or cannot be fetched it reports a failure rather than applying stale mappings. These checks require a secure browser context (localhost or HTTPS).

To reproduce the experimental-chain checks as well, install Biopython separately, download [7LYB.cif](https://files.rcsb.org/download/7LYB.cif), [8RS8.cif](https://files.rcsb.org/download/8RS8.cif), and [7K3S.pdb](https://files.rcsb.org/download/7K3S.pdb) into one directory, and run `python3 scripts/check_viewer_structures.py /path/to/structures`.

## Structure provenance and mapping

| Structure | Source and display | Reference mapping checked for displayed chain |
|---|---|---|
| AF-P38398-F1 v6 | [AlphaFold DB](https://alphafold.ebi.ac.uk/entry/P38398), human predicted monomer, PDB | Chain A residues 1–1863; pLDDT read from PDB B-factor field. |
| 7LYB | [RCSB](https://www.rcsb.org/structure/7LYB), human, cryo-EM 3.28 Å; BRCA1 and BARD1 only | Author chain M residues 4–97: 94/94 residues agree with the AlphaFold human reference. BARD1 is author chain N. |
| 8RS8 | [RCSB](https://www.rcsb.org/structure/8RS8), human, X-ray 1.31 Å; BRCA1 and RIF1 peptide | Author chain A residues 1650–1859: 210/210 agree with the human reference. Peptide is author chain E. |
| 7K3S | [RCSB](https://www.rcsb.org/structure/7K3S), mouse, solution NMR; first model | Mouse BRCA1 chain A construct 15–44 corresponds to human 1394–1423; 24/30 identical. Differences human → mouse: D1398A, Q1401K, H1402Y, E1413H, H1421R, S1423N. PALB2 is chain B. |

Human-chain checks compare the experimental coordinates' resolved amino acids with the AlphaFold sequence at matching author numbers. The mouse mapping comes from a local sequence alignment and should be interpreted as a homology comparison. The app displays separate structures; it does not superimpose them. Other partner chains, ligands and unresolved residues are not necessarily shown. No claim is made about the relative global positions of independently folded regions.

## Known limitations

- Requires a functioning internet connection and external services; no offline bundle is included.
- Local structure files are not bundled. Exact hashes protect mappings but an upstream revision will require an intentional review.
- Clicking and rendering depend on WebGL and browser support. Classification colors are not a pathogenicity prediction and do not express biological evidence strength.
- The 7K3S mouse mapping is only exposed for the 30 aligned residues. No human structure or human mutation structure is inferred from it.
