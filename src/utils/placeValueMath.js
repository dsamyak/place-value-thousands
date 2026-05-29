export function getDigitAt(num, position) {
  // position: 'thousands'|'hundreds'|'tens'|'ones'
  const digits = String(num).padStart(4, '0');
  const map = { thousands: 0, hundreds: 1, tens: 2, ones: 3 };
  return parseInt(digits[map[position]], 10);
}

export function getValueAt(num, position) {
  const multipliers = { thousands: 1000, hundreds: 100, tens: 10, ones: 1 };
  return getDigitAt(num, position) * multipliers[position];
}

export function toExpandedForm(num) {
  // Returns array of [th_value, h_value, t_value, o_value]
  const s = String(num).padStart(4, '0');
  return [
    parseInt(s[0], 10) * 1000,
    parseInt(s[1], 10) * 100,
    parseInt(s[2], 10) * 10,
    parseInt(s[3], 10) * 1
  ];
}

export function toExpandedString(num) {
  const [th, h, t, o] = toExpandedForm(num);
  return `${th} + ${h} + ${t} + ${o}`;
}

export function toWordForm(num) {
  const onesMap = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tensMap = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';

  let str = '';
  const s = String(num).padStart(4, '0');
  const th = parseInt(s[0], 10);
  const h = parseInt(s[1], 10);
  const t = parseInt(s[2], 10);
  const o = parseInt(s[3], 10);

  if (th > 0) {
    str += `${onesMap[th]} thousand`;
  }

  if (h > 0) {
    if (str) str += ', ';
    str += `${onesMap[h]} hundred`;
  }

  if (t > 0 || o > 0) {
    if (str) str += ' and ';
    if (t < 2) {
      str += onesMap[t * 10 + o];
    } else {
      str += tensMap[t];
      if (o > 0) str += `-${onesMap[o]}`;
    }
  }

  return str;
}

export function hasZeroDigit(num) {
  return String(num).includes('0');
}

export function countZeroDigits(num) {
  return String(num).split('').filter(d => d === '0').length;
}

export function randomFourDigit({ minZeros = 0, maxZeros = 4, min = 1000, max = 9999 } = {}) {
  let attempts = 0;
  let n;
  do {
    n = Math.floor(Math.random() * (max - min + 1)) + min;
    const zeros = countZeroDigits(n);
    if (zeros >= minZeros && zeros <= maxZeros) return n;
    attempts++;
  } while (attempts < 1000);
  return n; 
}
