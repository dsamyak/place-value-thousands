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
  // ═══════════════════════════════════════════════
  // INTRO (phases/IntroScreen.jsx + narration.js)
  // ═══════════════════════════════════════════════
  { text: "Hello Explorer! Today we'll unlock the secret of big numbers!", style: 'encouragement' },
  { text: "Get ready to discover thousands, hundreds, tens, and ones!", style: 'statement' },

  // narration.js introNarration()
  { text: "Welcome to Place Value!", style: 'encouragement' },
  { text: "Today, we are going to learn about thousands, hundreds, tens, and ones.", style: 'statement' },
  { text: "What happens when we put digits into different houses?", style: 'question' },
  { text: "Are you ready to explore place value and solve some fun challenges? Let us get started on our learning journey!", style: 'encouragement' },

  // ═══════════════════════════════════════════════
  // WONDER (phases/WonderPhase.jsx + narration.js)
  // ═══════════════════════════════════════════════
  { text: "John just won a video game championship! His score was six thousand, two hundred and forty-eight points. But what does that number actually mean?", style: 'question' },
  { text: "What do those four digits really tell us? Let's find out!", style: 'thinking' },

  // Wonder questions (WonderPhase.jsx questions + subtexts, passed via wonderNarration)
  { text: "What makes the number 9,999 so special?", style: 'question' },
  { text: "What happens if you add just 1 more to it?", style: 'statement' },
  { text: "How much is a thousand, really?", style: 'question' },
  { text: "If you had 1,000 cookies, how long would it take to eat them all?", style: 'statement' },
  { text: "Why do we use commas in big numbers like 1,000?", style: 'question' },
  { text: "Does the comma change the value of the number?", style: 'statement' },
  { text: "If a house costs $200,000, what happens to the zeros?", style: 'question' },
  { text: "Do zeros mean 'nothing', or are they super important?", style: 'statement' },

  // ═══════════════════════════════════════════════
  // STORY — Full narrationScript per panel
  // (used by phases/StoryPhase.jsx via storyContent.js)
  // ═══════════════════════════════════════════════
  { text: "Priya, Kai, and Liam were on a school trip to the Number Museum in Singapore. Look! gasped Priya, pointing at a giant glowing display. That number is three thousand, four hundred and seventy-two! It's huge, said Kai. But what does each part mean?", style: 'statement' },
  { text: "A friendly robot guide rolled up to them. Welcome, explorers! Every digit in a number lives in its own house. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones. The house a digit lives in tells you its value!", style: 'statement' },
  { text: "Let's break down three thousand four hundred and seventy-two, said the robot. The digit 3 lives in the Thousands house, so it's worth three thousand! That's like three thousand mangoes from a Mumbai market! laughed Priya. And the 4 in the Hundreds house is worth four hundred!", style: 'emphasis' },
  { text: "The 7 in the Tens house is worth seventy, continued the robot. And the 2 in the Ones house is worth just two! So it all adds up! said Kai excitedly. Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two! That's like counting cherry blossoms in Tokyo!", style: 'emphasis' },
  { text: "Wait, said Liam. My dad says our village in Nairobi has four thousand and eight people. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist, or all the other digits would get confused! So zero is a placeholder! said Liam. It holds the spot even if it's empty!", style: 'question' },
  { text: "I get it! shouted Kai. The Tokyo Skytree is six hundred and thirty-four metres tall. That's 6 hundreds, 3 tens, and 4 ones! And my school in Mumbai has two thousand, three hundred and fifty students, added Priya. That's 2 thousands, 3 hundreds, 5 tens, and 0 ones! The three friends cheered. They had cracked the code of big numbers!", style: 'celebration' },

  // ═══════════════════════════════════════════════
  // STORY — Individual narration segments
  // (used by components/StoryPhase.jsx via narration.js getStoryNarration)
  // ═══════════════════════════════════════════════
  // Panel 0
  { text: "Priya, Kai, and Liam were on a school trip to the Number Museum in Singapore.", style: 'statement' },
  { text: "Look! gasped Priya, pointing at a giant glowing display.", style: 'statement' },
  { text: "That number is three thousand, four hundred and seventy-two!", style: 'emphasis' },
  { text: "It's huge, said Kai. But what does each part mean?", style: 'question' },
  // Panel 1
  { text: "A friendly robot guide rolled up to them.", style: 'statement' },
  { text: "Welcome, explorers! Every digit in a number lives in its own house.", style: 'statement' },
  { text: "Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones.", style: 'emphasis' },
  { text: "The house a digit lives in tells you its value!", style: 'statement' },
  // Panel 2
  { text: "Let's break down three thousand, four hundred and seventy-two, said the robot.", style: 'statement' },
  { text: "The digit three lives in the Thousands house, so it's worth three thousand!", style: 'emphasis' },
  { text: "That's like three thousand mangoes from a Mumbai market! laughed Priya.", style: 'statement' },
  { text: "And the four in the Hundreds house is worth four hundred!", style: 'emphasis' },
  // Panel 3
  { text: "The seven in the Tens house is worth seventy.", style: 'statement' },
  { text: "And the two in the Ones house is worth just two!", style: 'statement' },
  { text: "So it all adds up! said Kai excitedly.", style: 'encouragement' },
  { text: "Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!", style: 'emphasis' },
  { text: "That's like counting cherry blossoms in Tokyo!", style: 'statement' },
  // Panel 4
  { text: "Wait, said Liam. My dad says our village in Nairobi has four thousand and eight people. What about the zeros?", style: 'question' },
  { text: "The robot smiled. Zero means nobody lives in that house.", style: 'statement' },
  { text: "But the house must still exist, or all the other digits would get confused!", style: 'emphasis' },
  { text: "So zero is a placeholder! said Liam. It holds the spot even if it's empty!", style: 'statement' },
  // Panel 5
  { text: "I get it! shouted Kai. The Tokyo Skytree is six hundred and thirty-four metres tall.", style: 'encouragement' },
  { text: "That's six hundreds, three tens, and four ones!", style: 'statement' },
  { text: "And my school in Mumbai has two thousand, three hundred and fifty students, added Priya.", style: 'statement' },
  { text: "That's two thousands, three hundreds, five tens, and zero ones!", style: 'emphasis' },
  { text: "The three friends cheered. They had cracked the code of big numbers!", style: 'celebration' },

  // ═══════════════════════════════════════════════
  // SIMULATE — Station intros (narration.js)
  // ═══════════════════════════════════════════════
  { text: "Build the number using the Place Value blocks!", style: 'instruction' },
  { text: "Can you make the number exactly right?", style: 'question' },
  { text: "Look at the number and blocks. Do they match? Tap True or False!", style: 'instruction' },
  { text: "Now fill in the missing digit. What is the value of the highlighted digit?", style: 'question' },

  // Simulate station intros (simulations/*.jsx)
  { text: "Welcome to the Build the Number station! Use base-ten blocks to build the number shown.", style: 'instruction' },
  { text: "Drag the thousands cubes, hundreds flats, tens rods, and ones units into the right columns!", style: 'instruction' },
  { text: "You are now a Place Value Detective! Tap each digit to discover its place and value.", style: 'instruction' },
  { text: "Remember: the same digit can have completely different values depending on its position!", style: 'emphasis' },
  { text: "Time to Expand It! Drag the value cards to build the expanded form of the number.", style: 'instruction' },

  // ═══════════════════════════════════════════════
  // SIMULATE — Feedback (simulations/*.jsx + narration.js)
  // ═══════════════════════════════════════════════
  { text: "Amazing! You built it perfectly!", style: 'celebration' },
  { text: "That's not quite right. Let's try again!", style: 'encouragement' },
  { text: "Excellent! That is the correct value!", style: 'celebration' },
  { text: "Almost there! Remember to check the place carefully.", style: 'thinking' },
  { text: "Great job completing all three stations! Now let's play and practice what you've learned!", style: 'encouragement' },
  { text: "Great job!", style: 'encouragement' },
  { text: "You got it right!", style: 'celebration' },
  { text: "Yes! You found it!", style: 'celebration' },
  { text: "Great job completing the Detective station!", style: 'celebration' },
  { text: "Correct!", style: 'celebration' },

  // ═══════════════════════════════════════════════
  // PLAY — World intros & completions (narration.js)
  // ═══════════════════════════════════════════════
  { text: "Welcome to Planet Ones!", style: 'celebration' },
  { text: "Welcome to Hundreds Haven!", style: 'celebration' },
  { text: "Welcome to Thousand Tower!", style: 'celebration' },
  { text: "Welcome to Value Village!", style: 'celebration' },
  { text: "Welcome to Expanded Explorer!", style: 'celebration' },
  { text: "Welcome to Zero Zone!", style: 'celebration' },
  { text: "Welcome to Double Zero Desert!", style: 'celebration' },
  { text: "Welcome to Word Wizard!", style: 'celebration' },
  { text: "Welcome to Mixed Challenge Mesa!", style: 'celebration' },
  { text: "Welcome to Master Mountain!", style: 'celebration' },

  { text: "Planet Ones Complete!", style: 'statement' },
  { text: "Hundreds Haven Complete!", style: 'statement' },
  { text: "Thousand Tower Complete!", style: 'statement' },
  { text: "Value Village Complete!", style: 'statement' },
  { text: "Expanded Explorer Complete!", style: 'statement' },
  { text: "Zero Zone Complete!", style: 'statement' },
  { text: "Double Zero Desert Complete!", style: 'statement' },
  { text: "Word Wizard Complete!", style: 'statement' },
  { text: "Mixed Challenge Mesa Complete!", style: 'statement' },
  { text: "Master Mountain Complete!", style: 'statement' },

  // ═══════════════════════════════════════════════
  // REFLECT (narration.js + phases/ReflectPhase.jsx)
  // ═══════════════════════════════════════════════
  { text: "Wonderful work today, Explorer! You have mastered place value!", style: 'celebration' },
  { text: "Wonderful work today, Explorer! You have mastered place value! Let's look at your achievements.", style: 'celebration' },
  { text: "Pick your favourite big number and tell me how many thousands, hundreds, tens, and ones it has.", style: 'question' },
  { text: "What did you learn about Place Value?", style: 'question' },
  { text: "How confident do you feel about 4-digit numbers?", style: 'question' },
];


// Deduplicate by text
const seen = new Set();
const uniquePhrases = [];
for (const p of phrases) {
  if (!seen.has(p.text)) {
    seen.add(p.text);
    uniquePhrases.push(p);
  }
}

// Main generation loop
async function generate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const audioMap = {};

  console.log(`\n📢 Generating audio for ${uniquePhrases.length} unique phrases...\n`);

  for (const [i, { text, style }] of uniquePhrases.entries()) {
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
      console.error(`[ERROR] ${text.slice(0, 60)}: ${res.status}`);
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
  console.log(`\n✅ audioMap.js written with ${Object.keys(audioMap).length} entries.`);
}

generate().catch(console.error);
