import csv
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class FrozenViewerDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'viewer/variants.json').read_text())
        with (ROOT / 'Data/brca1_clinvar_2026-10-05_all.tsv').open(newline='') as f:
            cls.source = list(csv.DictReader((line for line in f if not line.startswith('#')), delimiter='\t'))

    def test_snapshot_provenance_and_record_coverage(self):
        data = self.data
        self.assertEqual(data['source']['sha256'], hashlib.sha256((ROOT / 'Data/brca1_clinvar_2026-10-05_all.tsv').read_bytes()).hexdigest())
        self.assertEqual((len(self.source), len(data['variants']), data['source']['excluded_non_substitution']), (6463, 6388, 75))
        self.assertEqual(sum(row['project_set'] == 'predict' for row in data['variants']), 4606)
        self.assertEqual({r['variation_id'] for r in data['variants']}, {r['variation_id'] for r in self.source if r['variant_class'] == 'single_aa_substitution'})

    def test_every_mapping_agrees_with_reference_sequence(self):
        seq=self.data['model']['sequence']
        self.assertEqual(len(seq), 1863)
        self.assertEqual(len(self.data['model']['plddt']), 1863)
        self.assertTrue(all(seq[r['aa_pos']-1] == r['aa_ref'] for r in self.data['variants']))

    def test_distinct_dna_variants_are_not_collapsed(self):
        rows=[r for r in self.data['variants'] if r['aa_pos']==11 and r['aa_alt']=='L']
        self.assertEqual(len(rows), 3)
        self.assertEqual(len({r['hgvs_c'] for r in rows}), 3)

if __name__ == '__main__':
    unittest.main()
