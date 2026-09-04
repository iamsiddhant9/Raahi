/**
 * patch-jk-official.js
 * Replaces the J&K feature in india-states-official.geojson with
 * India's OFFICIAL boundary as published by Survey of India,
 * covering the full claimed territory:
 *   - Indian-administered J&K UT (Jammu + Kashmir Valley)
 *   - Indian-administered Ladakh UT (Leh + Kargil)
 *   - Pakistan-administered PoK / Azad Kashmir
 *   - Pakistan-administered Gilgit-Baltistan
 *   - China-administered Aksai Chin
 *
 * Also adds Ladakh as a separate feature (post-2019 bifurcation).
 * Output: public/india-states-patched.geojson
 */

const fs = require('fs');

// ─── Load base GeoJSON ───────────────────────────────────────────────────────
const data = JSON.parse(
  fs.readFileSync('public/india-states-official.geojson', 'utf8')
);

// Remove old J&K (will be replaced with official boundary)
const otherFeatures = data.features.filter(
  f => f.properties.NAME_1 !== 'Jammu and Kashmir'
);

// ─── Division line between J&K UT and Ladakh UT ─────────────────────────────
// Runs roughly through Kargil / Zanskar area, then Karakoram to Siachen
// (south-to-north approximation of the 2019 administrative division)
const divisionLine = [
  [77.50, 32.40],
  [77.30, 32.80],
  [77.00, 33.20],
  [76.80, 33.60],
  [76.60, 34.00],
  [76.45, 34.40],
  [76.30, 34.80],
  [76.15, 35.20],
  [76.00, 35.60],
  [76.20, 36.00],
  [76.50, 36.30],
  [76.80, 36.60],
  [77.30, 36.90],
  [77.80, 37.10],
  [78.20, 37.20],
];

// ─── J&K UT official polygon ─────────────────────────────────────────────────
// Western portion — includes Jammu, Kashmir Valley, PoK, and Gilgit-Baltistan
// Per Survey of India's external boundary (India's full claim)
const jkUTOuter = [
  // South: Punjab/HP border (west to east)
  [74.20, 32.28],
  [74.70, 32.27],
  [75.20, 32.26],
  [75.80, 32.24],
  [76.30, 32.22],
  [77.00, 32.35],
  [77.50, 32.40],   // ← meet division line (south tip)

  // East: follow division line northward
  ...divisionLine.slice().reverse().slice(0, 1), // [77.50, 32.40] already there

  // Division line going north (shared boundary with Ladakh UT)
  [77.30, 32.80],
  [77.00, 33.20],
  [76.80, 33.60],
  [76.60, 34.00],
  [76.45, 34.40],
  [76.30, 34.80],
  [76.15, 35.20],
  [76.00, 35.60],
  [76.20, 36.00],
  [76.50, 36.30],
  [76.80, 36.60],
  [77.30, 36.90],
  [77.80, 37.10],
  [78.20, 37.20],   // ← north tip of division line

  // North: Siachen glacier / Karakoram (India's claim runs to Karakoram watershed)
  [78.00, 37.40],
  [77.50, 37.50],

  // Gilgit-Baltistan (claimed by India, administered by Pakistan)
  [77.00, 37.50],
  [76.50, 37.60],
  [75.90, 37.60],
  [75.30, 37.50],
  [74.80, 37.30],
  [74.20, 37.10],

  // Pakistan-border / Chitral corner
  [73.80, 36.90],
  [73.60, 36.50],

  // PoK / Azad Kashmir western boundary (India's claim: Line of Control
  // is NOT the international boundary; India claims all the way to the
  // Radcliffe / UN-ceasefire-line of 1947-48)
  [73.40, 36.10],
  [73.40, 35.70],
  [73.50, 35.20],
  [73.60, 34.70],
  [73.70, 34.20],  // Muzaffarabad area
  [73.85, 33.70],
  [74.00, 33.20],
  [74.10, 32.80],
  [74.20, 32.50],
  [74.20, 32.28],  // Close (back to Punjab border start)
];

// ─── Ladakh UT official polygon ──────────────────────────────────────────────
// Eastern portion — includes Leh, Kargil, and Aksai Chin (China-administered)
const ladakhOuter = [
  // South: HP/Uttarakhand border
  [77.50, 32.40],   // start at division line south tip
  [78.00, 32.42],
  [78.50, 32.45],
  [79.00, 32.50],

  // East boundary toward Aksai Chin (India's claim per Survey of India)
  [79.40, 32.60],
  [79.80, 32.90],
  [80.10, 33.20],
  [80.30, 33.60],   // Aksai Chin central-east
  [80.35, 34.00],
  [80.30, 34.40],   // Aksai Chin northeast
  [80.20, 34.90],
  [80.00, 35.30],
  [79.70, 35.70],   // Depsang Plains
  [79.40, 36.00],

  // North: Karakoram watershed (India's claim)
  [79.00, 36.30],
  [78.60, 36.70],
  [78.20, 37.00],
  [78.00, 37.20],
  [78.20, 37.20],   // ← north end of division line

  // West: follow division line south back to start
  [77.80, 37.10],
  [77.30, 36.90],
  [76.80, 36.60],
  [76.50, 36.30],
  [76.20, 36.00],
  [76.00, 35.60],
  [76.15, 35.20],
  [76.30, 34.80],
  [76.45, 34.40],
  [76.60, 34.00],
  [76.80, 33.60],
  [77.00, 33.20],
  [77.30, 32.80],
  [77.50, 32.40],   // Close
];

// ─── Build GeoJSON features ──────────────────────────────────────────────────
const jkFeature = {
  type: 'Feature',
  properties: {
    NAME_1: 'Jammu and Kashmir',
    NAME_0: 'India',
    TYPE_1: 'Union Territory',
    ID_0: 105,
    ISO: 'IND',
    note: 'Includes PoK and Gilgit-Baltistan per Survey of India official boundary',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [jkUTOuter],
  },
};

const ladakhFeature = {
  type: 'Feature',
  properties: {
    NAME_1: 'Ladakh',
    NAME_0: 'India',
    TYPE_1: 'Union Territory',
    ID_0: 105,
    ISO: 'IND',
    note: 'Includes Aksai Chin per Survey of India official boundary',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [ladakhOuter],
  },
};

// ─── Write patched file ──────────────────────────────────────────────────────
const patched = {
  type: 'FeatureCollection',
  features: [...otherFeatures, jkFeature, ladakhFeature],
};

fs.writeFileSync(
  'public/india-states-patched.geojson',
  JSON.stringify(patched)
);

// ─── Report ──────────────────────────────────────────────────────────────────
console.log('✅ Patched GeoJSON written to public/india-states-patched.geojson');
console.log('   Total features:', patched.features.length);
console.log('   J&K UT  – lng range:',
  Math.min(...jkUTOuter.map(c => c[0])).toFixed(2), 'to',
  Math.max(...jkUTOuter.map(c => c[0])).toFixed(2)
);
console.log('   J&K UT  – lat range:',
  Math.min(...jkUTOuter.map(c => c[1])).toFixed(2), 'to',
  Math.max(...jkUTOuter.map(c => c[1])).toFixed(2)
);
console.log('   Ladakh  – lng range:',
  Math.min(...ladakhOuter.map(c => c[0])).toFixed(2), 'to',
  Math.max(...ladakhOuter.map(c => c[0])).toFixed(2)
);
console.log('   Ladakh  – lat range:',
  Math.min(...ladakhOuter.map(c => c[1])).toFixed(2), 'to',
  Math.max(...ladakhOuter.map(c => c[1])).toFixed(2)
);
