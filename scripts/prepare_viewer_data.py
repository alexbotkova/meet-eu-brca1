#!/usr/bin/env python3
"""Prepare viewer data from the frozen snapshot and a pinned AlphaFold v6 PDB."""
import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Data/brca1_clinvar_2026-10-05_all.tsv'
OUTPUT = ROOT / 'viewer/variants.json'
AA = dict(zip('ALA ARG ASN ASP CYS GLN GLU GLY HIS ILE LEU LYS MET PHE PRO SER THR TRP TYR VAL'.split(), 'ARNDCQEGHILKMFPSTWYV'))
EXPECTED_MODEL_SHA256 = 'b2af213e2ef20f95c349a2159d628321205ad55b64511dd9e891b8a652d8a1a4'


def read_model(path):
    residues = {}
    for line in path.read_text().splitlines():
        if line.startswith('ATOM  ') and line[12:16].strip() == 'CA' and line[21:22] == 'A':
            pos = int(line[22:26])
            residues[pos] = {'aa': AA[line[17:20]], 'plddt': float(line[60:66])}
    if set(residues) != set(range(1, 1864)):
        raise ValueError('Model is not the expected full-length 1,863-residue chain A')
    return residues


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', type=Path, required=True, help='AF-P38398-F1-model_v6.pdb downloaded from AlphaFold DB')
    parser.add_argument('--output', type=Path, default=OUTPUT)
    args = parser.parse_args()
    if hashlib.sha256(args.model.read_bytes()).hexdigest() != EXPECTED_MODEL_SHA256:
        raise ValueError('Unexpected AlphaFold model bytes; use the documented P38398 v6 file')
    model = read_model(args.model)
    fields = ['variation_id','accession','hgvs_c','hgvs_p','aa_ref','aa_pos','aa_alt','germline_classification','review_status','review_stars','last_evaluated','variant_class','project_set']
    with SOURCE.open(encoding='utf-8', newline='') as handle:
        records = list(csv.DictReader((line for line in handle if not line.startswith('#')), delimiter='\t'))
    if len(records) != 6463:
        raise ValueError(f'Unexpected frozen input record count: {len(records)}')
    variants, excluded, mismatches = [], [], []
    for row in records:
        if row['variant_class'] != 'single_aa_substitution':
            excluded.append(row['variation_id'])
            continue
        position = int(row['aa_pos'])
        if position not in model or model[position]['aa'] != row['aa_ref']:
            mismatches.append(row['variation_id'])
            continue
        variants.append({key: (position if key == 'aa_pos' else row[key]) for key in fields})
    if mismatches:
        raise ValueError(f'Reference residue mismatches; refusing to map: {mismatches}')
    targets = sum(v['project_set'] == 'predict' for v in variants)
    # The supplied snapshot calls the target set "predict"; fail if the snapshot changes.
    if targets != 4606:
        raise ValueError(f'Expected 4606 prediction targets, found {targets}; check project_set values: {Counter(v["project_set"] for v in variants)}')
    output = {'model': {'id':'AF-P38398-F1-model_v6', 'sha256':hashlib.sha256(args.model.read_bytes()).hexdigest(), 'sequence':''.join(model[i]['aa'] for i in range(1,1864)), 'plddt':[model[i]['plddt'] for i in range(1,1864)]}, 'source':{'file':SOURCE.name,'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'records':len(records),'mapped':len(variants),'excluded_non_substitution':len(excluded),'reference_mismatches':len(mismatches),'targets':targets}, 'variants':variants}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, separators=(',',':'))+'\n', encoding='utf-8')
    print(json.dumps(output['source'], indent=2))

if __name__ == '__main__':
    main()
