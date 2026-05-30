import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

export function introNarration() {
  return [
    cheer("Welcome to Place Value!"),
    say("Today, we are going to learn about thousands, hundreds, tens, and ones."),
    ask("What happens when we put digits into different houses?"),
    cheer("Are you ready to explore place value and solve some fun challenges? Let us get started on our learning journey!"),
  ];
}

export function wonderNarration(questionText, subtext) {
  return [
    ask(questionText),
    say(subtext),
  ];
}

export function wonderDiscoverNarration() {
  return [];
}

export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("Wow! Said Sarah. Look at that number on the museum wall: three thousand, four hundred and seventy-two!"),
        ask("But what does it mean? Asked Mike."),
      ];
    case 1:
      return [
        say("A friendly robot guide appeared. Every digit lives in its own house!"),
        emphasize("The house it lives in tells you its value."),
        say("Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones."),
      ];
    case 2:
      return [
        say("The digit three lives in the thousands house. So it is worth three thousand!"),
        emphasize("And the four in the hundreds house is worth four hundred!"),
      ];
    case 3:
      return [
        say("The seven in the tens house is worth seventy! And the two in the ones house is worth just two!"),
        emphasize("Together: three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!"),
      ];
    case 4:
      return [
        ask("Wait, said John. My top game score is four thousand and eight. What about the zeros?"),
        say("The robot smiled. Zero means nobody lives in that house."),
        emphasize("But the house must still exist or all the other digits get confused!"),
      ];
    case 5:
      return [
        cheer("I get it! Shouted Mike. My stamp collection has two thousand, three hundred and fifty stamps!"),
        say("That is two thousands, three hundreds, five tens, and zero ones!"),
        cheer("John and Sarah cheered. They had cracked the code of big numbers!"),
      ];
    default:
      return [];
  }
}

export function simulateStation1Intro() {
  return [
    instruct("Build the number using the Place Value blocks!"),
    ask("Can you make the number exactly right?"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Look at the number and blocks. Do they match? Tap True or False!"),
  ];
}

export function simulateStation3Intro() {
  return [
    ask("Now fill in the missing digit. What is the value of the highlighted digit?"),
  ];
}

export function simulateAllComplete() {
  return [];
}

export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to ${worldName}!`),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName, score, total) {
  return [
    say(`${worldName} Complete!`),
    say(`Score: ${score} out of ${total}`),
  ];
}

export function reflectIntroNarration() {
  return [
    ask("What did you learn about Place Value?"),
  ];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel about 4-digit numbers?"),
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    say(`You scored ${Math.round(pct)}%`),
  ];
}
