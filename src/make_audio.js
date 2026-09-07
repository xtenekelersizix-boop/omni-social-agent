/**
 * make_audio.js
 * Calls Coqui TTS if COQUI_TTS_URL is set. Otherwise creates a silent audio placeholder using ffmpeg.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fetch = require('node-fetch');

async function makeAudio(text, outPath) {
  const coqui = process.env.COQUI_TTS_URL;
  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  if (coqui) {
    const url = `${coqui.replace(/\/$/, '')}/api/tts`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!resp.ok) throw new Error('Coqui TTS failed: ' + resp.statusText);
    const ab = await resp.arrayBuffer();
    fs.writeFileSync(outPath, Buffer.from(ab));
    return outPath;
  } else {
    // fallback: create silent audio with ffmpeg
    const dur = Math.max(4, Math.min(20, Math.ceil(text.split('\n').join(' ').split(' ').length / 2)));
    const cmd = `ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t ${dur} -q:a 9 -acodec pcm_s16le ${outPath}`;
    execSync(cmd, { stdio: 'inherit' });
    return outPath;
  }
}

module.exports = { makeAudio };
