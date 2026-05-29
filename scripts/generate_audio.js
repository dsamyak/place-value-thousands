import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const OUTPUT_DIR = path.resolve('public/assets/audio');
const AUDIO_MAP_PATH = path.resolve('src/utils/audioMap.js');

const VOICE_SETTINGS = {
  statement:     { voiceName: 'en-US-Neural2-F', speakingRate: 0.90, pitch: 0.0 },
  instruction:   { voiceName: 'en-US-Neural2-F', speakingRate: 0.88, pitch: 0.5 },
  question:      { voiceName: 'en-US-Neural2-F', speakingRate: 0.85, pitch: 2.0 },
  encouragement: { voiceName: 'en-US-Neural2-F', speakingRate: 1.00, pitch: 2.5 },
  emphasis:      { voiceName: 'en-US-Neural2-F', speakingRate: 0.80, pitch: 0.0 },
  thinking:      { voiceName: 'en-US-Neural2-F', speakingRate: 0.85, pitch: 1.0 },
  celebration:   { voiceName: 'en-US-Neural2-F', speakingRate: 1.05, pitch: 3.0 },
};

const phrases = [
  // INTRO
  { text: "Hello Explorer! Today we'll unlock the secret of big numbers!", style: 'encouragement' },
  { text: "Get ready to discover thousands, hundreds, tens, and ones!", style: 'statement' },
  // WONDER
  { text: "John just won a video game championship! His score was six thousand, two hundred and forty-eight points. But what does that number actually mean?", style: 'question' },
  { text: "What do those four digits really tell us? Let's find out!", style: 'thinking' },
  // STORY panels
  { text: "Wow! Said Sarah. Look at that number on the museum wall: three thousand, four hundred and seventy-two! But what does it mean? Asked Mike.", style: 'statement' },
  { text: "A friendly robot guide appeared. Every digit lives in its own house! The house it lives in tells you its value. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones.", style: 'statement' },
  { text: "The digit three lives in the thousands house. So it is worth three thousand! And the four in the hundreds house is worth four hundred!", style: 'emphasis' },
  { text: "The seven in the tens house is worth seventy! And the two in the ones house is worth just two! Together: three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!", style: 'emphasis' },
  { text: "Wait, said John. My top game score is four thousand and eight. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist or all the other digits get confused!", style: 'question' },
  { text: "I get it! Shouted Mike. My stamp collection has two thousand, three hundred and fifty stamps! That is two thousands, three hundreds, five tens, and zero ones! John and Sarah cheered. They had cracked the code of big numbers!", style: 'celebration' },
  // STATION A
  { text: "Welcome to the Build the Number station! Use base-ten blocks to build the number shown.", style: 'instruction' },
  { text: "Drag the thousands cubes, hundreds flats, tens rods, and ones units into the right columns!", style: 'instruction' },
  // STATION B
  { text: "You are now a Place Value Detective! Tap each digit to discover its place and value.", style: 'instruction' },
  { text: "Remember: the same digit can have completely different values depending on its position!", style: 'emphasis' },
  // STATION C
  { text: "Time to Expand It! Drag the value cards to build the expanded form of the number.", style: 'instruction' },
  { text: "Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!", style: 'emphasis' },
  // FEEDBACK
  { text: "Amazing! You built it perfectly!", style: 'celebration' },
  { text: "That's not quite right. Let's try again!", style: 'encouragement' },
  { text: "Excellent! That is the correct value!", style: 'celebration' },
  { text: "Almost there! Remember to check the place carefully.", style: 'thinking' },
  { text: "Great job completing all three stations! Now let's play and practice what you've learned!", style: 'encouragement' },
  // REFLECT
  { text: "Wonderful work today, Explorer! You have mastered place value!", style: 'celebration' },
  { text: "Pick your favourite big number and tell me how many thousands, hundreds, tens, and ones it has.", style: 'question' },
];

async function synthesize(text, style) {
  const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  const body = {
    input: { text },
    voice: { languageCode: 'en-US', name: settings.voiceName },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: settings.speakingRate,
      pitch: settings.pitch,
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.audioContent) throw new Error(`TTS failed for: ${text.slice(0, 40)}…`);
  return Buffer.from(data.audioContent, 'base64');
}

function textToFilename(text, index) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 40);
  return `audio_${slug}_${index}.mp3`;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const audioMapEntries = [];

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = textToFilename(text, i);
    const filepath = path.join(OUTPUT_DIR, filename);
    console.log(`[${i+1}/${phrases.length}] Generating: ${filename}`);
    
    // We mock actual Google TTS generation if API key is dummy
    if (API_KEY === 'dummy_key_for_now' || !API_KEY) {
      console.log('Skipping actual TTS API call (no valid key). Writing empty file.');
      fs.writeFileSync(filepath, '');
    } else {
      const buffer = await synthesize(text, style);
      fs.writeFileSync(filepath, buffer);
    }
    
    audioMapEntries.push(`  ${JSON.stringify(text)}: '/assets/audio/${filename}'`);
    await new Promise(r => setTimeout(r, 300)); // Rate limit
  }

  const mapContent = `// AUTO-GENERATED by scripts/generate_audio.js
// Do NOT edit manually. Re-run the script after changing phrases.
// Voice: en-US-Neural2-F (Google Cloud TTS)

export const audioMap = {
${audioMapEntries.join(',\n')}
};
`;
  fs.writeFileSync(AUDIO_MAP_PATH, mapContent);
  console.log(`\n✅ Done! Generated ${phrases.length} audio files.`);
  console.log(`✅ audioMap.js written to ${AUDIO_MAP_PATH}`);
}

main().catch(console.error);
