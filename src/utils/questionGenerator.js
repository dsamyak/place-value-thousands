import { randomFourDigit, getDigitAt, getValueAt, toExpandedString, toWordForm } from './placeValueMath';
import { shuffle } from './shuffle';
import { WORLD_CONFIG } from '../data/worldConfig';

const GLOBAL_NAMES = ['John', 'Sarah', 'Mike', 'Emma', 'Liam', 'Aisha', 'Carlos', 'Mei'];

const CONTEXT_TEMPLATES = [
  (name, num, place) => `${name}'s town has a population of ${num.toLocaleString()} people. How many ${place} are in this number?`,
  (name, num, place) => `${name} ran ${num.toLocaleString()} steps this month! What is the value of the ${place} digit?`,
  (name, num, place) => `${name}'s school library has ${num.toLocaleString()} books. Which digit is in the ${place} place?`,
  (name, num, place) => `${name} scored ${num.toLocaleString()} points in a game. What is the ${place} digit worth?`,
  (name, num, place) => `A mountain is ${num.toLocaleString()} metres tall. ${name} wants to know: what is the value of the ${place} digit?`,
];

function pickName(names, usedCount) {
  const eligible = names.filter(n => (usedCount[n] || 0) < 2);
  const name = eligible[Math.floor(Math.random() * eligible.length)];
  usedCount[name] = (usedCount[name] || 0) + 1;
  return name;
}

function getFreshNumber(world, usedNumbers) {
  const min = world.range[0];
  const max = world.range[1];
  const zeroConfig = world.allowZero
    ? (world.zeroConstraint || { minZeros: 0, maxZeros: 3 })
    : { minZeros: 0, maxZeros: 0 };
  let num;
  let attempts = 0;
  do {
    num = randomFourDigit({ min, max, ...zeroConfig });
    attempts++;
  } while (usedNumbers.has(num) && attempts < 500);
  return num;
}

function genValueDistractors(correctVal, num, position) {
  const positions = ['thousands', 'hundreds', 'tens', 'ones'];
  const digit = getDigitAt(num, position);
  const distractors = new Set();

  for (const p of positions) {
    if (p !== position) {
      const val = digit * (p === 'thousands' ? 1000 : p === 'hundreds' ? 100 : p === 'tens' ? 10 : 1);
      if (val !== correctVal) distractors.add(String(val));
    }
  }
  if (String(digit) !== String(correctVal)) distractors.add(String(digit));
  // Add some random distractor if we don't have enough
  while (distractors.size < 3) {
    let extra = digit * Math.pow(10, Math.floor(Math.random() * 4));
    if (extra !== correctVal) distractors.add(String(extra));
  }

  return [...distractors].slice(0, 3);
}

