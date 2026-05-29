import fs from 'fs';
import path from 'path';
import { audioMap } from '../src/utils/audioMap.js';

const AUDIO_DIR = path.resolve('public/assets/audio');

const validFiles = new Set(
  Object.values(audioMap).map(p => path.basename(p))
);

const allFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));

let removed = 0;
for (const file of allFiles) {
  if (!validFiles.has(file)) {
    fs.unlinkSync(path.join(AUDIO_DIR, file));
    console.log(`🗑  Removed orphaned: ${file}`);
    removed++;
  }
}
console.log(`\n✅ Cleanup complete. Removed ${removed} orphaned file(s).`);
