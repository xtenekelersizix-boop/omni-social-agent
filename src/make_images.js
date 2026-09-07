/**
 * make_images.js
 * Downloads 3 images: if UNSPLASH_ACCESS_KEY provided, use Unsplash, otherwise fallback to picsum.photos
 */
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch image: ' + res.statusText);
  const buffer = await res.buffer();
  fs.writeFileSync(outPath, buffer);
}

async function makeImages(topic, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const images = [];
  for (let i = 0; i < 3; i++) {
    const filename = path.join(outDir, `img_${i+1}.jpg`);
    if (unsplashKey) {
      const query = encodeURIComponent(topic);
      const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashKey}`;
      try {
        const res = await fetch(url);
        const j = await res.json();
        const imgUrl = j && j.urls && j.urls.regular ? j.urls.regular : `https://picsum.photos/1280/720?random=${Math.floor(Math.random()*1000)}`;
        await download(imgUrl, filename);
      } catch (e) {
        // fallback
        await download(`https://picsum.photos/1280/720?random=${Math.floor(Math.random()*1000)}`, filename);
      }
    } else {
      await download(`https://picsum.photos/1280/720?random=${Math.floor(Math.random()*1000)}`, filename);
    }
    images.push(filename);
  }
  return images;
}

module.exports = { makeImages };
