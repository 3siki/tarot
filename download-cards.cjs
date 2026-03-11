const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'cards');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Wikimedia Commons RWS Tarot Card image URLs (public domain, 1909)
const cards = [
  // Major Arcana
  ['major-0', 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg'],
  ['major-1', 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'],
  ['major-2', 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg'],
  ['major-3', 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg'],
  ['major-4', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg'],
  ['major-5', 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg'],
  ['major-6', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg'],
  ['major-7', 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg'],
  ['major-8', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg'],
  ['major-9', 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg'],
  ['major-10', 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg'],
  ['major-11', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg'],
  ['major-12', 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg'],
  ['major-13', 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg'],
  ['major-14', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg'],
  ['major-15', 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg'],
  ['major-16', 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg'],
  ['major-17', 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg'],
  ['major-18', 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg'],
  ['major-19', 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg'],
  ['major-20', 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg'],
  ['major-21', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg'],

  // Wands
  ['wands-1', 'https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg'],
  ['wands-2', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg'],
  ['wands-3', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg'],
  ['wands-4', 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg'],
  ['wands-5', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Wands05.jpg'],
  ['wands-6', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Wands06.jpg'],
  ['wands-7', 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg'],
  ['wands-8', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands08.jpg'],
  ['wands-9', 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Tarot_Nine_of_Wands.jpg'],
  ['wands-10', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg'],
  ['wands-11', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands11.jpg'],
  ['wands-12', 'https://upload.wikimedia.org/wikipedia/commons/1/16/Wands12.jpg'],
  ['wands-13', 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands13.jpg'],
  ['wands-14', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Wands14.jpg'],

  // Cups
  ['cups-1', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg'],
  ['cups-2', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg'],
  ['cups-3', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg'],
  ['cups-4', 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg'],
  ['cups-5', 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg'],
  ['cups-6', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg'],
  ['cups-7', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Cups07.jpg'],
  ['cups-8', 'https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg'],
  ['cups-9', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg'],
  ['cups-10', 'https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg'],
  ['cups-11', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Cups11.jpg'],
  ['cups-12', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Cups12.jpg'],
  ['cups-13', 'https://upload.wikimedia.org/wikipedia/commons/6/62/Cups13.jpg'],
  ['cups-14', 'https://upload.wikimedia.org/wikipedia/commons/0/04/Cups14.jpg'],

  // Swords
  ['swords-1', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg'],
  ['swords-2', 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg'],
  ['swords-3', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg'],
  ['swords-4', 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg'],
  ['swords-5', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg'],
  ['swords-6', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Swords06.jpg'],
  ['swords-7', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg'],
  ['swords-8', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Swords08.jpg'],
  ['swords-9', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords09.jpg'],
  ['swords-10', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg'],
  ['swords-11', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Swords11.jpg'],
  ['swords-12', 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords12.jpg'],
  ['swords-13', 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords13.jpg'],
  ['swords-14', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Swords14.jpg'],

  // Pentacles
  ['pentacles-1', 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg'],
  ['pentacles-2', 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents02.jpg'],
  ['pentacles-3', 'https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg'],
  ['pentacles-4', 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pents04.jpg'],
  ['pentacles-5', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Pents05.jpg'],
  ['pentacles-6', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Pents06.jpg'],
  ['pentacles-7', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg'],
  ['pentacles-8', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Pents08.jpg'],
  ['pentacles-9', 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Pents09.jpg'],
  ['pentacles-10', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Pents10.jpg'],
  ['pentacles-11', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Pents11.jpg'],
  ['pentacles-12', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Pents12.jpg'],
  ['pentacles-13', 'https://upload.wikimedia.org/wikipedia/commons/8/88/Pents13.jpg'],
  ['pentacles-14', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Pents14.jpg'],
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, { headers: { 'User-Agent': 'TarotApp/1.0' } }, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  let ok = 0, fail = 0;
  for (const [id, url] of cards) {
    const dest = path.join(outDir, `${id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      ok++;
      continue;
    }
    let success = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await sleep(5000);
        await download(url, dest);
        const size = fs.statSync(dest).size;
        if (size < 1000) throw new Error('File too small');
        console.log(`OK ${id} (${Math.round(size/1024)}KB)`);
        ok++;
        success = true;
        break;
      } catch (e) {
        if (attempt === 2) {
          console.log(`FAIL ${id}: ${e.message}`);
          fail++;
        }
      }
    }
    await sleep(1500);
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main();
