#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const { generate } = require('../src/generate_script');
const { makeAudio } = require('../src/make_audio');
const { makeImages } = require('../src/make_images');
const { ensureOut, concatImagesToVideo } = require('../src/video_utils');

async function main() {
  const argv = minimist(process.argv.slice(2));
  const topic = argv.topic || argv.t || 'günlük pazarlama tüyosu #1';
  ensureOut();
  console.log('Generating script for topic:', topic);
  const script = await generate(topic, process.env.DEFAULT_LANGUAGE || 'tr');
  const outDir = process.env.OUTPUT_DIR || 'out';
  const scriptPath = path.join(outDir, 'script.txt');
  fs.writeFileSync(scriptPath, script);
  console.log('Script saved to', scriptPath);

  console.log('Creating audio...');
  const audioPath = path.join(outDir, 'voice.wav');
  await makeAudio(script, audioPath);
  console.log('Audio saved to', audioPath);

  console.log('Downloading images...');
  const images = await makeImages(topic, outDir);
  console.log('Images saved:', images);

  console.log('Rendering video...');
  const final = path.join(outDir, 'final.mp4');
  concatImagesToVideo(images, audioPath, final);
  console.log('Final video created:', final);

  // metadata
  const metadata = {
    topic,
    script: scriptPath,
    audio: path.basename(audioPath),
    images: images.map(f => path.basename(f)),
    video: path.basename(final),
    created_at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  console.log('Metadata saved.');
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
