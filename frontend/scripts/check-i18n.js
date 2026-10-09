import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frPath = path.join(__dirname, '../src/i18n/fr.json');
const arPath = path.join(__dirname, '../src/i18n/ar.json');
const enPath = path.join(__dirname, '../src/i18n/en.json');

const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      keys = keys.concat(getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

const frKeys = getKeys(fr);
const arKeys = getKeys(ar);
const enKeys = getKeys(en);

let errors = 0;

for (const k of frKeys) {
  if (!arKeys.includes(k)) {
    console.error(`Missing in Arabic: ${k}`);
    errors++;
  }
  if (!enKeys.includes(k)) {
    console.error(`Missing in English: ${k}`);
    errors++;
  }
}

for (const k of arKeys) {
  if (!frKeys.includes(k)) {
    console.error(`Missing in French (found in Arabic): ${k}`);
    errors++;
  }
}

for (const k of enKeys) {
  if (!frKeys.includes(k)) {
    console.error(`Missing in French (found in English): ${k}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\ni18n check failed with ${errors} missing key(s).`);
  process.exit(1);
} else {
  console.log(`✓ i18n parity check passed: ${frKeys.length} keys synchronized across fr, ar, en.`);
  process.exit(0);
}