function generateQuestion(type, world, usedNumbers, usedNamesCount) {
  const num = getFreshNumber(world, usedNumbers);
  const positions = ['thousands', 'hundreds', 'tens', 'ones'];

  switch (type) {
    case 'which_place': {
      const pos = positions[Math.floor(Math.random() * 4)];
      const digit = getDigitAt(num, pos);
      return {
        id: `wp_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `What place is the highlighted digit in?`,
        highlightedDigit: digit,
        highlightedPosition: pos, // Custom property for this type
        answer: pos,
        answerType: 'mcq',
        options: shuffle(positions.map(p => p.charAt(0).toUpperCase() + p.slice(1))),
        explanation: `In ${num.toLocaleString()}, the digit ${digit} is in the ${pos} place, so its value is ${getValueAt(num, pos).toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'whats_worth': {
      const pos = positions[Math.floor(Math.random() * 4)];
      const correctVal = getValueAt(num, pos);
      const distractors = genValueDistractors(correctVal, num, pos);
      return {
        id: `ww_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `What is the VALUE of the ${pos} digit in ${num.toLocaleString()}?`,
        answer: String(correctVal),
        answerType: 'mcq',
        options: shuffle([String(correctVal), ...distractors]),
        explanation: `The digit ${getDigitAt(num, pos)} is in the ${pos} place. ${pos.charAt(0).toUpperCase() + pos.slice(1)} have a value of × ${pos === 'thousands' ? 1000 : pos === 'hundreds' ? 100 : pos === 'tens' ? 10 : 1}, so its value is ${correctVal.toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'build_it': {
      return {
        id: `bi_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: '', // We show blocks instead
        question: `What number do the blocks represent?`,
        answer: String(num),
        answerType: 'number_pad',
        explanation: `The blocks represent ${toExpandedString(num)} = ${num.toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'expanded_form': {
      const correct = toExpandedString(num);
      const dist1 = toExpandedString(num).replace('+', '-'); // simplistic decoy
      const dist2 = String(num).split('').join(' + '); // 3 + 4 + 7 + 2
      const dist3 = toExpandedString(num + 100); 
      return {
        id: `ef_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `Which expanded form matches this number?`,
        answer: correct,
        answerType: 'mcq',
        options: shuffle([correct, dist1, dist2, dist3]),
        explanation: `The expanded form of ${num.toLocaleString()} is ${correct}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'standard_form': {
      const expanded = toExpandedString(num);
      return {
        id: `sf_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: expanded,
        question: `What is the standard form of this number?`,
        answer: String(num),
        answerType: 'number_pad',
        explanation: `${expanded} equals ${num.toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'missing_digit': {
      const pos = positions[Math.floor(Math.random() * 4)];
      const digit = getDigitAt(num, pos);
      return {
        id: `md_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `What digit goes in the blank for the ${pos} place?`,
        missingPosition: pos,
        answer: String(digit),
        answerType: 'number_pad',
        explanation: `In ${num.toLocaleString()}, the digit in the ${pos} place is ${digit}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'number_in_words': {
      const correct = toWordForm(num);
      const dist1 = toWordForm(num + 100);
      const dist2 = toWordForm(num - 10 > 0 ? num - 10 : num + 10);
      const dist3 = correct.replace('thousand', 'hundred');
      return {
        id: `niw_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `Choose the correct word form for this number.`,
        answer: correct,
        answerType: 'mcq',
        options: shuffle([correct, dist1, dist2, dist3]),
        explanation: `${num.toLocaleString()} is written as "${correct}".`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'words_to_number': {
      const wordForm = toWordForm(num);
      return {
        id: `wtn_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: wordForm,
        question: `What is this number in numerals?`,
        answer: String(num),
        answerType: 'number_pad',
        explanation: `"${wordForm}" is written as ${num.toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'true_false': {
      const pos = positions[Math.floor(Math.random() * 4)];
      const correctVal = getValueAt(num, pos);
      const isTrue = Math.random() > 0.5;
      let claimVal = correctVal;
      if (!isTrue) {
        // wrong claim
        claimVal = getDigitAt(num, pos);
        if (claimVal === correctVal) claimVal += 10; 
      }
      return {
        id: `tf_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question: `True or False: In ${num.toLocaleString()}, the digit ${getDigitAt(num, pos)} has the value ${claimVal}.`,
        answer: isTrue ? 'True' : 'False',
        answerType: 'true_false',
        options: ['True', 'False'],
        explanation: `The digit ${getDigitAt(num, pos)} is in the ${pos} place, so its value is ${correctVal.toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    case 'word_problem': {
      const name = pickName(GLOBAL_NAMES, usedNamesCount);
      const pos = positions[Math.floor(Math.random() * 4)];
      const template = CONTEXT_TEMPLATES[Math.floor(Math.random() * CONTEXT_TEMPLATES.length)];
      const question = template(name, num, pos);
      const digit = getDigitAt(num, pos);
      return {
        id: `wpt_${Date.now()}_${Math.random()}`,
        type,
        number: num,
        display: num.toLocaleString(),
        question,
        answer: String(digit),
        answerType: 'number_pad',
        explanation: `In ${num.toLocaleString()}, the ${pos} digit is ${digit}, which has a value of ${getValueAt(num, pos).toLocaleString()}.`,
        difficulty: world.difficulty,
        hasZero: String(num).includes('0'),
      };
    }
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

export function generateQuestionSet() {
  const usedNumbers = new Set();
  const usedNamesCount = {};
  const questions = [];

  for (let worldIdx = 0; worldIdx < 10; worldIdx++) {
    const world = WORLD_CONFIG[worldIdx];
    const worldQuestions = [];
    const types = shuffle([...world.types]); 

    for (let qIdx = 0; qIdx < 10; qIdx++) {
      const type = types[qIdx % types.length];
      const q = generateQuestion(type, world, usedNumbers, usedNamesCount);
      q.worldIndex = worldIdx;
      worldQuestions.push(q);
      usedNumbers.add(q.number);
    }
    questions.push(...worldQuestions);
  }
  return questions;
}
