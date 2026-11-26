'use strict';
// PDB author chain and residue numbers verified against the supplied structures.
const STRUCTURES = {
  af: { title:'Full-length human BRCA1', url:'https://alphafold.ebi.ac.uk/files/AF-P38398-F1-model_v6.pdb', format:'pdb', sha:'b2af213e2ef20f95c349a2159d628321205ad55b64511dd9e891b8a652d8a1a4', chain:'A', first:1, last:1863, partner:null, info:'<strong>AlphaFold v6 · predicted human BRCA1.</strong> Residues 1–1863. Colors indicate pLDDT local confidence; the overall pose is a prediction. <a href="https://alphafold.ebi.ac.uk/entry/P38398" target="_blank" rel="noopener">AlphaFold DB ↗</a>' },
  ring: { title:'RING · human BRCA1 / BARD1', url:'https://files.rcsb.org/download/7LYB.cif', format:'cif', sha:'c1c38a275cfc665ec0a8578fc3191814cf995cccf4b8ec743edc0c44958c59f0', chain:'M', first:4, last:97, partner:'N', info:'<strong>7LYB · human · cryo-EM, 3.28 Å.</strong> BRCA1 author chain M, residues 4–97; BARD1 chain N. The deposited complex has additional partners not displayed here. <a href="https://www.rcsb.org/structure/7LYB" target="_blank" rel="noopener">RCSB PDB ↗</a>' },
  brct: { title:'BRCT · human BRCA1 / RIF1', url:'https://files.rcsb.org/download/8RS8.cif', format:'cif', sha:'aa0e910fddc6766a6879931d22f7eabc1c2a5ed8d5e1182ee2b2ee321d7fa8bc', chain:'A', first:1650, last:1859, partner:'E', info:'<strong>8RS8 · human · X-ray, 1.31 Å.</strong> BRCA1 author chain A, residues 1650–1859, with RIF1 phosphopeptide chain E. <a href="https://www.rcsb.org/structure/8RS8" target="_blank" rel="noopener">RCSB PDB ↗</a>' },
  mouse: { title:'Coiled-coil · mouse BRCA1 / PALB2', url:'https://files.rcsb.org/download/7K3S.pdb', format:'pdb', sha:'f7f6d9137746bd411a7e7e0cacb80c6b883ba2201aed2c5dc6b9ed9b4a4af90e', chain:'A', first:1394, last:1423, offset:1379, partner:'B', info:'<strong>7K3S · mouse · solution NMR.</strong> First conformer; mouse BRCA1 chain A construct positions 15–44 align to human residues 1394–1423 (24/30 identical). Mouse PALB2 chain B. This is a homologous comparison, not a human experimental structure. <a href="https://www.rcsb.org/structure/7K3S" target="_blank" rel="noopener">RCSB PDB ↗</a>' }
};
const PALETTE = {pathogenic:'#c84746',benign:'#2e6fb5',uncertain:'#c88d25',conflicting:'#895caf',other:'#787d85'};
const LABELS = {pathogenic:'Pathogenic / likely pathogenic',benign:'Benign / likely benign',uncertain:'Uncertain significance',conflicting:'Conflicting classifications',other:'Other / unclassified'};
const $ = id => document.getElementById(id);
const REGIONS = {
  ring: [[1,109]], coil: [[1391,1424]], brct: [[1646,1859]],
  // Candidate helices in the AlphaFold model; these are not experimentally confirmed.
  helices: [[372,390],[849,863]],
  // Remaining sequence outside the domain presets and the two candidate helices.
  other: [[110,371],[391,848],[864,1390],[1425,1645],[1860,1863]]
};
const state = {data:null, byPos:new Map(), viewer:null, model:null, key:'af', position:null, loadId:0, available:new Set(), selectedRegions:new Set(), customRange:null, selectedCategories:new Set(['pathogenic','benign']), markerShapes:[]};
function category(value) {
  let text = value.toLowerCase();
  if (text.includes('conflicting')) return 'conflicting';
  if (text.includes('uncertain')) return 'uncertain';
  if (text.includes('pathogenic')) return 'pathogenic';
  if (text.includes('benign')) return 'benign';
  return 'other';
}
function humanPos(atom) {
  const s = STRUCTURES[state.key];
  if (atom.chain !== s.chain || !Number.isInteger(Number(atom.resi))) return null;
  const pos = Number(atom.resi) + (s.offset || 0);
  return pos >= s.first && pos <= s.last ? pos : null;
}
function structurePos(position) {
  const s = STRUCTURES[state.key];
  return position >= s.first && position <= s.last ? position - (s.offset || 0) : null;
}
function matchingRecords(pos) {
  return (state.byPos.get(pos) || []).filter(row => state.selectedCategories.has(category(row.germline_classification)));
}
function positionCategories(pos) {
  const present = new Set(matchingRecords(pos).map(row => category(row.germline_classification)));
  return Object.keys(PALETTE).filter(key=>present.has(key));
}
function positionColor(pos) {
  const cats = positionCategories(pos);
  // A position with multiple classes gets separate colored markers instead of an arbitrary mixed color.
  return cats.length===1 ? PALETTE[cats[0]] : '#d0d4d8';
}
function updateFilterSummary() {
  let records=0, positions=0, targets=0, displayedRecords=0, displayedPositions=0;
  const visible=new Set(visiblePositions());
  for (const [pos] of state.byPos) {
    const matches=matchingRecords(pos);
    if (!matches.length) continue;
    records+=matches.length; positions++;
    targets+=matches.filter(row=>row.project_set==='predict').length;
    if (visible.has(pos)) {displayedRecords+=matches.length;displayedPositions++;}
  }
  $('filter-summary').textContent=`Frozen snapshot: ${records} matching records at ${positions} positions, including ${targets} of 4,606 prediction targets. Current structure and shown regions: ${displayedRecords} records at ${displayedPositions} positions.`;
}
function clearOverlapMarkers() {
  for (const shape of state.markerShapes) state.viewer.removeShape(shape);
  state.markerShapes=[];
}
function addOverlapMarkers(positions) {
  // The dots are display annotations arranged around CA, not mutant coordinates.
  const s=STRUCTURES[state.key];
  const atoms=state.model.selectedAtoms({chain:s.chain,atom:'CA',resi:positions.map(structurePos)});
  const seen=new Set();
  for (const atom of atoms) {
    const p=humanPos(atom), cats=positionCategories(p);
    if (!p || seen.has(p) || cats.length<2) continue;
    seen.add(p);
    const shape=state.viewer.addShape({clickable:true,callback:()=>selectPosition(p,false)});
    cats.forEach((key,i)=>{
      const angle=(2*Math.PI*i/cats.length), radius=1.65;
      shape.addSphere({center:{x:atom.x+radius*Math.cos(angle),y:atom.y+radius*Math.sin(angle),z:atom.z},radius:0.75,color:PALETTE[key],quality:1});
    });
    // Preserve each sphere's vertex color; 3Dmol otherwise overrides them with the shape color.
    shape.color=undefined;
    state.markerShapes.push(shape);
  }
}
function confidenceColor(pos) {
  const n = state.data.model.plddt[pos-1];
  return n >= 90 ? '#345eac' : n >= 70 ? '#71c7cf' : n >= 50 ? '#ebc95c' : '#e79958';
}
function residueColor(atom) {
  const p = humanPos(atom);
  if (!p) return '#b0b8c0';
  if ($('mode').value === 'variants') return positionColor(p);
  return state.key === 'af' ? confidenceColor(p) : '#667788';
}
function legend() {
  const mode = $('mode').value;
  let entries = mode === 'confidence' && state.key === 'af' ? [['#345eac','Very high ≥90'],['#71c7cf','Confident 70–90'],['#ebc95c','Low 50–70'],['#e79958','Very low <50']] : mode === 'confidence' ? [['#667788','Experimental BRCA1'],['#b0b8c0','Binding partner']] : Object.entries(LABELS).filter(([k])=>state.selectedCategories.has(k)).map(([k,v])=>[PALETTE[k],v]).concat([['#d0d4d8','No match / overlap']]);
  $('legend').innerHTML = entries.map(([color,name])=>`<span><i style="background:${color}"></i>${name}</span>`).join('') + (mode==='variants' ? '<span>Multiple colored dots = multiple selected classifications at one position</span>' : '');
}
function selectedRanges() {
  const ranges = [...state.selectedRegions].flatMap(key => REGIONS[key]);
  if (state.customRange) ranges.push(state.customRange);
  if (!ranges.length) return [[1,1863]];
  const merged=[];
  for (const [start,end] of ranges.slice().sort((a,b)=>a[0]-b[0])) {
    const last=merged[merged.length-1];
    if (last && start <= last[1]+1) last[1]=Math.max(last[1],end);
    else merged.push([start,end]);
  }
  return merged;
}
function isSelected(position) {
  return selectedRanges().some(([start,end])=>position>=start && position<=end);
}
function visiblePositions() {
  const ranges=selectedRanges();
  return [...state.available].filter(p=>ranges.some(([start,end])=>p>=start && p<=end)).sort((a,b)=>a-b);
}
function showRangeStatus() {
  const el = $('range-status');
  if (!state.model) { el.textContent = ''; el.classList.remove('warning'); return; }
  const positions=visiblePositions(), ranges=selectedRanges();
  const total=ranges.reduce((n,[start,end])=>n+end-start+1,0);
  const description=ranges.map(([start,end])=>start===end ? `${start}` : `${start}–${end}`).join(', ');
  if (!positions.length) {
    el.textContent = `None of the selected BRCA1 residues (${description}) are available in this structure. Change the selection or structure.${STRUCTURES[state.key].partner && $('partners').checked ? ' The partner may still be displayed.' : ''}`;
  } else if (positions.length < total) {
    el.textContent = `Showing ${positions.length} of ${total} selected BRCA1 residues (${description}); the rest are not represented in this structure.`;
  } else {
    el.textContent = `Showing ${total} BRCA1 residues (${description}).`;
  }
  el.classList.toggle('warning', positions.length < total);
}
function drawSelection(preview=null) {
  const band=$('sequence-selection'); band.replaceChildren();
  function addBand(start,end,cls) {
    const span=document.createElement('span');span.className=cls;
    span.style.left=`${(start-1)/1863*100}%`;
    span.style.width=`${(end-start+1)/1863*100}%`;
    band.appendChild(span);
  }
  for (const [start,end] of selectedRanges()) addBand(start,end,'sequence-selection');
  if (preview) addBand(preview[0],preview[1],'sequence-preview');
  document.querySelectorAll('[data-region]').forEach(button=>button.setAttribute('aria-pressed',String(state.selectedRegions.has(button.dataset.region))));
  $('remove-custom').hidden=!state.customRange;
}
function focusRange() {
  const positions = visiblePositions();
  if (!state.model || !positions.length) return;
  const sel = {chain:STRUCTURES[state.key].chain, resi:positions.map(structurePos)};
  if (positions.length === 1) sel.expand = 12;
  state.viewer.zoomTo(sel, 500);
  state.viewer.render();
}
function updateSelection() {
  drawSelection(); redraw(); showRangeStatus(); if (state.position) showDetails();
}
function applyRange(start, end) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > 1863 || start > end) {
    $('range-status').textContent = 'Enter a valid range: whole numbers from 1 to 1863, with the start no greater than the end.';
    $('range-status').classList.add('warning');
    drawSelection();
    return;
  }
  state.customRange = [start,end];
  $('range-start').value = start; $('range-end').value = end;
  updateSelection();
}
function redraw() {
  if (!state.model) return;
  const s = STRUCTURES[state.key], visible = visiblePositions(), resi = visible.map(structurePos);
  clearOverlapMarkers();
  state.viewer.setStyle({}, {});
  state.viewer.setClickable({chain:s.chain},false,()=>{});
  if (resi.length) {
    state.viewer.setStyle({chain:s.chain, resi}, {cartoon:{colorfunc:residueColor}});
    // A cartoon needs neighbouring residues; show an isolated residue as a sphere.
    if (resi.length === 1) state.viewer.addStyle({chain:s.chain, resi, atom:'CA'}, {sphere:{radius:1.1,colorfunc:residueColor}});
    state.viewer.setClickable({chain:s.chain, resi},true, atom=>{const pos=humanPos(atom);if(pos) selectPosition(pos,false);});
  }
  if ($('mode').value==='variants' && resi.length) addOverlapMarkers(visible);
  if (s.partner && $('partners').checked) state.viewer.setStyle({chain:s.partner},{cartoon:{color:'#b0b8c0'},stick:{radius:0.12,color:'#b0b8c0'}});
  if (state.position && visible.includes(state.position)) state.viewer.addStyle({chain:s.chain,resi:structurePos(state.position),atom:'CA'}, {sphere:{radius:1.1,color:'#f4d168'}});
  state.viewer.render();
  legend();
  updateFilterSummary();
}
function safe(t) { const span=document.createElement('span');span.textContent=t || '';return span.innerHTML; }
function showDetails() {
  const p = state.position;
  if (!p) return;
  const records = matchingRecords(p), all = state.byPos.get(p) || [], aa=state.data.model.sequence[p-1];
  let note = '';
  if (!state.available.has(p)) note='<p class="warning">This residue is not represented in the selected structure. Switch to full-length AlphaFold to see it.</p>';
  else if (!isSelected(p)) note='<p class="warning">This residue is outside the selected display regions. Change the selection to see it in the structure.</p>';
  if (state.key==='mouse' && state.available.has(p)) {
    const diff={1398:'A',1401:'K',1402:'Y',1413:'H',1421:'R',1423:'N'};
    note += `<p class="warning">Mouse homolog: construct residue ${p-1379}${diff[p] ? ` is ${diff[p]}, while human is ${aa}` : ' matches the human reference amino acid'}. Human variant records are shown for comparison, not as a mouse mutation structure.</p>`;
  }
  const list = records.map(row=>`<tr><td><strong>${safe(row.aa_ref)}${p}${safe(row.aa_alt)}</strong><small>${safe(row.hgvs_c)}<br>${safe(row.hgvs_p)}</small></td><td>${safe(row.germline_classification || 'Not classified')}<small>${safe(row.review_status || 'Review status unavailable')}</small></td><td><a target="_blank" rel="noopener" href="https://www.ncbi.nlm.nih.gov/clinvar/variation/${encodeURIComponent(row.variation_id)}/">${safe(row.variation_id)}</a></td></tr>`).join('');
  $('details').innerHTML=`<div class="res-header"><h3>${safe(aa)}${p}</h3> <span class="small">Human reference residue</span><p class="small">${records.length} matching record${records.length===1?'':'s'} · ${all.length} total at this position</p></div>${note}<div class="records">${list ? `<table><thead><tr><th scope="col">Variant</th><th scope="col">Classification</th><th scope="col">ClinVar</th></tr></thead><tbody>${list}</tbody></table>` : '<p class="no-records">No records match the current filter.</p>'}</div>`;
}
function selectPosition(p, zoom=true) {
  if (!Number.isInteger(p) || p<1 || p>1863) return;
  state.position=p; $('position').value=p; redraw(); showDetails();
  if (zoom && state.available.has(p) && isSelected(p)) {state.viewer.zoomTo({chain:STRUCTURES[state.key].chain,resi:structurePos(p),expand:12},700);state.viewer.render();}
}
async function sha256(text) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function loadStructure(key) {
  const ticket=++state.loadId, s=STRUCTURES[key];state.key=key;state.model=null;state.available.clear();
  $('viewer-status').textContent='Loading and verifying structure…';$('range-status').textContent='Checking coverage for selected structure…';$('range-status').classList.remove('warning');$('view-title').textContent=s.title.toUpperCase();$('structure-info').innerHTML=s.info;
  $('partners').disabled=!s.partner; $('mode').querySelector('option[value="confidence"]').textContent=key==='af'?'Model confidence':'Structure / partners';
  clearOverlapMarkers();state.viewer.removeAllModels();state.viewer.render();updateFilterSummary();if(state.position)showDetails();
  try {
    const response=await fetch(s.url);if(!response.ok)throw new Error(`Structure download failed (HTTP ${response.status}).`);
    const text=await response.text();if(await sha256(text)!==s.sha)throw new Error('The structure file differs from the verified version. Mapping has been disabled.');
    if(ticket!==state.loadId)return;
    state.model=state.viewer.addModel(text,s.format);
    const atoms=state.model.selectedAtoms({chain:s.chain,atom:'CA'});
    for(const atom of atoms){const p=humanPos(atom);if(p)state.available.add(p);}
    if(state.available.size!==s.last-s.first+1)throw new Error(`Expected ${s.last-s.first+1} mapped residues, found ${state.available.size}. Check chain numbering before use.`);
    redraw();showRangeStatus();focusRange();$('viewer-status').textContent='';if(state.position)showDetails();
  } catch(e) {if(ticket!==state.loadId)return;state.viewer.removeAllModels();state.model=null;state.available.clear();state.viewer.render();$('viewer-status').textContent=`Unable to display this structure: ${e.message}`;$('range-status').textContent='Structure coverage unavailable.';if(state.position)showDetails();}
}
async function init() {
  if(!window.$3Dmol){$('viewer-status').textContent='3D viewer library could not load. Check your internet connection and reload.';return;}
  try {
    const response=await fetch('variants.json');if(!response.ok)throw new Error('Prepared variants.json is missing. Follow viewer/README.md.');
    state.data=await response.json();
    for(const row of state.data.variants){if(!state.byPos.has(row.aa_pos))state.byPos.set(row.aa_pos,[]);state.byPos.get(row.aa_pos).push(row);}
    state.viewer=$3Dmol.createViewer($('viewer'),{backgroundColor:'#f4f5f6',antialias:true});
    if(!state.viewer)throw new Error('WebGL is unavailable in this browser.');
    $('structure').addEventListener('change',e=>loadStructure(e.target.value));
    $('mode').addEventListener('change',redraw);document.querySelectorAll('input[name=classification]').forEach(input=>input.addEventListener('change',()=>{state.selectedCategories=new Set([...document.querySelectorAll('input[name=classification]:checked')].map(box=>box.value));redraw();if(state.position)showDetails();}));$('partners').addEventListener('change',()=>{redraw();showRangeStatus();});
    $('search-form').addEventListener('submit',e=>{e.preventDefault();selectPosition(Number($('position').value));});
    $('reset').addEventListener('click',focusRange);
    $('range-form').addEventListener('submit',e=>{e.preventDefault();applyRange(Number($('range-start').value), Number($('range-end').value));});
    document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>selectPosition(Number(button.dataset.zoom))));
    document.querySelectorAll('[data-region]').forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.region;
      if(state.selectedRegions.has(key)) state.selectedRegions.delete(key); else state.selectedRegions.add(key);
      updateSelection();
    }));
    $('show-all').addEventListener('click',()=>{state.selectedRegions.clear();state.customRange=null;$('range-start').value=1;$('range-end').value=1863;updateSelection();});
    $('remove-custom').addEventListener('click',()=>{state.customRange=null;updateSelection();});
    const track = $('sequence-track'); let dragStart = null;
    const point = event => {
      const box=track.getBoundingClientRect(), ratio=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width));
      return Math.min(1863, Math.floor(ratio*1863)+1);
    };
    track.addEventListener('pointerdown',event=>{ if(event.button!==0)return; event.preventDefault(); dragStart=point(event); track.setPointerCapture(event.pointerId); drawSelection([dragStart,dragStart]); });
    track.addEventListener('pointermove',event=>{if(dragStart!==null){const p=point(event);drawSelection([Math.min(dragStart,p),Math.max(dragStart,p)]);}});
    track.addEventListener('pointerup',event=>{if(dragStart===null)return;const p=point(event);applyRange(Math.min(dragStart,p),Math.max(dragStart,p));dragStart=null;});
    track.addEventListener('pointercancel',()=>{dragStart=null;drawSelection();});
    drawSelection();
    window.addEventListener('resize',()=>state.viewer.resize());
    await loadStructure('af');
  } catch(e){$('viewer-status').textContent=`Unable to start viewer: ${e.message}`;}
}
init();
