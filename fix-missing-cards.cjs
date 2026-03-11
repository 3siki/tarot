const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'cards');

// Use Wikimedia thumbnail API which is more reliable
const cards = [
  ['wands-8', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Wands08.jpg/600px-Wands08.jpg'],
  ['swords-13', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Swords13.jpg/600px-Swords13.jpg'],
  ['pentacles-10', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pents10.jpg/600px-Pents10.jpg'],
  ['pentacles-14', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pents14.jpg/600px-Pents14.jpg'],
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch(e) {}
      reject(err);
    });
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  for (const [id, url] of cards) {
    const dest = path.join(outDir, `${id}.jpg`);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await sleep(5000);
        await download(url, dest);
        const size = fs.statSync(dest).size;
        if (size < 1000) throw new Error('File too small');
        console.log(`OK ${id} (${Math.round(size/1024)}KB)`);
        break;
      } catch (e) {
        console.log(`Attempt ${attempt+1} failed for ${id}: ${e.message}`);
        if (attempt === 2) console.log(`FAIL ${id}`);
      }
    }
    await sleep(3000);
  }
  console.log('Done!');
}

main();
