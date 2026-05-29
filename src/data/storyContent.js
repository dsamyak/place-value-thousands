export const storyPanels = [
  {
    index: 0,
    title: "The Number Museum",
    screenText: `"Wow!" said Sarah. "Look at that number on the museum wall: <span class="key-term">3,472</span>!"<br/><br/>"What does it mean?" asked Mike.`,
    narrationScript: "Wow! Said Sarah. Look at that number on the museum wall: three thousand, four hundred and seventy-two! But what does it mean? Asked Mike.",
    audioKey: "Wow! Said Sarah. Look at that number on the museum wall: three thousand, four hundred and seventy-two! But what does it mean? Asked Mike.",
    visual: { type: 'panel_0' },
    keyTerms: ["3,472"],
    pvChartState: { th: null, h: null, t: null, o: null }
  },
  {
    index: 1,
    title: "The Place Value Houses",
    screenText: `A friendly robot guide appeared. "Every digit lives in its own HOUSE!<br/>The house it lives in tells you its VALUE."<br/><br/>Four glowing houses appeared: <span class="key-term">THOUSANDS</span> <span class="key-term">HUNDREDS</span> <span class="key-term">TENS</span> <span class="key-term">ONES</span>`,
    narrationScript: "A friendly robot guide appeared. Every digit lives in its own house! The house it lives in tells you its value. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones.",
    audioKey: "A friendly robot guide appeared. Every digit lives in its own house! The house it lives in tells you its value. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones.",
    visual: { type: 'panel_1' },
    keyTerms: ["THOUSANDS", "HUNDREDS", "TENS", "ONES"],
    pvChartState: { th: null, h: null, t: null, o: null }
  },
  {
    index: 2,
    title: "Thousands & Hundreds",
    screenText: `"The digit 3 lives in the THOUSANDS house," said the robot.<br/>"So it is worth <span class="key-term">3,000</span>! And the 4 in the HUNDREDS house is worth <span class="key-term">400</span>!"`,
    narrationScript: "The digit three lives in the thousands house. So it is worth three thousand! And the four in the hundreds house is worth four hundred!",
    audioKey: "The digit three lives in the thousands house. So it is worth three thousand! And the four in the hundreds house is worth four hundred!",
    visual: { type: 'panel_2' },
    keyTerms: ["3,000", "400"],
    pvChartState: { th: '3', h: '4', t: null, o: null }
  },
  {
    index: 3,
    title: "Tens & Ones",
    screenText: `"The 7 in the TENS house is worth <span class="key-term">70</span>," continued the robot.<br/>"And the 2 in the ONES house is worth just <span class="key-term">2</span>!"<br/><br/>Together they form: <span class="key-term">3,000 + 400 + 70 + 2</span> = 3,472 ✨`,
    narrationScript: "The seven in the tens house is worth seventy! And the two in the ones house is worth just two! Together: three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!",
    audioKey: "The seven in the tens house is worth seventy! And the two in the ones house is worth just two! Together: three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two!",
    visual: { type: 'panel_3' },
    keyTerms: ["70", "2", "3,000 + 400 + 70 + 2"],
    pvChartState: { th: '3', h: '4', t: '7', o: '2' }
  },
  {
    index: 4,
    title: "The Zero Mystery",
    screenText: `"Wait," said John. "My top game score is 4,008. What about the zeros?"<br/><br/>The robot smiled. "Zero means NOBODY lives in that house. But the house must still EXIST — or all the other digits get confused!"`,
    narrationScript: "Wait, said John. My top game score is four thousand and eight. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist or all the other digits get confused!",
    audioKey: "Wait, said John. My top game score is four thousand and eight. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist or all the other digits get confused!",
    visual: { type: 'panel_4' },
    keyTerms: ["zeros"],
    pvChartState: { th: '4', h: '0', t: '0', o: '8' }
  },
  {
    index: 5,
    title: "Cracking the Code",
    screenText: `"I get it!" shouted Mike. "My stamp collection has 2,350 stamps!<br/>That's <span class="key-term">2 thousands, 3 hundreds, 5 tens, and 0 ones</span>!"<br/><br/>John and Sarah cheered. They had cracked the code of BIG numbers! 🎉`,
    narrationScript: "I get it! Shouted Mike. My stamp collection has two thousand, three hundred and fifty stamps! That is two thousands, three hundreds, five tens, and zero ones! John and Sarah cheered. They had cracked the code of big numbers!",
    audioKey: "I get it! Shouted Mike. My stamp collection has two thousand, three hundred and fifty stamps! That is two thousands, three hundreds, five tens, and zero ones! John and Sarah cheered. They had cracked the code of big numbers!",
    visual: { type: 'panel_5' },
    keyTerms: ["2 thousands, 3 hundreds, 5 tens, and 0 ones"],
    pvChartState: { th: '2', h: '3', t: '5', o: '0' }
  }
];
