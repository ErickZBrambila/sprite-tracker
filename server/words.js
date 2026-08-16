// Word lists for generating human-readable recovery codes (e.g. "swift-otter-42").
// Kept short deliberately — 32 × 28 × 100 = 89,600 possible codes, plenty for a hobby app.

const ADJECTIVES = [
  'amber', 'bold', 'bright', 'calm', 'clean', 'cold', 'cool', 'crisp',
  'dark', 'dawn', 'deep', 'dusk', 'fast', 'fierce', 'free', 'frosted',
  'gentle', 'grand', 'keen', 'light', 'lone', 'misty', 'neon', 'quiet',
  'rapid', 'sharp', 'silent', 'sleek', 'soft', 'swift', 'warm', 'wild',
];

const ANIMALS = [
  'bear', 'crane', 'crow', 'deer', 'dove', 'eagle', 'elk', 'falcon',
  'finch', 'fox', 'hawk', 'heron', 'jay', 'kite', 'lion', 'lynx',
  'moose', 'moth', 'orca', 'otter', 'owl', 'panda', 'raven', 'seal',
  'shark', 'stag', 'swan', 'wolf',
];

function recoveryCode() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}-${animal}-${num}`;
}

module.exports = { recoveryCode };
