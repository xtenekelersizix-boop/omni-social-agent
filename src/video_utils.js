const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = process.env.OUTPUT_DIR || 'out';

function ensureOut() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function makeSilentAudio(outPath, durationSec=6) {
  // requires ffmpeg installed on host or container
  const cmd = `ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t ${durationSec} -q:a 9 -acodec pcm_s16le ${outPath}`;
  execSync(cmd, { stdio: 'ignore' });
}

function concatImagesToVideo(imageFiles, audioFile, outVideo) {
  const listFile = path.join(OUTPUT_DIR, 'images.txt');
  const lines = imageFiles.map(f => `file '${path.basename(f)}'\nduration 4`).join('\n');
  fs.writeFileSync(listFile, lines + `\nfile '${path.basename(imageFiles[imageFiles.length-1])}'`);
  const cwd = OUTPUT_DIR;
  execSync(`ffmpeg -y -f concat -safe 0 -i ${listFile} -vsync vfr -pix_fmt yuv420p temp_video.mp4`, { cwd, stdio: 'inherit' });
  execSync(`ffmpeg -y -i temp_video.mp4 -i ${path.basename(audioFile)} -c:v copy -c:a aac -shortest ${path.basename(outVideo)}`, { cwd, stdio: 'inherit' });
  fs.unlinkSync(path.join(OUTPUT_DIR, 'temp_video.mp4'));
  fs.unlinkSync(listFile);
}

module.exports = { ensureOut, makeSilentAudio, concatImagesToVideo };
