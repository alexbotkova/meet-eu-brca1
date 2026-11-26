#!/usr/bin/env python3
"""Check downloaded PDB structures against viewer/variants.json (requires Biopython)."""
import argparse
import hashlib
import json
from pathlib import Path
from Bio.PDB import MMCIFParser, PDBParser
from Bio.SeqUtils import seq1

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    '7LYB.cif': ('c1c38a275cfc665ec0a8578fc3191814cf995cccf4b8ec743edc0c44958c59f0', 'M', 4, 97, 0),
    '8RS8.cif': ('aa0e910fddc6766a6879931d22f7eabc1c2a5ed8d5e1182ee2b2ee321d7fa8bc', 'A', 1650, 1859, 0),
    '7K3S.pdb': ('f7f6d9137746bd411a7e7e0cacb80c6b883ba2201aed2c5dc6b9ed9b4a4af90e', 'A', 1394, 1423, 1379),
}
MOUSE_DIFFERENCES = {1398:'A', 1401:'K', 1402:'Y', 1413:'H', 1421:'R', 1423:'N'}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path, help='Directory containing 7LYB.cif, 8RS8.cif and 7K3S.pdb')
    args=parser.parse_args()
    sequence=json.loads((ROOT / 'viewer/variants.json').read_text())['model']['sequence']
    for filename,(digest,chain,start,end,offset) in EXPECTED.items():
        path=args.directory/filename
        if hashlib.sha256(path.read_bytes()).hexdigest()!=digest:
            raise ValueError(f'{filename}: unexpected source file hash')
        reader=PDBParser(QUIET=True) if path.suffix=='.pdb' else MMCIFParser(QUIET=True)
        structure=reader.get_structure(filename,str(path))
        first_model=next(structure.get_models())
        residues={r.id[1]+offset:seq1(r.resname) for r in first_model[chain] if r.id[0]==' ' and r.id[2]==' ' and 'CA' in r and start<=r.id[1]+offset<=end}
        if set(residues)!=set(range(start,end+1)):
            raise ValueError(f'{filename}: missing or unexpected residue positions')
        mismatches={p:aa for p,aa in residues.items() if sequence[p-1]!=aa}
        if mismatches != (MOUSE_DIFFERENCES if filename=='7K3S.pdb' else {}):
            raise ValueError(f'{filename}: unexpected sequence differences: {mismatches}')
        print(f'{filename}: {len(residues)} resolved residues; {len(mismatches)} expected differences')

if __name__=='__main__':
    main()
