// Static catalog of Fortnite Chapter 7 Season 3 ("Runners") Sprites: real species/variant
// names, rarities, and abilities, hand-compiled from community guides (Beebom's Sprites guide
// and its dedicated Gem Sprites article - see README "Sources" section). There is no official
// API for this data - Epic's own account data never exposes a per-Sprite ownership record (see
// the parent project's README for the full investigation). This is a manually-curated snapshot
// as of August 2026 and WILL drift as Epic adds new Sprites/variants mid-season.
//
// This file is a plain UMD-style module so the exact same data works in both:
//   - the browser app (loaded via <script src="spritesData.js">, reads window.SpritesData)
//   - scripts/download-images.js (a Node script, reads via require())
// This avoids maintaining the sprite list twice.
//
// CATALOG entries: { id, species, variant, rarity, ability, icon }
// `icon` is a LOCAL relative path (images/<id>.<ext>) - this app self-hosts its images rather
// than hotlinking, since it's meant to be shared/hosted publicly. Run
// `node scripts/download-images.js` once (see README) to actually populate images/ from
// ICON_SOURCES below before the icons will show up.

(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mod;
  } else {
    root.SpritesData = mod;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // species: [displayName, rarity, [variant list beyond Base], ability]
  //
  // Gem is Epic's newest variant type (added "New Sprite Day" Aug 6 2026). Per Beebom's
  // dedicated Gem Sprites article, there are exactly 9 Gem variants: Water, Earth, Duck,
  // Demon, Punk, Zero Point, Aura, Grim, and Llama - it's deliberately not on every species,
  // same as Holofoil/Cube/Quack before it.
  const SPECIES = [
    ['Earth', 'rare', ['Gold', 'Gummy', 'Galaxy', 'Cube', 'Quack', 'Gem'], 'Higher chance to pull rare items/weapons from chests.'],
    ['Air', 'rare', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Increases sprint speed and jump height; nullifies fall damage.'],
    ['Fire', 'rare', ['Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Quack'], 'Triggers a fiery burst after dealing enough damage to an enemy.'],
    ['Water', 'rare', ['Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Quack', 'Gem'], 'Slowly replenishes shields for you and nearby squadmates while in water.'],
    ['Fishy', 'rare', ['Gold', 'Gummy', 'Galaxy', 'Cube'], 'Boosts swim speed; movement boost after taking damage.'],
    ['Duck', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Gem'], 'Emoting/Jamming anywhere replenishes shields.'],
    ['Striker', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Overdrive effect when mantling or hurdling.'],
    ['Ghost', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Brief cloak (invisibility) immediately upon reloading.'],
    ['Demon', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Gem'], 'Siphon: restores health/shield on elimination.'],
    ['King', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Massive pickaxe damage multiplier.'],
    ['Aura', 'epic', ['Gold', 'Gummy', 'Galaxy', 'Gem'], 'Grants a Shock Rock charge after dealing enough damage.'],
    ['Dream', 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Cube'], 'Random item on level up; Legendary loot burst at max level.'],
    ['Punk', 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Cube'], 'Chance of an infinite ammo buff.'],
    ['Boss', 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Cube'], 'Boosts both health and shields.'],
    ['Seven', 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Enemy footprints visible to your squad.'],
    ['Peeky Peely', 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Holofoil'], 'Pings nearby rare Sprites (also marks you on the map).'],
    ["Lootin' Llama", 'legendary', ['Gold', 'Gummy', 'Galaxy', 'Gem'], 'Opening ammo boxes can grant a weapon upgrade.'],
    ['Zero Point', 'mythic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Quack', 'Gem'], 'Spawns a Shield Bubble Jr. when you use a healing item.'],
    ['Burnt Peanut', 'mythic', [], 'Eliminations may drop extra loot, sometimes Mythic.'],
    ['Grim', 'mythic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Gem'], 'Marks an enemy as soon as they damage you.'],
    ['Batman', 'mythic', ['Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube'], 'Launch into the air and deploy the Bat Cape.'],
    ['Vini Jr.', 'mythic', [], 'Destructive sprint-slides; slidekicks boost fire rate and reload speed.'],
    ['Pollo', 'mythic', [], 'Eliminations slowly regenerate your shield and nearby squadmates’.'],
    ['John Wick', 'mythic', [], 'Knocking a player reveals other nearby enemies.'],
    ['Ironmouse', 'mythic', [], 'Regenerates health when low; grants Cloak and low gravity while regenerating.'],
  ];

  // Original hotlink source for each icon (id -> URL), all from static.beebom.com. This is the
  // download script's input - see scripts/download-images.js. Kept separate from CATALOG so the
  // app itself never talks to Beebom's servers at runtime, only this one-time setup script does.
  const ICON_SOURCES = {
    'earth-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Earth-Sprite.jpg',
    'earth-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174257879.png',
    'earth-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Earth-Sprite.jpg',
    'earth-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_133441302.png',
    'earth-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_170851705.png',
    'earth-quack': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_020103236.png',
    'earth-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Earth-Sprite.webp',

    'air-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_173954020.png',
    'air-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_174034531.png',
    'air-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_174108338.png',
    'air-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_174200153.png',
    'air-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_174239138.png',

    'fire-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Fire-Sprite.jpg',
    'fire-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174609739.png',
    'fire-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Fire-Sprite-1.jpg',
    'fire-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_133633142.png',
    'fire-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-15_051728053.png',
    'fire-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171140789.png',
    'fire-quack': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_020232606.png',

    'water-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Water-Sprite.jpg',
    'water-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_175226352.png',
    'water-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Water-Sprite.jpg',
    'water-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_133753539.png',
    'water-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-15_051440830.png',
    'water-quack': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_020419179.png',
    'water-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Water-Sprite.webp',

    'fishy-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034420137.png',
    'fishy-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034453912.png',
    'fishy-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034614139.png',
    'fishy-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034712420.png',
    'fishy-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171235019.png',

    'duck-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Duck-Sprite.jpg',
    'duck-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174538098.png',
    'duck-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Duck-Sprite.jpg',
    'duck-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_133927709.png',
    'duck-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Duck-Sprite.webp',

    'striker-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034745967.png',
    'striker-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034808234.png',
    'striker-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034916169.png',
    'striker-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_034954545.png',
    'striker-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-15_051855388.png',

    'ghost-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Ghost-Sprite.jpg',
    'ghost-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174720957.png',
    'ghost-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Ghost-Sprite.jpg',
    'ghost-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_134115092.png',
    'ghost-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-15_051958615.png',

    'demon-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Demon-Sprite.jpg',
    'demon-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174426653.png',
    'demon-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Demon-Sprite.jpg',
    'demon-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_134235537.png',
    'demon-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Demon-Sprite.webp',

    'king-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-King-Sprite.jpg',
    'king-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174820566.png',
    'king-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-King-Sprite.jpg',
    'king-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_134938698.png',
    'king-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-15_052107774.png',

    'aura-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035032595.png',
    'aura-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035057001.png',
    'aura-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035122656.png',
    'aura-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035158512.png',
    'aura-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Aura-Sprite.webp',

    'dream-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Dream-Sprite.jpg',
    'dream-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174502895.png',
    'dream-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Dream-Sprite.jpg',
    'dream-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_135042916.png',
    'dream-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171409268.png',

    'punk-base': 'https://static.beebom.com/wp-content/uploads/2024/12/Fortnite-Punk-Sprite.jpg',
    'punk-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174906309.png',
    'punk-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Punk-Sprite.jpg',
    'punk-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_150206001.png',
    'punk-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171310899.png',

    'boss-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035246836.png',
    'boss-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035309466.png',
    'boss-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035354024.png',
    'boss-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035417665.png',
    'boss-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171613541.png',

    'seven-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_061003851.png',
    'seven-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_061034066.png',
    'seven-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_061106089.png',
    'seven-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_061148814.png',
    'seven-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_061221057.png',

    'peeky-peely-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_023403172.png',
    'peeky-peely-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_023526805.png',
    'peeky-peely-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Peeky-Peely-Sprite.jpg',
    'peeky-peely-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_023802465.png',
    'peeky-peely-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_024222781.png',

    'lootin-llama-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_024738850.png',
    'lootin-llama-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_024822420.png',
    'lootin-llama-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_025054203.png',
    'lootin-llama-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_025513459.png',
    'lootin-llama-gem': 'https://static.beebom.com/wp-content/uploads/2026/08/Gem-Llama-Sprite.webp',

    'zero-point-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_150552601.png',
    'zero-point-holofoil': 'https://fortnite-sprites.com/sprites/zeropoint_holofoil.png',
    'zero-point-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-10_174939463.png',
    'zero-point-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/Fortnite-Gummy-Zero-Point-Sprite.jpg',
    'zero-point-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_150415645.png',
    'zero-point-cube': 'https://fortnitesprite.com/sprites/cube-zero-point-sprite.png',
    'zero-point-quack': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_155730855.png',
    'zero-point-gem': 'https://static.beebom.com/wp-content/uploads/2026/06/Zero-Point-Gem-Sprite.jpg.webp',

    'burnt-peanut-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-15_173051749.png',

    'grim-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035453933.png',
    'grim-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035516647.png',
    'grim-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035553574.png',
    'grim-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-06-26_035621147.png',
    'grim-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_155843799.png',
    'grim-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_171654413.png',
    'grim-gem': 'https://static.beebom.com/wp-content/uploads/2026/06/Grim.jpg',

    'batman-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060038074.png',
    'batman-gold': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060116856.png',
    'batman-gummy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060202731.png',
    'batman-galaxy': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060239551.png',
    'batman-holofoil': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060317189.png',
    'batman-cube': 'https://static.beebom.com/wp-content/uploads/2026/07/image_2026-07-23_170811441.png',

    'vini-jr-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-17_060648754.png',
    'pollo-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-21_175447126.png',
    'john-wick-base': 'https://static.beebom.com/wp-content/uploads/2026/06/image_2026-07-31_020521147.png',
    'ironmouse-base': 'https://static.beebom.com/wp-content/uploads/2026/07/Ironmouse-Sprite-In-Fortnite-e1785411834897.jpg',
  };

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Pulls the file extension off a source URL, defaulting to .jpg. Handles the one
  // double-extension oddity (`....jpg.webp`) by taking the last real extension.
  function extOf(url) {
    const match = url.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  function buildCatalog() {
    const catalog = [];
    for (const [species, rarity, variants, ability] of SPECIES) {
      const speciesSlug = slugify(species);
      const allVariants = ['Base', ...variants];
      for (const variant of allVariants) {
        const id = variant === 'Base' ? `${speciesSlug}-base` : `${speciesSlug}-${slugify(variant)}`;
        const source = ICON_SOURCES[id];
        catalog.push({
          id,
          species,
          variant,
          rarity,
          ability,
          icon: source ? `images/${id}.${extOf(source)}` : null,
        });
      }
    }
    return catalog;
  }

  return { CATALOG: buildCatalog(), ICON_SOURCES, slugify, extOf };
});
