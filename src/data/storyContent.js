export const storyPanels = [
  {
    index: 0,
    title: "The Number Museum",
    screenText: `Priya, Kai, and Liam were on a school trip to the <span class="key-term">Number Museum</span> in Singapore.<br/><br/>"Look!" gasped Priya, pointing at a giant glowing display. "That number is <span class="key-term">3,472</span>!"<br/>"It's huge," said Kai. "But what does each part mean?"`,
    narrationScript: "Priya, Kai, and Liam were on a school trip to the Number Museum in Singapore. Look! gasped Priya, pointing at a giant glowing display. That number is three thousand, four hundred and seventy-two! It's huge, said Kai. But what does each part mean?",
    image: "/images/story_0.png",
    keyTerms: ["3,472", "Number Museum"],
    pvChartState: { th: null, h: null, t: null, o: null }
  },
  {
    index: 1,
    title: "The Place Value Houses",
    screenText: `A friendly robot guide rolled up to them. "Welcome, explorers! Every digit in a number lives in its own <span class="key-term">HOUSE</span>."<br/><br/>Four glowing houses appeared: <span class="key-term">Thousands</span>, <span class="key-term">Hundreds</span>, <span class="key-term">Tens</span>, and <span class="key-term">Ones</span>.<br/>"The house a digit lives in tells you its <span class="key-term">value</span>!"`,
    narrationScript: "A friendly robot guide rolled up to them. Welcome, explorers! Every digit in a number lives in its own house. Four glowing houses appeared: Thousands, Hundreds, Tens, and Ones. The house a digit lives in tells you its value!",
    image: "/images/story_1.png",
    keyTerms: ["THOUSANDS", "HUNDREDS", "TENS", "ONES"],
    pvChartState: { th: null, h: null, t: null, o: null }
  },
  {
    index: 2,
    title: "Thousands & Hundreds",
    screenText: `"Let's break down <span class="key-term">3,472</span>," said the robot.<br/><br/>"The digit <span class="key-term">3</span> lives in the Thousands house — so it's worth <span class="key-term">3,000</span>!"<br/>"That's like three thousand mangoes from a Mumbai market!" laughed Priya.<br/><br/>"And the <span class="key-term">4</span> in the Hundreds house is worth <span class="key-term">400</span>!"`,
    narrationScript: "Let's break down three thousand four hundred and seventy-two, said the robot. The digit 3 lives in the Thousands house, so it's worth three thousand! That's like three thousand mangoes from a Mumbai market! laughed Priya. And the 4 in the Hundreds house is worth four hundred!",
    image: "/images/story_2.png",
    keyTerms: ["3,000", "400"],
    pvChartState: { th: '3', h: '4', t: null, o: null }
  },
  {
    index: 3,
    title: "Tens & Ones",
    screenText: `"The <span class="key-term">7</span> in the Tens house is worth <span class="key-term">70</span>," continued the robot.<br/>"And the <span class="key-term">2</span> in the Ones house is worth just <span class="key-term">2</span>!"<br/><br/>"So it all adds up!" said Kai excitedly.<br/><span class="key-term">3,000 + 400 + 70 + 2 = 3,472</span> ✨<br/>"That's like counting cherry blossoms in Tokyo!"`,
    narrationScript: "The 7 in the Tens house is worth seventy, continued the robot. And the 2 in the Ones house is worth just two! So it all adds up! said Kai excitedly. Three thousand plus four hundred plus seventy plus two equals three thousand, four hundred and seventy-two! That's like counting cherry blossoms in Tokyo!",
    image: "/images/story_3.png",
    keyTerms: ["70", "2", "3,000 + 400 + 70 + 2"],
    pvChartState: { th: '3', h: '4', t: '7', o: '2' }
  },
  {
    index: 4,
    title: "The Zero Mystery",
    screenText: `"Wait," said Liam. "My dad says our village in Nairobi has <span class="key-term">4,008</span> people. What about the zeros?"<br/><br/>The robot smiled. "Zero means <span class="key-term">nobody lives in that house</span>. But the house must still EXIST — or all the other digits would get confused!"<br/><br/>"So zero is a placeholder!" said Liam. "It holds the spot even if it's empty!"`,
    narrationScript: "Wait, said Liam. My dad says our village in Nairobi has four thousand and eight people. What about the zeros? The robot smiled. Zero means nobody lives in that house. But the house must still exist, or all the other digits would get confused! So zero is a placeholder! said Liam. It holds the spot even if it's empty!",
    image: "/images/story_4.png",
    keyTerms: ["4,008", "placeholder"],
    pvChartState: { th: '4', h: '0', t: '0', o: '8' }
  },
  {
    index: 5,
    title: "Cracking the Code",
    screenText: `"I get it!" shouted Kai. "The Tokyo Skytree is <span class="key-term">634</span> metres tall — that's 6 hundreds, 3 tens, and 4 ones!"<br/><br/>"And my school in Mumbai has <span class="key-term">2,350</span> students," added Priya. "That's <span class="key-term">2 thousands, 3 hundreds, 5 tens, and 0 ones</span>!"<br/><br/>The three friends cheered — they had cracked the code of BIG numbers! 🎉`,
    narrationScript: "I get it! shouted Kai. The Tokyo Skytree is six hundred and thirty-four metres tall. That's 6 hundreds, 3 tens, and 4 ones! And my school in Mumbai has two thousand, three hundred and fifty students, added Priya. That's 2 thousands, 3 hundreds, 5 tens, and 0 ones! The three friends cheered. They had cracked the code of big numbers!",
    image: "/images/story_5.png",
    keyTerms: ["2 thousands, 3 hundreds, 5 tens, and 0 ones"],
    pvChartState: { th: '2', h: '3', t: '5', o: '0' }
  }
];
