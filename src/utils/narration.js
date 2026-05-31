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
        say("Sarah, Mike, and John were on a school trip to the Science Museum in Chicago."),
        say("Look! gasped Sarah, pointing at a giant glowing display."),
        emphasize("That number is three thousand, four hundred and seventy-two!"),
        ask("It's huge, said Mike. But what does each part mean?"),
      ];
    case 1:
      return [
        say("A friendly robot guide rolled up to them."),
        say("Welcome, explorers! Every digit in a number lives in its own house."),
        emphasize("Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones."),
        say("The house a digit lives in tells you its value!"),
      ];
    case 2:
      return [
        say("Let's break down three thousand, four hundred and seventy-two, said the robot."),
        emphasize("The digit three lives in the Thousands house, so it's worth three thousand!"),
        say("That's like three thousand apples from a New York market! laughed Sarah."),
        emphasize("And the four in the Hundreds house is worth four hundred!"),
      ];
    case 3:
      return [
        say("The seven in the Tens house is worth seventy."),
        say("And the two in the Ones house is worth just two!"),
        cheer("So it all adds up! said Mike excitedly."),
        emphasize("Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!"),
        say("That's like counting apple trees in Washington!"),
      ];
    case 4:
      return [
        ask("Wait, said John. My dad says our town in Texas has four thousand and eight people. What about the zeros?"),
        say("The robot smiled. Zero means nobody lives in that house."),
        emphasize("But the house must still exist, or all the other digits would get confused!"),
        say("So zero is a placeholder! said John. It holds the spot even if it's empty!"),
      ];
    case 5:
      return [
        cheer("I get it! shouted Mike. A skyscraper in Chicago is six hundred and thirty-four feet tall."),
        say("That's six hundreds, three tens, and four ones!"),
        say("And my school in Boston has two thousand, three hundred and fifty students, added Sarah."),
        emphasize("That's two thousands, three hundreds, five tens, and zero ones!"),
        celebrate("The three friends cheered. They had cracked the code of big numbers!"),
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
