import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL = 'eleven_multilingual_v2';
const OUTPUT_DIR = 'public/assets/audio';
const MAP_FILE = 'src/utils/audioMap.js';

const VOICE_SETTINGS = {
  statement: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  question: { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.90, style: 0.8 },
  emphasis: { stability: 0.85, similarity_boost: 0.90, style: 0.1 },
  thinking: { stability: 0.65, similarity_boost: 0.80, style: 0.4 },
  celebration: { stability: 0.40, similarity_boost: 0.95, style: 0.9 },
  instruction: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
};

const phrases = [
  // INTRO
  { text: "Hello Explorer! Today we'll unlock the secret of big numbers!", style: 'encouragement' },
  { text: "Get ready to discover thousands, hundreds, tens, and ones!", style: 'statement' },
  // WONDER
  { text: "John just won a video game championship! His score was six thousand, two hundred and forty-eight points. But what does that number actually mean?", style: 'question' },
  { text: "What do those four digits really tell us? Let's find out!", style: 'thinking' },
  // STORY panels (globally referenced)
  { text: "Priya, Kai, and Liam were on a school trip to the Number Museum in Singapore. Look! gasped Priya. That number is three thousand, four hundred and seventy-two! It's huge, said Kai. But what does each part mean?", style: 'statement' },
  { text: "A friendly robot guide rolled up to them. Welcome, explorers! Every digit in a number lives in its own house. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones. The house a digit lives in tells you its value!", style: 'statement' },
  { text: "Let's break down three thousand, four hundred and seventy-two, said the robot. The digit three lives in the Thousands house, so it's worth three thousand! That's like three thousand mangoes from a Mumbai market! laughed Priya. And the four in the Hundreds house is worth four hundred!", style: 'emphasis' },
  { text: "The seven in the Tens house is worth seventy. And the two in the Ones house is worth just two! So it all adds up! said Kai excitedly. Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two! That's like counting cherry blossoms in Tokyo!", style: 'emphasis' },
  { text: "Wait, said Liam. My dad says our village in Nairobi has four thousand and eight people. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist, or all the other digits would get confused! So zero is a placeholder!", style: 'question' },
  { text: "I get it! shouted Kai. The Tokyo Skytree is six hundred and thirty-four metres tall. That's six hundreds, three tens, and four ones! And my school in Mumbai has two thousand, three hundred and fifty students, added Priya. That's two thousands, three hundreds, five tens, and zero ones! The three friends cheered. They had cracked the code of big numbers!", style: 'celebration' },
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


// Main generation loop
async function generate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const audioMap = {};

  for (const [i, { text, style }] of phrases.entries()) {
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`[SKIP] ${filename}`);
      audioMap[text] = `/assets/audio/${filename}`;
      continue;
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.VITE_ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: VOICE_SETTINGS[style],
        }),
      }
    );

    if (!res.ok) {
      console.error(`[ERROR] ${text}: ${res.status}`);
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    audioMap[text] = `/assets/audio/${filename}`;
    console.log(`[OK] ${filename}`);
  }

  // Write audioMap.js
  const mapContent = `// AUTO-GENERATED — do not edit manually
// Run: node scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log(`\naudioMap.js written with ${Object.keys(audioMap).length} entries.`);
}

generate().catch(console.error);
