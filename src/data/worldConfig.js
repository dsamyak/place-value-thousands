export const WORLD_CONFIG = [
  {
    index: 0, name: 'Planet Ones',
    range: [10, 99],
    types: ['more_or_less','whats_worth'],
    difficulty: 'intro', allowZero: false, timedMode: false
  },
  {
    index: 1, name: 'Hundreds Haven',
    range: [100, 999],
    types: ['more_or_less','whats_worth','true_false'],
    difficulty: 'easy', allowZero: false, timedMode: false
  },
  {
    index: 2, name: 'Thousand Tower',
    range: [1000, 4999],
    types: ['more_or_less','whats_worth','build_it'],
    difficulty: 'easy', allowZero: false, timedMode: false
  },
  {
    index: 3, name: 'Value Village',
    range: [1000, 5999],
    types: ['more_or_less','whats_worth','build_it','true_false'],
    difficulty: 'medium', allowZero: false, timedMode: false
  },
  {
    index: 4, name: 'Expanded Explorer',
    range: [1000, 6999],
    types: ['expanded_form','standard_form','missing_digit'],
    difficulty: 'medium', allowZero: false, timedMode: false
  },
  {
    index: 5, name: 'Zero Zone',
    range: [1000, 7999],
    types: ['more_or_less','whats_worth','true_false','missing_digit'],
    difficulty: 'medium', allowZero: true, timedMode: false,
    zeroConstraint: { minZeros: 1, maxZeros: 1 }
  },
  {
    index: 6, name: 'Double Zero Desert',
    range: [1000, 8999],
    types: ['build_it','expanded_form','standard_form','true_false'],
    difficulty: 'hard', allowZero: true, timedMode: false,
    zeroConstraint: { minZeros: 2, maxZeros: 2 }
  },
  {
    index: 7, name: 'Word Wizard',
    range: [1000, 9999],
    types: ['number_in_words','words_to_number'],
    difficulty: 'hard', allowZero: true, timedMode: false
  },
  {
    index: 8, name: 'Mixed Challenge Mesa',
    range: [1000, 9999],
    types: ['more_or_less','whats_worth','build_it','expanded_form',
            'standard_form','missing_digit','number_in_words',
            'words_to_number','true_false','word_problem'],
    difficulty: 'hard', allowZero: true, timedMode: false
  },
  {
    index: 9, name: 'Master Mountain',
    range: [1000, 9999],
    types: ['more_or_less','whats_worth','build_it','expanded_form',
            'standard_form','missing_digit','number_in_words',
            'words_to_number','true_false','word_problem'],
    difficulty: 'challenge', allowZero: true, timedMode: true, timeLimit: 10
  },
];
