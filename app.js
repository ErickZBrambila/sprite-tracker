const el = (id) => document.getElementById(id);

// Detect phone / tablet / desktop and stamp data-device on <html> so CSS can respond.
function setDeviceType() {
  const isTouch = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  const w = window.innerWidth;
  document.documentElement.dataset.device = !isTouch ? 'desktop' : w <= 640 ? 'phone' : 'tablet';
}
setDeviceType();
window.addEventListener('resize', setDeviceType);

// ---- i18n ----
const STRINGS = {
  en: {
    nav_checklist:'Checklist', nav_dashboard:'Dashboard', nav_compare:'Compare', nav_wiki:'Wiki', nav_story:'Story',
    title_share:'Share your collection', title_sync:'Your sync code — click to manage',
    title_export:'Export your data as a backup file', title_import:'Import a backup file',
    title_tour:'Start guided tour', title_reset:'Clear all data on this device',
    sync_modal_title:'Sync across devices',
    sync_display_name_hint:'Display name — shown in the header and easy to remember.',
    sync_username_placeholder:'Your name', sync_save_btn:'Save',
    sync_code_hint:'Your sync code — save it to access your checklist from any browser or device.',
    sync_connecting:'connecting…', sync_copy_btn:'Copy',
    sync_qr_hint:'Scan with another device to connect your collection',
    sync_connect_label:'Connect to an existing account',
    sync_connect_hint:'Enter a sync code from another device to load its checklist here. <strong>This replaces your current data on this device.</strong>',
    sync_code_placeholder:'e.g. swift-otter-42', sync_connect_btn:'Connect', sync_close_btn:'Close',
    friend_modal_title:'Add a friend',
    friend_modal_hint:'Enter their sync code to compare your collections.',
    friend_code_label:'Sync code', friend_code_placeholder:'e.g. swift-otter-42',
    friend_name_label:'Nickname (optional)', friend_name_placeholder:'e.g. Diego',
    friend_cancel_btn:'Cancel', friend_add_btn:'Add',
    share_modal_title:'Share your collection',
    share_modal_hint:'Anyone with this link can view your Sprites — read-only.',
    share_img_alt:'Your Sprite collection card',
    share_copy_btn:'Copy', share_close_btn:'Close', share_download_btn:'↓ Download image',
    share_ios_hint:'Hold the image above and tap <strong>Save to Photos</strong>',
    share_android_hint:'Hold the image above and tap <strong>Save image</strong> — or tap <strong>↓ Download image</strong> below',
    confirm_title:'Clear all data?',
    confirm_body:'This removes your entire Sprite checklist and history from this browser. Export a backup first if you want to keep it.',
    confirm_cancel:'Cancel', confirm_ok:'Clear everything',
    search_placeholder:'Search Sprites…',
    filter_all_rarities:'All rarities', filter_all_variants:'All variants',
    sort_species:'Sort: Species', sort_alpha:'Sort: A-Z', sort_rarity:'Sort: Rarity',
    sort_completion:'Sort: Least complete first',
    view_all:'All', view_owned:'Owned', view_missing:'Missing',
    view_needs_mastery:'Needs Mastery', view_mastered:'Mastered',
    season_all:'All Seasons', empty_no_match:'No Sprites match this filter.',
    stat_collected:'Collected', stat_missing:'Missing',
    stat_mastered:'Mastered', stat_needs_mastery:'Needs Mastery',
    season_label_ch6s1:'Ch6 S1 · Sprites Awaken',
    season_label_ch7s3:'Ch7 S3 · Runners',
    season_label_ch7s4:'Ch7 S4 · Override',
    chip_mastered:'Mastered — tap to reset',
    chip_owned:'Owned — tap to mark Mastered',
    chip_unowned:'Tap to mark Owned',
    dashboard_progress:'Progress over time', dashboard_rarity:'By rarity',
    dashboard_variant:'By variant', dashboard_species:'By species',
    dashboard_activity:'Recent activity',
    dashboard_activity_empty:'Nothing tracked yet — head to the Checklist tab to get started.',
    timeline_empty:'Check off a few Sprites to see your progress over time here.',
    timeline_collected:'Collected', timeline_mastered:'Mastered',
    compare_you:'You', compare_collected:'Collected', compare_mastered:'Mastered',
    compare_share_qr:'▦ Share QR', compare_add_friend:'Add Friend',
    dot_mastered:'Mastered', dot_owned:'Owned', dot_missing:'Missing',
    wiki_title:'Sprite Wiki',
    wiki_subtitle:'Tap any Sprite to see its ability, season, locations, and all variants. Read-only — use the Checklist tab to track your collection.',
    wiki_season:'Season', wiki_ability:'Ability', wiki_drop_rate:'Drop Rate', wiki_locations:'Locations',
    wiki_species_count: (n) => `${n} species`,
    wiki_card_variants: (n) => `${n} variants`,
    wiki_variants_label: (n) => `Variants (${n})`,
    wiki_ch6s1_label:'Chapter 6 Season 1',
    wiki_ch7s3_label:'Chapter 7 Season 3 — Runners',
    wiki_ch7s4_label:'Chapter 7 Season 4 — Override',
    story_headline:'Your Sprite journey continues.',
    story_sub:'Every season, new companions emerge. Keep collecting.',
    story_cta:'Back to your collection →',
    share_qr_title:'Share your QR code',
    share_qr_hint:'Have a friend scan this with their phone camera to add you in Compare.',
    share_qr_close:'Close', share_qr_copy:'Copy link',
    activity_mastered:'Mastered', activity_owned:'Marked owned', activity_reset:'Reset',
    time_just_now:'just now',
    time_s_ago: (s) => `${s}s ago`,
    time_m_ago: (m) => `${m}m ago`,
    time_h_ago: (h) => `${h}h ago`,
    time_d_ago: (d) => `${d}d ago`,
    toast_backup_downloaded:'Backup downloaded',
    toast_imported: (n) => `Imported ${n} events`,
    toast_cleared:'Cleared',
    toast_link_copied:'Link copied!',
    toast_copy_failed:'Copy failed',
    toast_copy_failed_manual:'Copy failed — select and copy the code manually',
    toast_sync_code_copied:'Sync code copied',
    toast_connected:'Connected — checklist loaded from the other device',
    toast_friend_added: (name) => `${name} added!`,
    toast_qr_copy:'Link copied — send it to your friend',
    toast_username_set: (alias) => `Username set — friends can find you as “${alias}”`,
    toast_username_local: (err) => `Name saved locally. ${err}`,
    toast_display_name_cleared:'Display name cleared',
    toast_no_sync_code:'No sync code yet — open Sync first',
    toast_share_no_code:'Open Sync first to get your sync code',
    toast_qr_no_lib:'QR library not loaded — check connection.',
    toast_qr_loaded:'Sync code loaded from QR — tap Connect to link your collection',
    btn_saving:'Saving…', btn_connecting:'Connecting…', btn_adding:'Adding…',
    tour_step1_title:'Welcome to Sprite Tracker!',
    tour_step1_body:"Your personal Fortnite Sprite collection checklist. Let's walk through the key features — takes about 30 seconds.",
    tour_step2_title:'Tap to collect',
    tour_step2_body:'Tap any Sprite once to mark it <strong>owned ✓</strong>, again for <strong>mastered ★</strong>, once more to clear. Progress saves instantly.',
    tour_step3_title:'Progress rings',
    tour_step3_body:"Tap a ring to filter the checklist — jump straight to what's <em>Missing</em> or <em>Needs Mastery</em>.",
    tour_step4_title:'Dashboard',
    tour_step4_body:'See your progress over time with charts, rarity breakdowns, and a recent activity feed.',
    tour_step5_title:'Sprite Wiki',
    tour_step5_body:'Tap any Sprite card to open its wiki entry — locations, lore, and all available variants at a glance.',
    tour_step6_title:'Compare with friends',
    tour_step6_body:'Tap <strong>Add Friend</strong> and enter their sync code to see their collection side-by-side. Up to 4 friends at once.',
    tour_step7_title:'Your sync code',
    tour_step7_body:'Save this code to access your checklist from any device — or share it with a friend so they can add you in Compare.',
    tour_step8_title:'Share your collection',
    tour_step8_body:'Tap the share icon to get a link to your read-only collection page and download a 1080×1080 image card — perfect for Instagram or anywhere else.',
    tour_skip:'Skip tour', tour_next:'Next →', tour_done:'Done!',
  },
  es: {
    nav_checklist:'Lista', nav_dashboard:'Panel', nav_compare:'Comparar', nav_wiki:'Wiki', nav_story:'Historia',
    title_share:'Compartir tu colección', title_sync:'Tu código de sincronización — toca para gestionar',
    title_export:'Exportar datos como copia de seguridad', title_import:'Importar copia de seguridad',
    title_tour:'Iniciar guía rápida', title_reset:'Borrar todos los datos en este dispositivo',
    sync_modal_title:'Sincronizar entre dispositivos',
    sync_display_name_hint:'Nombre visible — se muestra en la cabecera.',
    sync_username_placeholder:'Tu nombre', sync_save_btn:'Guardar',
    sync_code_hint:'Tu código de sincronización — guárdalo para acceder desde cualquier dispositivo.',
    sync_connecting:'conectando…', sync_copy_btn:'Copiar',
    sync_qr_hint:'Escanea con otro dispositivo para conectar tu colección',
    sync_connect_label:'Conectar a una cuenta existente',
    sync_connect_hint:'Ingresa el código de otro dispositivo para cargar su lista aquí. <strong>Esto reemplaza tus datos actuales en este dispositivo.</strong>',
    sync_code_placeholder:'ej. swift-otter-42', sync_connect_btn:'Conectar', sync_close_btn:'Cerrar',
    friend_modal_title:'Agregar un amigo',
    friend_modal_hint:'Ingresa su código de sincronización para comparar colecciones.',
    friend_code_label:'Código de sincronización', friend_code_placeholder:'ej. swift-otter-42',
    friend_name_label:'Apodo (opcional)', friend_name_placeholder:'ej. Diego',
    friend_cancel_btn:'Cancelar', friend_add_btn:'Agregar',
    share_modal_title:'Compartir tu colección',
    share_modal_hint:'Cualquiera con este enlace puede ver tus Sprites — solo lectura.',
    share_img_alt:'Tu tarjeta de colección de Sprites',
    share_copy_btn:'Copiar', share_close_btn:'Cerrar', share_download_btn:'↓ Descargar imagen',
    share_ios_hint:'Mantén presionada la imagen y toca <strong>Guardar en Fotos</strong>',
    share_android_hint:'Mantén presionada la imagen y toca <strong>Guardar imagen</strong> — o toca <strong>↓ Descargar imagen</strong> abajo',
    confirm_title:'¿Borrar todos los datos?',
    confirm_body:'Esto elimina toda tu lista de Sprites e historial de este navegador. Exporta una copia de seguridad primero si quieres conservarlos.',
    confirm_cancel:'Cancelar', confirm_ok:'Borrar todo',
    search_placeholder:'Buscar Sprites…',
    filter_all_rarities:'Todas las rarezas', filter_all_variants:'Todas las variantes',
    sort_species:'Orden: Especie', sort_alpha:'Orden: A-Z', sort_rarity:'Orden: Rareza',
    sort_completion:'Orden: Menos completado',
    view_all:'Todos', view_owned:'Obtenidos', view_missing:'Faltantes',
    view_needs_mastery:'Por dominar', view_mastered:'Dominados',
    season_all:'Todas las temporadas', empty_no_match:'Ningún Sprite coincide con este filtro.',
    stat_collected:'Recolectados', stat_missing:'Faltantes',
    stat_mastered:'Dominados', stat_needs_mastery:'Por dominar',
    season_label_ch6s1:'Ch6 T1 · Sprites Despiertan',
    season_label_ch7s3:'Ch7 T3 · Corredores',
    season_label_ch7s4:'Ch7 T4 · Override',
    chip_mastered:'Dominado — toca para restablecer',
    chip_owned:'Obtenido — toca para marcar como Dominado',
    chip_unowned:'Toca para marcar como Obtenido',
    dashboard_progress:'Progreso en el tiempo', dashboard_rarity:'Por rareza',
    dashboard_variant:'Por variante', dashboard_species:'Por especie',
    dashboard_activity:'Actividad reciente',
    dashboard_activity_empty:'Aún no hay nada registrado — ve a la Lista para empezar.',
    timeline_empty:'Marca algunos Sprites para ver tu progreso aquí.',
    timeline_collected:'Recolectados', timeline_mastered:'Dominados',
    compare_you:'Tú', compare_collected:'Recolectados', compare_mastered:'Dominados',
    compare_share_qr:'▦ Compartir QR', compare_add_friend:'Agregar amigo',
    dot_mastered:'Dominado', dot_owned:'Obtenido', dot_missing:'Faltante',
    wiki_title:'Wiki de Sprites',
    wiki_subtitle:'Toca cualquier Sprite para ver su habilidad, temporada, ubicaciones y variantes. Solo lectura — usa la Lista para registrar tu colección.',
    wiki_season:'Temporada', wiki_ability:'Habilidad', wiki_drop_rate:'Tasa de aparición', wiki_locations:'Ubicaciones',
    wiki_species_count: (n) => `${n} especies`,
    wiki_card_variants: (n) => `${n} variantes`,
    wiki_variants_label: (n) => `Variantes (${n})`,
    wiki_ch6s1_label:'Capítulo 6 Temporada 1',
    wiki_ch7s3_label:'Capítulo 7 Temporada 3 — Corredores',
    wiki_ch7s4_label:'Capítulo 7 Temporada 4 — Override',
    story_headline:'Tu aventura con los Sprites continúa.',
    story_sub:'Cada temporada, nuevos compañeros aparecen. Sigue coleccionando.',
    story_cta:'Volver a tu colección →',
    share_qr_title:'Compartir tu código QR',
    share_qr_hint:'Pídele a un amigo que escanee esto para agregarte en Comparar.',
    share_qr_close:'Cerrar', share_qr_copy:'Copiar enlace',
    activity_mastered:'Dominado', activity_owned:'Obtenido', activity_reset:'Eliminado',
    time_just_now:'ahora mismo',
    time_s_ago: (s) => `hace ${s}s`,
    time_m_ago: (m) => `hace ${m}m`,
    time_h_ago: (h) => `hace ${h}h`,
    time_d_ago: (d) => `hace ${d}d`,
    toast_backup_downloaded:'Copia de seguridad descargada',
    toast_imported: (n) => `Se importaron ${n} eventos`,
    toast_cleared:'Borrado',
    toast_link_copied:'¡Enlace copiado!',
    toast_copy_failed:'Error al copiar',
    toast_copy_failed_manual:'Error al copiar — selecciónalo manualmente',
    toast_sync_code_copied:'Código de sincronización copiado',
    toast_connected:'Conectado — lista cargada desde el otro dispositivo',
    toast_friend_added: (name) => `¡${name} agregado!`,
    toast_qr_copy:'Enlace copiado — envíaselo a tu amigo',
    toast_username_set: (alias) => `Nombre guardado — tus amigos te encontrarán como “${alias}”`,
    toast_username_local: (err) => `Nombre guardado localmente. ${err}`,
    toast_display_name_cleared:'Nombre de pantalla eliminado',
    toast_no_sync_code:'Aún no tienes código — abre Sincronización primero',
    toast_share_no_code:'Abre Sincronización primero para obtener tu código',
    toast_qr_no_lib:'Librería QR no cargada — revisa la conexión.',
    toast_qr_loaded:'Código cargado desde QR — toca Conectar para vincular tu colección',
    btn_saving:'Guardando…', btn_connecting:'Conectando…', btn_adding:'Agregando…',
    tour_step1_title:'¡Bienvenido a Sprite Tracker!',
    tour_step1_body:'Tu lista personal de Sprites de Fortnite. Te mostramos las funciones principales — tarda unos 30 segundos.',
    tour_step2_title:'Toca para recolectar',
    tour_step2_body:'Toca un Sprite una vez para marcarlo como <strong>obtenido ✓</strong>, otra vez para <strong>dominado ★</strong>, y una vez más para quitar. El progreso se guarda al instante.',
    tour_step3_title:'Anillos de progreso',
    tour_step3_body:'Toca un anillo para filtrar la lista — ve directamente a los <em>Faltantes</em> o los que están <em>Por dominar</em>.',
    tour_step4_title:'Panel',
    tour_step4_body:'Ve tu progreso en el tiempo con gráficas, desglose por rareza y actividad reciente.',
    tour_step5_title:'Wiki de Sprites',
    tour_step5_body:'Toca cualquier tarjeta de Sprite para ver su entrada en el wiki — ubicaciones, historia y variantes disponibles.',
    tour_step6_title:'Comparar con amigos',
    tour_step6_body:'Toca <strong>Agregar amigo</strong> e ingresa su código para ver su colección junto a la tuya. Hasta 4 amigos a la vez.',
    tour_step7_title:'Tu código de sincronización',
    tour_step7_body:'Guarda este código para acceder a tu lista desde cualquier dispositivo — o compártelo para que un amigo te agregue en Comparar.',
    tour_step8_title:'Compartir tu colección',
    tour_step8_body:'Toca el ícono de compartir para obtener un enlace a tu colección y descargar una tarjeta 1080×1080 — perfecta para Instagram o donde quieras.',
    tour_skip:'Omitir guía', tour_next:'Siguiente →', tour_done:'¡Listo!',
  },
};

const LANG_KEY = 'sprite-tracker:lang';
let lang = localStorage.getItem(LANG_KEY) === 'es' ? 'es' : 'en';

function t(key, ...args) {
  const dict = STRINGS[lang] || STRINGS.en;
  const val = dict[key] ?? STRINGS.en[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}
window.t = t;

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
}

const checklistViewEl = el('checklistView');
const dashboardViewEl = el('dashboardView');
const compareViewEl   = el('compareView');
const wikiViewEl      = el('wikiView');
const storyViewEl     = el('storyView');
const viewSwitchEl = el('viewSwitch');
const exportBtn = el('exportBtn');
const importBtn = el('importBtn');
const importFile = el('importFile');
const resetBtn  = el('resetBtn');
const helpBtn   = el('helpBtn');
const toastEl = el('toast');
const confirmModal = el('confirmModal');
const confirmCancel = el('confirmCancel');
const confirmOk = el('confirmOk');
const langBtn = el('langBtn');

const ALL_SPRITES = SpritesData.CATALOG;
const CATALOG  = ALL_SPRITES.filter(s => !s.upcoming); // trackable sprites only
const UPCOMING = ALL_SPRITES.filter(s => s.upcoming);  // Ch7 S4 preview sprites
const TOTAL = CATALOG.length;
const RARITIES = ['rare', 'epic', 'legendary', 'mythic'];
const RARITY_LABELS = { rare: 'Rare', epic: 'Epic', legendary: 'Legendary', mythic: 'Mythic' };
const VARIANT_TYPES = ['Base', 'Gold', 'Gummy', 'Galaxy', 'Holofoil', 'Cube', 'Quack', 'Gem'];

const SEASON_LABELS = { ch6s1: 'Ch6 S1', ch7s3: 'Ch7 S3', ch7s4: 'Ch7 S4' };

const STORY_ERAS = [
  {
    id: 'ch1', chapter: 'Chapter 1', period: '2017 – 2019', tagline: 'The Island Awakens',
    bgTop: '#0c1a3e', bgBot: '#0a0e1a',
    image: 'images/story/ch1.jpg',
    beats: [
      { side: 'left',  text: 'A lone bus flies over an island. Ninety-nine players drop. One survives.' },
      { side: 'right', text: 'Kevin the Cube rolls across the map — it sings, teleports players, and reshapes the land around it.' },
      { side: 'left',  text: 'Season 10: A rocket launches. Reality cracks. The island is swallowed by a black hole. Fortnite goes dark for two days.' },
    ],
    sprites: [],
  },
  {
    id: 'ch2', chapter: 'Chapter 2', period: '2019 – 2021', tagline: 'A New Shore',
    bgTop: '#0d2233', bgBot: '#071620',
    image: 'images/story/ch2.jpg',
    beats: [
      { side: 'right', text: 'A brand new island rises from the ocean. Boats arrive. Fishing begins. The map breathes.' },
      { side: 'left',  text: 'The IO — Imagined Order — surfaces, drilling bunkers and controlling the loop from below.' },
      { side: 'right', text: 'Season 7: Aliens invade. The mothership abducts POIs mid-match. The island is never the same.' },
    ],
    sprites: [],
  },
  {
    id: 'ch3', chapter: 'Chapter 3', period: '2022', tagline: 'The Flip',
    bgTop: '#0a2214', bgBot: '#060e08',
    image: 'images/story/ch3.jpg',
    beats: [
      { side: 'left',  text: 'The island flips upside-down. First snowfall. Spider-Man web-shooters swing across the map.' },
      { side: 'right', text: 'Chrome spreads — a silvery blight consuming trees, buildings, and players. Reality Trees bloom.' },
      { side: 'left',  text: 'The Fracture: a live event shatters the island into fragments scattered across reality.' },
    ],
    sprites: [],
  },
  {
    id: 'ch4', chapter: 'Chapter 4', period: '2023', tagline: 'Mega City',
    bgTop: '#16082e', bgBot: '#0e051e',
    image: 'images/story/ch4.jpg',
    beats: [
      { side: 'right', text: 'A futuristic Mega City rises. Grind rails arc between towers. Hyper Sprint redefines movement.' },
      { side: 'left',  text: 'Crossovers peak: Geralt of Rivia, Eren Yeager, Peter Griffin, and TMNT all walk the same island.' },
      { side: 'right', text: 'The Big Bang — a live concert inside a black hole ends the chapter. A new island is born from the zero point.' },
    ],
    sprites: [],
  },
  {
    id: 'ch5', chapter: 'Chapter 5', period: '2024', tagline: 'Underground',
    bgTop: '#201408', bgBot: '#120a04',
    image: 'images/story/ch5.jpg',
    beats: [
      { side: 'left',  text: 'A secret society emerges. Underground vaults hold medallions granting boss-tier abilities.' },
      { side: 'right', text: 'Mount Olympus descends — gods walk the island. Peter Griffin defends the Fortnitemares with a shotgun.' },
      { side: 'left',  text: '"Absolute Doom" closes this arc. The island is destroyed and rebuilt once more.' },
    ],
    sprites: [],
  },
  {
    id: 'ch6s1', chapter: 'Chapter 6 · Season 1', period: 'Dec 2024', tagline: 'Sprites Awaken',
    bgTop: '#2a0810', bgBot: '#160404',
    image: 'images/story/ch6s1.jpg',
    beats: [
      { side: 'right', text: 'Oninoshima — a mystical Japanese-inspired island. Ancient shrines pulse with unknown energy.' },
      { side: 'left',  text: 'Sprites emerge: tiny magical companions bonded to players, each granting a unique battle ability.' },
      { side: 'right', text: 'Ten species discovered. The era of Sprite collecting begins.' },
    ],
    sprites: ['ch6s1'],
  },
  {
    id: 'ch7s3', chapter: 'Chapter 7 · Season 3', period: 'Jun 2026', tagline: 'Runners',
    bgTop: '#060f2a', bgBot: '#04091a',
    image: 'images/story/ch7s3.jpg',
    beats: [
      { side: 'left',  text: 'The Runners arrive — a new faction racing the neon-streaked island at impossible speeds.' },
      { side: 'right', text: 'Fifteen new Sprite species emerge, including Batman, John Wick, and Ironmouse.' },
      { side: 'left',  text: 'August 6: Gem variants debut — the rarest and most coveted Sprite type ever discovered.' },
    ],
    sprites: ['ch7s3'],
  },
  {
    id: 'ch7s4', chapter: 'Chapter 7 · Season 4', period: 'Aug 20, 2026', tagline: 'Override',
    bgTop: '#06160a', bgBot: '#040c06',
    beats: [
      { side: 'right', text: 'Override begins. The island rewrites itself — reality is no longer fixed.' },
      { side: 'left',  text: 'Sonic the Hedgehog leads a new wave of Sprite companions into the island.' },
      { side: 'right', text: 'Eight new species detected. Their full abilities remain classified.' },
    ],
    sprites: ['ch7s4'],
    upcoming: true,
  },
];

// Per-species wiki data: locations and lore notes.
const WIKI_INFO = {
  'Earth':         { locations: 'Forest shrines, chest-cluster areas, magical glades',      lore: 'One of the original Sprites from Chapter 6 Season 1.' },
  'Fire':          { locations: 'Volcanic zones, combat-heavy POIs, lava-adjacent areas',   lore: 'Original Ch6S1 Sprite — returns with new variant types each season.' },
  'Water':         { locations: 'Rivers, coastal shrines, lakesides',                       lore: 'Original Ch6S1 Sprite. Pairs well with squad play near water biomes.' },
  'Duck':          { locations: 'Pond biomes, lowland Sprite gardens',                      lore: 'Original Ch6S1 Sprite — the emote-powered shield refill is great in squads.' },
  'Ghost':         { locations: 'Shadow shrines, dark forest clearings',                    lore: 'Original Ch6S1 Sprite. The reload-cloak catches enemies completely off guard.' },
  'Demon':         { locations: 'Lava zones, boss lairs, contested POIs',                   lore: 'Original Ch6S1 Sprite. One of the strongest solo-play Sprites for siphon.' },
  'King':          { locations: 'Highland ruins, central named POIs',                       lore: 'Original Ch6S1 Sprite. Pickaxe buff is mostly novelty, but the numbers are wild.' },
  'Dream':         { locations: 'Magical glades, floating island POIs',                     lore: 'Original Ch6S1 Sprite — the loot-burst at max level can yield Mythic items.' },
  'Punk':          { locations: 'Urban zones, industrial POIs',                             lore: 'Original Ch6S1 Sprite. Infinite ammo proc feels overpowered when it triggers.' },
  'Air':           { locations: 'Mountain peaks, floating platforms, sky POIs',             lore: 'Added Ch7 S3 — the no-fall-damage effect alone makes it a high-value Sprite.' },
  'Fishy':         { locations: 'Waterways, fishing docks, coastal gardens',                lore: 'Added Ch7 S3. Swim-speed boost is niche but the damage-taken sprint is clutch.' },
  'Striker':       { locations: 'Mountain ridges, high-ground POIs',                       lore: 'Added Ch7 S3. Pairs well with aggressive high-ground play.' },
  'Aura':          { locations: 'Crystal caves, glowing shrines, mid-map areas',           lore: 'Added Ch7 S3. Generates Shock Rock charges passively through combat.' },
  'Boss':          { locations: 'Named POIs, boss-room spawn areas',                        lore: 'Added Ch7 S3. Pure stat boost — simple, effective, and easy to play around.' },
  'Seven':         { locations: 'Seven faction outposts, signal towers',                   lore: 'Added Ch7 S3. The Crossover — The Seven faction Sprite.' },
  'Peeky Peely':   { locations: 'Banana-grove biomes, Peely-themed POIs',                  lore: 'Added Ch7 S3. Tracks rare nearby Sprites at the cost of marking yourself.' },
  "Lootin' Llama": { locations: 'Llama-themed spawn points, ammo-box clusters',            lore: 'Added Ch7 S3. High-value on chaotic maps with lots of ammo boxes.' },
  'Zero Point':    { locations: 'Zero Point crater area, central map',                     lore: 'Added Ch7 S3. Circles near the Zero Point — rarest Mythic on the map.' },
  'Burnt Peanut':  { locations: 'Scattered loot zones, rare individual spawn',             lore: 'Added Ch7 S3. Unique Mythic with no variants — one-of-a-kind loot proc.' },
  'Grim':          { locations: 'Shadow shrines, dark biome POIs',                         lore: 'Added Ch7 S3. Instant mark on damage-taken is exceptional for information.' },
  'Batman':        { locations: 'Gotham-themed POI, rooftop gardens',                      lore: 'Added Ch7 S3 — Crossover with DC Batman. Bat Cape launch is cinematic.' },
  'Vini Jr.':      { locations: 'Stadium POI, sports-zone gardens',                        lore: 'Added Ch7 S3 — Crossover collab with Vini Jr.' },
  'Pollo':         { locations: 'Forest clearings, barnyard-adjacent areas',               lore: 'Added Ch7 S3 — Crossover collab. Squad shield regen is excellent.' },
  'John Wick':     { locations: 'Continental hotel POI, urban gardens',                    lore: 'Added Ch7 S3 — Crossover collab. Enemy reveal on knock is invaluable in squads.' },
  'Ironmouse':     { locations: 'Streamer-themed POI, hidden woodland gardens',            lore: 'Added Ch7 S3 — VTuber collab with Ironmouse. Low-grav cloak is a unique escape.' },
  'Adventure':     { locations: 'Loot drops, standard chests',                             lore: 'Added Ch7 S4 Override. Upgrades a random item each time it levels up.' },
  'Bush':          { locations: 'Wooded POIs, shrub-heavy areas',                          lore: 'Added Ch7 S4 Override. The bush mechanic on elimination is exceptional for ambushes.' },
  'Jonesy':        { locations: 'Named POIs, high-traffic areas',                          lore: 'Added Ch7 S4 Override. Classic Jonesy returns as a Sprite with a damage-recovery heal.' },
  'Shadow':        { locations: 'Dark POIs, urban zones',                                  lore: 'Added Ch7 S4 Override. Passive auto-reload pairs well with aggressive play styles.' },
  'Sonic':         { locations: 'Green Hill Zone POI, speed-run areas',                    lore: 'Added Ch7 S4 Override — Sega crossover. Sprint speed scales with each level up.' },
  'Tails':         { locations: 'Green Hill Zone POI, open areas',                         lore: 'Added Ch7 S4 Override — Sega crossover. Hover ability great for repositioning mid-fight.' },
  'Jackrabbit':    { locations: 'High-ground POIs, elevated terrain',                      lore: 'Added Ch7 S4 Override. Double-jump enables fast vertical escapes and creative plays.' },
  'Klombo':        { locations: 'Jungle biomes, open map areas',                           lore: 'Added Ch7 S4 Override — fan-favorite Klombo returns. Consumable-leveling is unique.' },
  '8-Bit':         { locations: 'Arcade-themed POI, chests across map',                    lore: 'Added Ch7 S4 Override. Guarantees an 8-Bit Shotgun from your first chest of the match.' },
  'Crown':         { locations: 'High-value POIs, Victory Royale zones',                   lore: 'Added Ch7 S4 Override. Only levels up by winning matches — a true champion\'s Sprite.' },
  'Killswitch':    { locations: 'Mountain ridges, high-ground zones',                      lore: 'Added Ch7 S4 Override. Hangtime accuracy is a major advantage in 50/50 fights.' },
  'Bullet':        { locations: 'Ammo box clusters, supply drops',                         lore: 'Added Ch7 S4 Override. Simple but reliable — great for aggressive spray-heavy builds.' },
  'Dumpster Dive': { locations: 'Urban zones, alley POIs',                                 lore: 'Added Ch7 S4 Override. Jump into any dumpster for bonus loot — unique foraging mechanic.' },
  'Honey':         { locations: 'Forest clearings, hive-adjacent POIs',                   lore: 'Added Ch7 S4 Override. Reactive defense — bees punish enemies who push you.' },
  'Pond':          { locations: 'Rivers, ponds, coastal areas',                            lore: 'Added Ch7 S4 Override. Swim speed at early levels; jump + fall immunity at max.' },
  'X-Ray':         { locations: 'Dense built-up POIs, close-quarters zones',               lore: 'Added Ch7 S4 Override. Wall-hack ability makes it one of the strongest info Sprites.' },
  'Storm Scout':   { locations: 'Storm edge, open field areas',                            lore: 'Added Ch7 S4 Override. Future circle reveal at max level is invaluable for late game.' },
};

let currentView = 'checklist';
let toastTimer = null;

// ---- Stat ring cards ----
const RING_R = 38;
const RING_CIRC = 2 * Math.PI * RING_R;

// Collected card toggles: owned ↔ missing
// Mastered card toggles:  mastered ↔ needsMastery
const CARD_TOGGLES = {
  collected: { a: 'owned',   b: 'missing' },
  mastered:  { a: 'mastered', b: 'needsMastery' },
};

function buildStatHeadline(ownedCount, masteredCount, seasonTotal, seasonLabel) {
  function ringCard(count, mod, labelA, labelB) {
    const activeView = filters.view;
    const toggle = CARD_TOGGLES[mod];
    const isInverted = activeView === toggle.b;
    const displayCount = isInverted ? (seasonTotal - count) : count;
    const displayLabel = isInverted ? labelB : labelA;
    const pct = displayCount / seasonTotal;
    const pctLabel = Math.round(pct * 100) + '%';
    const offset = (RING_CIRC * (1 - pct)).toFixed(2);

    const card = document.createElement('div');
    card.className = `stat-card stat-card--${mod}${isInverted ? ' stat-card--inverted' : ''}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="stat-ring-wrap">
        <svg class="stat-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="stat-ring-bg" cx="50" cy="50" r="${RING_R}"/>
          <circle class="stat-ring-fill stat-ring-fill--${mod}" cx="50" cy="50" r="${RING_R}"
            stroke-dasharray="${RING_CIRC.toFixed(2)}"
            stroke-dashoffset="${RING_CIRC.toFixed(2)}"
            data-target-offset="${offset}"/>
        </svg>
        <div class="stat-overlay">
          <span class="stat-num">${displayCount}</span>
          <span class="stat-denom">/${seasonTotal}</span>
          <span class="stat-pct">${pctLabel}</span>
        </div>
      </div>
      <div class="stat-card-label">${displayLabel}</div>
    `;

    function onToggle() {
      if (filters.view === toggle.b) {
        filters.view = 'all';
      } else {
        filters.view = toggle.b;
      }
      renderChecklist();
    }
    card.addEventListener('click', onToggle);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') onToggle(); });
    return card;
  }

  const headline = document.createElement('div');
  headline.className = 'sprite-headline';
  if (seasonLabel) {
    const lbl = document.createElement('p');
    lbl.className = 'sprite-headline-season';
    lbl.textContent = seasonLabel;
    headline.appendChild(lbl);
  }
  headline.appendChild(ringCard(ownedCount, 'collected', t('stat_collected'), t('stat_missing')));
  headline.appendChild(ringCard(masteredCount, 'mastered', t('stat_mastered'), t('stat_needs_mastery')));

  // Animate rings after they're in the DOM
  requestAnimationFrame(() => requestAnimationFrame(() => {
    headline.querySelectorAll('.stat-ring-fill[data-target-offset]').forEach(circle => {
      circle.style.strokeDashoffset = circle.dataset.targetOffset;
    });
  }));

  return headline;
}

// ---- Filters (checklist view) ----
const SEASON_FILTER_KEY = 'sprite-tracker:season-filter';
const VALID_SEASONS = new Set(['all', 'ch6s1', 'ch7s3', 'ch7s4']);
const storedSeason = localStorage.getItem(SEASON_FILTER_KEY);
let filters = {
  search: '',
  rarity: 'all',
  variant: 'all',
  view: 'all',    // all | owned | missing | needsMastery | mastered
  sort: 'species', // species | alpha | rarity | completion
  season: VALID_SEASONS.has(storedSeason) ? storedSeason : 'ch7s4',
};

function showToast(message, type = 'info') {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.className = `toast${type === 'error' ? ' error' : ''}`;
  toastEl.hidden = false;
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3200);
}

function confirmDialog(title, body) {
  el('confirmTitle').textContent = title;
  el('confirmBody').textContent = body;
  return new Promise((resolve) => {
    confirmModal.hidden = false;
    const cleanup = (result) => {
      confirmModal.hidden = true;
      confirmCancel.removeEventListener('click', onCancel);
      confirmOk.removeEventListener('click', onOk);
      resolve(result);
    };
    const onCancel = () => cleanup(false);
    const onOk = () => cleanup(true);
    confirmCancel.addEventListener('click', onCancel);
    confirmOk.addEventListener('click', onOk);
  });
}

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 5)  return t('time_just_now');
  if (sec < 60) return t('time_s_ago', sec);
  const min = Math.round(sec / 60);
  if (min < 60) return t('time_m_ago', min);
  const hr = Math.round(min / 60);
  if (hr < 24)  return t('time_h_ago', hr);
  const day = Math.round(hr / 24);
  if (day < 30) return t('time_d_ago', day);
  return new Date(iso).toLocaleDateString();
}

// ---- View switching ----
function switchView(view) {
  currentView = view;
  [...viewSwitchEl.children].forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  checklistViewEl.hidden = view !== 'checklist';
  dashboardViewEl.hidden = view !== 'dashboard';
  compareViewEl.hidden   = view !== 'compare';
  wikiViewEl.hidden      = view !== 'wiki';
  storyViewEl.hidden     = view !== 'story';
  render();
}

viewSwitchEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.view-switch-btn');
  if (!btn) return;
  switchView(btn.dataset.view);
});

// ---- Help / Tour ----
helpBtn.addEventListener('click', () => { if (window.startTour) window.startTour(); });

// ---- Export / Import / Reset ----
exportBtn.addEventListener('click', () => {
  const data = SpriteStore.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sprite-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(t('toast_backup_downloaded'));
});

importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  importFile.value = '';
  if (!file) return;
  const text = await file.text();
  const result = SpriteStore.importData(text);
  if (result.ok) {
    showToast(t('toast_imported', result.imported));
    render();
  } else {
    showToast(result.error, 'error');
  }
});

resetBtn.addEventListener('click', async () => {
  const ok = await confirmDialog(t('confirm_title'), t('confirm_body'));
  if (!ok) return;
  SpriteStore.clearAll();
  render();
  showToast(t('toast_cleared'));
});

// ================= Checklist view =================

function toggleSprite(spriteId) {
  SpriteStore.toggle(spriteId);
  render();
}

function renderChecklist() {
  checklistViewEl.innerHTML = '';
  const state = SpriteStore.getCurrentState();
  const isUpcoming = false;

  const wrap = document.createElement('div');
  wrap.className = 'sprite-wrap';

  const seasonPool    = filters.season === 'all' ? CATALOG : CATALOG.filter(s => s.season === filters.season);
  const ownedCount    = seasonPool.filter((s) => state[s.id]?.owned).length;
  const masteredCount = seasonPool.filter((s) => state[s.id]?.mastered).length;
  const SEASON_HEADLINE_LABELS = { ch6s1: t('season_label_ch6s1'), ch7s3: t('season_label_ch7s3'), ch7s4: t('season_label_ch7s4') };
  const seasonLabel   = filters.season !== 'all' ? SEASON_HEADLINE_LABELS[filters.season] : null;

  if (!isUpcoming) wrap.appendChild(buildStatHeadline(ownedCount, masteredCount, seasonPool.length, seasonLabel));

  // ---- Toolbar (hidden in upcoming view) ----
  if (!isUpcoming) {
    const toolbar = document.createElement('div');
    toolbar.className = 'sprite-toolbar';

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = t('search_placeholder');
    searchInput.value = filters.search;
    searchInput.className = 'sprite-search';
    searchInput.oninput = () => { filters.search = searchInput.value; renderChecklist(); };
    toolbar.appendChild(searchInput);

    toolbar.appendChild(makeSelect('sprite-filter-select', filters.rarity, [
      ['all', t('filter_all_rarities')], ...RARITIES.map((r) => [r, RARITY_LABELS[r]]),
    ], (v) => { filters.rarity = v; renderChecklist(); }));

    toolbar.appendChild(makeSelect('sprite-filter-select', filters.variant, [
      ['all', t('filter_all_variants')], ...VARIANT_TYPES.map((v) => [v, v]),
    ], (v) => { filters.variant = v; renderChecklist(); }));

    toolbar.appendChild(makeSelect('sprite-filter-select', filters.sort, [
      ['species', t('sort_species')], ['alpha', t('sort_alpha')], ['rarity', t('sort_rarity')], ['completion', t('sort_completion')],
    ], (v) => { filters.sort = v; renderChecklist(); }));

    const viewGroup = document.createElement('div');
    viewGroup.className = 'sprite-view-group';
    [['all', t('view_all')], ['owned', t('view_owned')], ['missing', t('view_missing')], ['needsMastery', t('view_needs_mastery')], ['mastered', t('view_mastered')]].forEach(([value, label]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sprite-view-btn' + (filters.view === value ? ' active' : '');
      btn.textContent = label;
      btn.onclick = () => { filters.view = value; renderChecklist(); };
      viewGroup.appendChild(btn);
    });
    toolbar.appendChild(viewGroup);
    wrap.appendChild(toolbar);
  }

  // ---- Season pills ----
  const seasonRow = document.createElement('div');
  seasonRow.className = 'season-pill-row';
  [
    ['all',   t('season_all')],
    ['ch6s1', 'Ch6 S1'],
    ['ch7s3', 'Ch7 S3'],
    ['ch7s4', 'Ch7 S4'],
  ].forEach(([value, label]) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'season-pill' + (filters.season === value ? ' active' : '');
    pill.textContent = label;
    pill.onclick = () => { filters.season = value; localStorage.setItem(SEASON_FILTER_KEY, value); renderChecklist(); };
    seasonRow.appendChild(pill);
  });
  wrap.appendChild(seasonRow);

  // ---- Build item list ----
  const pool = CATALOG;
  const q = filters.search.trim().toLowerCase();

  const filtered = pool.filter((sprite) => {
    if (isUpcoming) return !q || sprite.species.toLowerCase().includes(q);
    if (filters.season !== 'all' && sprite.season !== filters.season) return false;
    if (filters.rarity !== 'all' && sprite.rarity !== filters.rarity) return false;
    if (filters.variant !== 'all' && sprite.variant !== filters.variant) return false;
    if (q && !sprite.species.toLowerCase().includes(q)) return false;
    const s = state[sprite.id] || { owned: false, mastered: false };
    if (filters.view === 'owned' && !s.owned) return false;
    if (filters.view === 'missing' && s.owned) return false;
    if (filters.view === 'mastered' && !s.mastered) return false;
    if (filters.view === 'needsMastery' && !(s.owned && !s.mastered)) return false;
    return true;
  });

  // ---- Group by species, then sort groups ----
  const bySpecies = new Map();
  for (const sprite of filtered) {
    if (!bySpecies.has(sprite.species)) bySpecies.set(sprite.species, []);
    bySpecies.get(sprite.species).push(sprite);
  }

  let groups = [...bySpecies.entries()];
  const rarityRank = (r) => RARITIES.indexOf(r);
  const completionOf = (variants) => variants.filter((v) => state[v.id]?.owned).length / variants.length;

  if (!isUpcoming) {
    if (filters.sort === 'alpha') groups.sort((a, b) => a[0].localeCompare(b[0]));
    else if (filters.sort === 'rarity') groups.sort((a, b) => rarityRank(a[1][0].rarity) - rarityRank(b[1][0].rarity) || a[0].localeCompare(b[0]));
    else if (filters.sort === 'completion') groups.sort((a, b) => completionOf(a[1]) - completionOf(b[1]) || a[0].localeCompare(b[0]));
  }

  const list = document.createElement('div');
  list.className = 'sprite-species-list';

  if (!groups.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<div class="glyph">\u{1f50d}</div><div>${t('empty_no_match')}</div>`;
    list.appendChild(empty);
  }

  for (const [species, variants] of groups) {
    const rarity = variants[0].rarity;
    const speciesOwned = variants.filter((v) => state[v.id]?.owned).length;

    const group = document.createElement('div');
    group.className = `sprite-species rarity-${rarity}${isUpcoming ? ' sprite-species--upcoming' : ''}`;

    const header = document.createElement('div');
    header.className = 'sprite-species-header';
    header.innerHTML = isUpcoming
      ? `<span class="dot"></span><span class="sprite-species-name">${species}</span><span class="soon-badge">SOON</span>`
      : `<span class="dot"></span><span class="sprite-species-name">${species}</span><span class="sprite-species-count">${speciesOwned}/${variants.length}</span>`;
    group.appendChild(header);

    const ability = document.createElement('p');
    ability.className = 'sprite-species-ability';
    ability.textContent = variants[0].ability;
    group.appendChild(ability);

    const chips = document.createElement('div');
    chips.className = 'sprite-chip-row';
    variants.forEach((sprite) => {
      if (isUpcoming) {
        const chip = document.createElement('div');
        chip.className = 'sprite-chip sprite-chip--upcoming no-icon';
        const label = document.createElement('span');
        label.className = 'sprite-chip-label';
        label.textContent = sprite.variant;
        chip.appendChild(label);
        chips.appendChild(chip);
        return;
      }

      const s = state[sprite.id] || { owned: false, mastered: false };
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sprite-chip' + (s.mastered ? ' mastered' : s.owned ? ' owned' : '');
      chip.title = s.mastered ? t('chip_mastered') : s.owned ? t('chip_owned') : t('chip_unowned');

      if (sprite.icon) {
        const thumb = document.createElement('div');
        thumb.className = 'sprite-chip-thumb';
        const img = document.createElement('img');
        img.src = sprite.icon;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = () => { thumb.remove(); chip.classList.add('no-icon'); };
        thumb.appendChild(img);
        chip.appendChild(thumb);
      } else {
        chip.classList.add('no-icon');
      }

      const label = document.createElement('span');
      label.className = 'sprite-chip-label';
      label.textContent = `${s.mastered ? '★ ' : s.owned ? '✓ ' : ''}${sprite.variant}`;
      chip.appendChild(label);

      chip.onclick = () => toggleSprite(sprite.id);
      chips.appendChild(chip);
    });
    group.appendChild(chips);
    list.appendChild(group);
  }

  wrap.appendChild(list);
  checklistViewEl.appendChild(wrap);
}

function makeSelect(className, value, options, onChange) {
  const select = document.createElement('select');
  select.className = className;
  options.forEach(([v, label]) => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = label;
    if (v === value) opt.selected = true;
    select.appendChild(opt);
  });
  select.onchange = () => onChange(select.value);
  return select;
}

// ================= Dashboard view =================

function bar(label, completed, total, color) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const row = document.createElement('div');
  row.className = 'mastery-bar-row';
  const fillStyle = color ? `background:${color};box-shadow:0 0 8px ${color}55` : '';
  row.innerHTML = `
    <div class="mastery-bar-label">
      <span>${label}</span>
      <span class="mastery-bar-count">${completed}/${total} <span class="mastery-bar-pct">· ${pct}%</span></span>
    </div>
    <div class="mastery-bar-track"><div class="mastery-bar-fill" style="width:${pct}%;${fillStyle}"></div></div>
  `;
  return row;
}

function renderTimelineChart(points) {
  const wrap = document.createElement('div');
  wrap.className = 'timeline-chart';

  if (points.length < 2) {
    wrap.innerHTML = `<div class="empty-state small"><div class="glyph">\u{1f4c8}</div><div>${t('timeline_empty')}</div></div>`;
    return wrap;
  }

  const W = 640, H = 200, PAD = 28;
  const maxY = Math.max(...points.map((p) => p.owned), 1);
  const t0 = new Date(points[0].at).getTime();
  const t1 = new Date(points[points.length - 1].at).getTime();
  const span = Math.max(t1 - t0, 1);

  const x = (i) => PAD + ((new Date(points[i].at).getTime() - t0) / span) * (W - PAD * 2);
  const y = (v) => H - PAD - (v / maxY) * (H - PAD * 2);

  const ownedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.owned).toFixed(1)}`).join(' ');
  const masteredPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.mastered).toFixed(1)}`).join(' ');

  // Close paths down to baseline for area fill
  const xFirst = x(0).toFixed(1), xLast = x(points.length - 1).toFixed(1), yBase = (H - PAD).toFixed(1);
  const ownedFill    = `${ownedPath} L ${xLast} ${yBase} L ${xFirst} ${yBase} Z`;
  const masteredFill = `${masteredPath} L ${xLast} ${yBase} L ${xFirst} ${yBase} Z`;

  // Horizontal grid lines at 25 / 50 / 75% of maxY
  const gridLines = [0.25, 0.5, 0.75].map(pct => {
    const yPos = y(maxY * pct).toFixed(1);
    return `<line x1="${PAD}" y1="${yPos}" x2="${W - PAD}" y2="${yPos}" class="timeline-grid"/>`;
  }).join('');

  // Endpoint dots
  const last = points.length - 1;
  const ownedDot    = `<circle cx="${x(last).toFixed(1)}" cy="${y(points[last].owned).toFixed(1)}" r="4.5" class="timeline-dot timeline-dot-owned"/>`;
  const masteredDot = `<circle cx="${x(last).toFixed(1)}" cy="${y(points[last].mastered).toFixed(1)}" r="4.5" class="timeline-dot timeline-dot-mastered"/>`;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="timeline-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-owned" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#22d3ee" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="grad-mastered" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#ffd95a" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#ffd95a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" class="timeline-axis"/>
      <path d="${ownedFill}"    fill="url(#grad-owned)"    stroke="none"/>
      <path d="${masteredFill}" fill="url(#grad-mastered)" stroke="none"/>
      <path d="${ownedPath}"    class="timeline-line owned"    fill="none"/>
      <path d="${masteredPath}" class="timeline-line mastered" fill="none"/>
      ${ownedDot}${masteredDot}
    </svg>
    <div class="timeline-legend">
      <span><i class="swatch owned"></i>${t('timeline_collected')}</span>
      <span><i class="swatch mastered"></i>${t('timeline_mastered')}</span>
      <span class="timeline-range">${new Date(points[0].at).toLocaleDateString()} → ${new Date(points[points.length - 1].at).toLocaleDateString()}</span>
    </div>
  `;
  return wrap;
}

function renderDashboard() {
  dashboardViewEl.innerHTML = '';
  const state = SpriteStore.getCurrentState();
  const wrap = document.createElement('div');
  wrap.className = 'sprite-wrap dashboard-wrap';

  const ownedCount = CATALOG.filter((s) => state[s.id]?.owned).length;
  const masteredCount = CATALOG.filter((s) => state[s.id]?.mastered).length;

  wrap.appendChild(buildStatHeadline(ownedCount, masteredCount));

  // ---- Progress over time ----
  const section1 = document.createElement('section');
  section1.className = 'dashboard-section';
  section1.innerHTML = `<h2 class="dashboard-h2">${t('dashboard_progress')}</h2>`;
  section1.appendChild(renderTimelineChart(SpriteStore.getTimeline()));
  wrap.appendChild(section1);

  const grid2 = document.createElement('div');
  grid2.className = 'dashboard-grid';

  // ---- By rarity ----
  const RARITY_COLORS = { rare: '#4fa8ff', epic: '#c46bff', legendary: '#ff9f43', mythic: '#ffd95a' };
  const rarityCard = document.createElement('div');
  rarityCard.className = 'dashboard-card';
  rarityCard.innerHTML = `<h2 class="dashboard-h2">${t('dashboard_rarity')}</h2>`;
  RARITIES.forEach((r) => {
    const inRarity = CATALOG.filter((s) => s.rarity === r);
    rarityCard.appendChild(bar(RARITY_LABELS[r], inRarity.filter((s) => state[s.id]?.owned).length, inRarity.length, RARITY_COLORS[r]));
  });
  grid2.appendChild(rarityCard);

  // ---- By variant type ----
  const variantCard = document.createElement('div');
  variantCard.className = 'dashboard-card';
  variantCard.innerHTML = `<h2 class="dashboard-h2">${t('dashboard_variant')}</h2>`;
  VARIANT_TYPES.forEach((v) => {
    const inVariant = CATALOG.filter((s) => s.variant === v);
    if (!inVariant.length) return;
    variantCard.appendChild(bar(v, inVariant.filter((s) => state[s.id]?.owned).length, inVariant.length));
  });
  grid2.appendChild(variantCard);

  wrap.appendChild(grid2);

  // ---- Species leaderboard ----
  const speciesSection = document.createElement('section');
  speciesSection.className = 'dashboard-section';
  speciesSection.innerHTML = `<h2 class="dashboard-h2">${t('dashboard_species')}</h2>`;
  const bySpecies = new Map();
  for (const sprite of CATALOG) {
    if (!bySpecies.has(sprite.species)) bySpecies.set(sprite.species, []);
    bySpecies.get(sprite.species).push(sprite);
  }
  const speciesRows = [...bySpecies.entries()]
    .map(([species, variants]) => ({
      species,
      owned: variants.filter((v) => state[v.id]?.owned).length,
      total: variants.length,
    }))
    .sort((a, b) => (b.owned / b.total) - (a.owned / a.total) || a.species.localeCompare(b.species));
  const speciesList = document.createElement('div');
  speciesList.className = 'species-leaderboard';
  speciesRows.forEach((row) => speciesList.appendChild(bar(row.species, row.owned, row.total)));
  speciesSection.appendChild(speciesList);
  wrap.appendChild(speciesSection);

  // ---- Recent activity ----
  const activitySection = document.createElement('section');
  activitySection.className = 'dashboard-section';
  activitySection.innerHTML = `<h2 class="dashboard-h2">${t('dashboard_activity')}</h2>`;
  const activity = SpriteStore.getRecentActivity(15);
  if (!activity.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state small';
    empty.innerHTML = `<div class="glyph">\u{1f4cb}</div><div>${t('dashboard_activity_empty')}</div>`;
    activitySection.appendChild(empty);
  } else {
    const feed = document.createElement('div');
    feed.className = 'activity-feed';
    activity.forEach((ev) => {
      const sprite = CATALOG.find((s) => s.id === ev.id);
      const row = document.createElement('div');
      row.className = 'activity-row';
      row.innerHTML = `
        <span class="activity-label activity-${ev.mastered ? 'mastered' : ev.owned ? 'owned' : 'reset'}">${ev.mastered ? t('activity_mastered') : ev.owned ? t('activity_owned') : t('activity_reset')}</span>
        <span class="activity-name">${sprite ? `${sprite.variant} ${sprite.species}` : ev.id}</span>
        <span class="activity-time">${relativeTime(ev.at)}</span>
      `;
      feed.appendChild(row);
    });
    activitySection.appendChild(feed);
  }
  wrap.appendChild(activitySection);

  dashboardViewEl.appendChild(wrap);
}

// ================= Compare view =================

const FRIEND_COLORS = ['#22d3ee', '#ff9f43', '#ff5c7a', '#4ade80'];

function makePersonCard(name, owned, mastered, color, isYou, friendCode) {
  const card = document.createElement('div');
  card.className = 'person-card';
  card.style.setProperty('--person-color', color);

  const ownedPct  = Math.round(owned / TOTAL * 100);
  const mastPct   = Math.round(mastered / TOTAL * 100);
  const code      = isYou ? SpriteStore.getRecoveryCode() : friendCode;

  card.innerHTML = `
    <div class="person-name-row">
      <span class="person-name">${name}</span>
      ${isYou ? `<span class="person-you-badge">${t('compare_you')}</span>` : ''}
    </div>
    ${code ? `<div class="person-code">${code}</div>` : ''}
    <div class="person-stats">
      <div class="person-stat"><span class="person-stat-num">${owned}</span><span class="person-stat-den">/${TOTAL}</span><div class="person-stat-label">${t('compare_collected')}</div></div>
      <div class="person-stat"><span class="person-stat-num">${mastered}</span><span class="person-stat-den">/${TOTAL}</span><div class="person-stat-label">${t('compare_mastered')}</div></div>
    </div>
    <div class="person-bar-wrap">
      <div class="person-bar"><div class="person-bar-fill" style="width:${ownedPct}%;background:${color}"></div></div>
      <div class="person-bar"><div class="person-bar-fill" style="width:${mastPct}%;background:${color};opacity:0.6"></div></div>
    </div>
    ${isYou  ? `<button class="person-qr-btn" title="Show QR for friends to scan">${t('compare_share_qr')}</button>` : ''}
    ${!isYou ? `<button class="person-remove-btn" data-code="${friendCode}" title="Remove">✕</button>` : ''}
    ${!isYou ? `<button class="person-refresh-btn" data-code="${friendCode}" title="Refresh">↻</button>` : ''}
  `;
  return card;
}

function renderCompare() {
  compareViewEl.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'compare-wrap';

  const friends  = SpriteStore.getFriends();
  const myState  = SpriteStore.getCurrentState();
  const myOwned  = CATALOG.filter(s => myState[s.id]?.owned).length;
  const myMast   = CATALOG.filter(s => myState[s.id]?.mastered).length;

  const people = [
    { name: getUsername() || 'You', state: myState, color: 'var(--accent)' },
    ...friends.map((f, i) => ({ name: f.name, state: f.state || {}, color: FRIEND_COLORS[i], code: f.code, fetchedAt: f.fetchedAt })),
  ];

  // ---- People cards row ----
  const peopleRow = document.createElement('div');
  peopleRow.className = 'compare-people';
  peopleRow.appendChild(makePersonCard(people[0].name, myOwned, myMast, people[0].color, true, null));

  friends.forEach((f, i) => {
    const owned    = CATALOG.filter(s => f.state?.[s.id]?.owned).length;
    const mastered = CATALOG.filter(s => f.state?.[s.id]?.mastered).length;
    peopleRow.appendChild(makePersonCard(f.name, owned, mastered, FRIEND_COLORS[i], false, f.code));
  });

  if (friends.length < 4) {
    const addBtn = document.createElement('button');
    addBtn.className = 'compare-add-btn';
    addBtn.innerHTML = `<span>+</span>${t('compare_add_friend')}`;
    addBtn.addEventListener('click', () => { el('addFriendModal').hidden = false; el('friendCodeInput').focus(); });
    peopleRow.appendChild(addBtn);
  }

  wrap.appendChild(peopleRow);

  // Remove / refresh / QR friend handlers
  peopleRow.addEventListener('click', async (e) => {
    const removeBtn  = e.target.closest('.person-remove-btn');
    const refreshBtn = e.target.closest('.person-refresh-btn');
    const qrBtn      = e.target.closest('.person-qr-btn');
    if (removeBtn) {
      SpriteStore.removeFriend(removeBtn.dataset.code);
      renderCompare();
    }
    if (refreshBtn) {
      refreshBtn.textContent = '…';
      refreshBtn.disabled = true;
      const result = await SpriteStore.refreshFriend(refreshBtn.dataset.code);
      if (!result.ok) showToast(result.error, 'error');
      renderCompare();
    }
    if (qrBtn) openShareQRModal();
  });

  // ---- Legend ----
  const legend = document.createElement('div');
  legend.className = 'compare-legend';
  legend.innerHTML = people.map((p, i) => `
    <span class="compare-legend-item">
      <span class="compare-dot compare-dot--owned" style="background:${p.color}"></span>
      ${p.name}
    </span>
  `).join('');
  wrap.appendChild(legend);

  // ---- Sprite grid ----
  const speciesGroups = {};
  for (const s of CATALOG) {
    if (!speciesGroups[s.species]) speciesGroups[s.species] = { rarity: s.rarity, sprites: [] };
    speciesGroups[s.species].sprites.push(s);
  }

  const grid = document.createElement('div');
  grid.className = 'compare-grid';

  for (const [species, { rarity, sprites }] of Object.entries(speciesGroups)) {
    const group = document.createElement('div');
    group.className = `compare-species rarity-${rarity}`;

    const header = document.createElement('div');
    header.className = 'compare-species-header';
    const counts = people.map(p => sprites.filter(s => p.state[s.id]?.owned).length);
    header.innerHTML = `
      <span class="compare-species-name">${species}</span>
      <span class="compare-species-counts">${counts.map((c, i) => `<span style="color:${people[i].color}">${c}/${sprites.length}</span>`).join(' ')}</span>
    `;
    group.appendChild(header);

    const chipsRow = document.createElement('div');
    chipsRow.className = 'compare-chips';

    for (const sprite of sprites) {
      const chip = document.createElement('div');
      chip.className = 'compare-chip';

      if (sprite.icon) {
        const img = document.createElement('img');
        img.src = sprite.icon;
        img.alt = sprite.variant;
        img.className = 'compare-chip-img';
        chip.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = `compare-chip-ph rarity-bg-${rarity}`;
        chip.appendChild(ph);
      }

      const lbl = document.createElement('div');
      lbl.className = 'compare-chip-label';
      lbl.textContent = sprite.variant;
      chip.appendChild(lbl);

      const dots = document.createElement('div');
      dots.className = 'compare-dots';
      for (const p of people) {
        const s = p.state[sprite.id];
        const dot = document.createElement('span');
        dot.className = 'compare-dot' + (s?.mastered ? ' compare-dot--mastered' : s?.owned ? ' compare-dot--owned' : '');
        dot.style.setProperty('--dot-color', p.color);
        dot.title = `${p.name}: ${s?.mastered ? t('dot_mastered') : s?.owned ? t('dot_owned') : t('dot_missing')}`;
        dot.textContent = s?.mastered ? '★' : '';
        dots.appendChild(dot);
      }
      chip.appendChild(dots);
      chipsRow.appendChild(chip);
    }
    group.appendChild(chipsRow);
    grid.appendChild(group);
  }

  wrap.appendChild(grid);
  compareViewEl.appendChild(wrap);
}

// ================= Wiki view =================

function openWikiDetail(species) {
  const modal    = el('wikiDetailModal');
  const content  = el('wikiDetailContent');
  const closeBtn = el('wikiDetailClose');

  // All variants for this species (including upcoming)
  const allVariants = ALL_SPRITES.filter(s => s.species === species);
  if (!allVariants.length) return;

  const { rarity, ability, season, upcoming } = allVariants[0];
  const info = WIKI_INFO[species] || {};
  const baseSprite = allVariants.find(s => s.variant === 'Base') || allVariants[0];

  const rLabel  = RARITY_LABELS[rarity] || rarity;
  const sLabel  = SEASON_LABELS[season] || season;

  content.innerHTML = `
    <div class="wiki-detail-header">
      <span class="wiki-rarity-tag wiki-rarity-tag--${rarity}">${rLabel}</span>
      ${upcoming ? '<span class="soon-badge">SOON</span>' : ''}
    </div>
    <h3 class="wiki-detail-name">${species}</h3>
    ${baseSprite.icon ? `<div class="wiki-detail-img-wrap"><img src="${baseSprite.icon}" alt="${species} Base" class="wiki-detail-img" /></div>` : ''}
    <div class="wiki-detail-meta">
      <div class="wiki-meta-row"><span class="wiki-meta-key">${t('wiki_season')}</span><span class="wiki-meta-val">${sLabel}</span></div>
      <div class="wiki-meta-row"><span class="wiki-meta-key">${t('wiki_ability')}</span><span class="wiki-meta-val">${ability}</span></div>
      <div class="wiki-meta-row"><span class="wiki-meta-key">${t('wiki_drop_rate')}</span><span class="wiki-meta-val">—</span></div>
      <div class="wiki-meta-row"><span class="wiki-meta-key">${t('wiki_locations')}</span><span class="wiki-meta-val">${info.locations || '—'}</span></div>
      ${info.lore ? `<div class="wiki-lore">${info.lore}</div>` : ''}
    </div>
    <div class="wiki-detail-variants">
      <div class="wiki-variants-label">${t('wiki_variants_label', allVariants.length)}</div>
      <div class="wiki-variants-row">
        ${allVariants.map(s => `
          <div class="wiki-variant-chip">
            ${s.icon ? `<img src="${s.icon}" alt="${s.variant}" class="wiki-variant-img" />` : `<div class="wiki-variant-ph rarity-bg-${rarity}"></div>`}
            <span>${s.variant}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.hidden = false;

  const close = () => { modal.hidden = true; };
  closeBtn.onclick = close;
  modal.onclick = (e) => { if (e.target === modal) close(); };
}

function renderWiki() {
  wikiViewEl.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'sprite-wrap wiki-wrap';

  const heading = document.createElement('div');
  heading.className = 'wiki-heading';
  heading.innerHTML = `<h2 class="wiki-title">${t('wiki_title')}</h2><p class="wiki-subtitle">${t('wiki_subtitle')}</p>`;
  wrap.appendChild(heading);

  // Group by season, then by species within each season
  const seasons = [
    { key: 'ch6s1', label: t('wiki_ch6s1_label'), items: [] },
    { key: 'ch7s3', label: t('wiki_ch7s3_label'), items: [] },
    { key: 'ch7s4', label: t('wiki_ch7s4_label'), items: [], upcoming: false },
  ];

  // Build unique species list from ALL_SPRITES, preserving definition order
  const seenSpecies = new Set();
  for (const sprite of ALL_SPRITES) {
    if (sprite.variant !== 'Base') continue;
    if (seenSpecies.has(sprite.species)) continue;
    seenSpecies.add(sprite.species);
    const s = seasons.find(s => s.key === sprite.season);
    if (s) s.items.push(sprite);
  }

  for (const season of seasons) {
    if (!season.items.length) continue;

    const section = document.createElement('section');
    section.className = 'wiki-season-section';

    const sectionHeader = document.createElement('div');
    sectionHeader.className = `wiki-season-header${season.upcoming ? ' wiki-season-header--upcoming' : ''}`;
    sectionHeader.innerHTML = `<span class="wiki-season-title">${season.label}</span><span class="wiki-season-count">${t('wiki_species_count', season.items.length)}</span>`;
    section.appendChild(sectionHeader);

    const grid = document.createElement('div');
    grid.className = 'wiki-species-grid';

    for (const sprite of season.items) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `wiki-species-card rarity-border-${sprite.rarity}${season.upcoming ? ' wiki-species-card--upcoming' : ''}`;
      card.title = `View ${sprite.species} details`;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'wiki-card-img-wrap';
      if (sprite.icon) {
        const img = document.createElement('img');
        img.src = sprite.icon;
        img.alt = sprite.species;
        img.loading = 'lazy';
        img.className = 'wiki-card-img';
        img.onerror = () => imgWrap.classList.add('wiki-card-img-wrap--empty');
        imgWrap.appendChild(img);
      } else {
        imgWrap.classList.add('wiki-card-img-wrap--empty');
      }

      const info = document.createElement('div');
      info.className = 'wiki-card-info';
      const allVariantsCount = ALL_SPRITES.filter(s => s.species === sprite.species).length;
      info.innerHTML = `
        <div class="wiki-card-name">${sprite.species}</div>
        <div class="wiki-card-meta">
          <span class="wiki-rarity-tag wiki-rarity-tag--${sprite.rarity} wiki-rarity-tag--sm">${RARITY_LABELS[sprite.rarity]}</span>
          ${season.upcoming ? '<span class="soon-badge">SOON</span>' : `<span class="wiki-card-variants">${t('wiki_card_variants', allVariantsCount)}</span>`}
        </div>
      `;

      card.appendChild(imgWrap);
      card.appendChild(info);
      card.onclick = () => openWikiDetail(sprite.species);
      grid.appendChild(card);
    }

    section.appendChild(grid);
    wrap.appendChild(section);
  }

  wikiViewEl.appendChild(wrap);
}

// ================= Story view =================

function renderStory() {
  storyViewEl.innerHTML = '';

  // Progress dots — fixed to the right side of the viewport
  const progressNav = document.createElement('nav');
  progressNav.className = 'story-progress';
  progressNav.setAttribute('aria-label', 'Era navigation');
  STORY_ERAS.forEach((era) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'story-dot';
    dot.dataset.eraId = era.id;
    dot.title = `${era.chapter}: ${era.tagline}`;
    dot.onclick = () => {
      const target = storyViewEl.querySelector(`.story-era[data-era-id="${era.id}"]`);
      if (target) storyViewEl.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    };
    progressNav.appendChild(dot);
  });
  storyViewEl.appendChild(progressNav);

  // Era sections
  STORY_ERAS.forEach((era) => {
    const section = document.createElement('section');
    section.className = `story-era${era.upcoming ? ' story-era--upcoming' : ''}`;
    section.dataset.eraId = era.id;
    section.style.background = `linear-gradient(180deg, ${era.bgTop} 0%, ${era.bgBot} 100%)`;

    const header = document.createElement('div');
    header.className = 'story-era-header';
    header.innerHTML = `
      <span class="story-period-pill">${era.period}</span>
      <h2 class="story-chapter-label">${era.chapter}</h2>
      <p class="story-tagline">${era.tagline}</p>
    `;
    section.appendChild(header);

    if (era.image) {
      const panel = document.createElement('div');
      panel.className = 'story-keyart-panel';
      const img = document.createElement('img');
      img.src = era.image;
      img.alt = `${era.chapter} key art`;
      img.className = 'story-keyart-img';
      img.loading = 'lazy';
      panel.appendChild(img);
      section.appendChild(panel);
    }

    const beatsWrap = document.createElement('div');
    beatsWrap.className = 'story-beats';
    era.beats.forEach((beat) => {
      const card = document.createElement('div');
      card.className = `story-beat story-beat--${beat.side}`;
      card.innerHTML = `<p>${beat.text}</p>`;
      beatsWrap.appendChild(card);
    });
    section.appendChild(beatsWrap);

    if (era.sprites.length) {
      const inEra = ALL_SPRITES.filter((s) => s.variant === 'Base' && era.sprites.includes(s.season));
      if (inEra.length) {
        const spritesRow = document.createElement('div');
        spritesRow.className = 'story-sprites';
        inEra.forEach((sprite, i) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'story-sprite-wrapper';
          wrapper.style.setProperty('--i', i);

          if (sprite.icon) {
            const img = document.createElement('img');
            img.src = sprite.icon;
            img.alt = sprite.species;
            img.className = `story-sprite-img${era.upcoming ? ' story-sprite-img--upcoming' : ''}`;
            img.loading = 'lazy';
            if (!era.upcoming) {
              img.title = `${sprite.species} · tap for wiki`;
              img.onclick = () => { switchView('wiki'); setTimeout(() => openWikiDetail(sprite.species), 50); };
            }
            wrapper.appendChild(img);
          } else {
            const ph = document.createElement('div');
            ph.className = `story-sprite-placeholder story-sprite-placeholder--${sprite.rarity}${era.upcoming ? ' story-sprite-placeholder--upcoming' : ''}`;
            ph.textContent = sprite.species[0];
            wrapper.appendChild(ph);
          }

          const label = document.createElement('span');
          label.className = 'story-sprite-label';
          label.textContent = sprite.species;
          wrapper.appendChild(label);

          spritesRow.appendChild(wrapper);
        });
        section.appendChild(spritesRow);
      }
    }

    storyViewEl.appendChild(section);
  });

  // Outro
  const outro = document.createElement('div');
  outro.className = 'story-outro';
  outro.innerHTML = `
    <p class="story-outro-headline">${t('story_headline')}</p>
    <p class="story-outro-sub">${t('story_sub')}</p>
    <button type="button" class="btn-primary story-cta">${t('story_cta')}</button>
  `;
  outro.querySelector('.story-cta').onclick = () => switchView('checklist');
  storyViewEl.appendChild(outro);

  initStoryScroll();
}

function initStoryScroll() {
  const sections = [...storyViewEl.querySelectorAll('.story-era')];
  const dots     = [...storyViewEl.querySelectorAll('.story-dot')];

  // Beat card entrance
  const beatIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('story-beat--visible');
          beatIO.unobserve(entry.target);
        }
      });
    },
    { root: storyViewEl, threshold: 0.15 }
  );
  storyViewEl.querySelectorAll('.story-beat').forEach((el) => beatIO.observe(el));

  // Sprite float-in
  const spriteIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('story-sprite-wrapper--visible');
          spriteIO.unobserve(entry.target);
        }
      });
    },
    { root: storyViewEl, threshold: 0.1 }
  );
  storyViewEl.querySelectorAll('.story-sprite-wrapper').forEach((el) => spriteIO.observe(el));

  // Era tracking — updates progress dots
  const eraIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = STORY_ERAS.findIndex((e) => e.id === entry.target.dataset.eraId);
        dots.forEach((d, i) => d.classList.toggle('story-dot--active', i === idx));
      });
    },
    { root: storyViewEl, threshold: 0.4 }
  );
  sections.forEach((s) => eraIO.observe(s));

  if (dots[0]) dots[0].classList.add('story-dot--active');
}

// ---- Add friend modal ----
const addFriendModal      = el('addFriendModal');
const friendCodeInput     = el('friendCodeInput');
const friendNameInput     = el('friendNameInput');
const addFriendCancelBtn  = el('addFriendCancelBtn');
const addFriendConfirmBtn = el('addFriendConfirmBtn');

addFriendCancelBtn.addEventListener('click', () => { addFriendModal.hidden = true; });
addFriendModal.addEventListener('click', e => { if (e.target === addFriendModal) addFriendModal.hidden = true; });

addFriendConfirmBtn.addEventListener('click', async () => {
  const code = friendCodeInput.value.trim();
  const name = friendNameInput.value.trim();
  if (!code) return;
  addFriendConfirmBtn.disabled = true;
  addFriendConfirmBtn.textContent = t('btn_adding');
  const result = await SpriteStore.addFriend(code, name);
  addFriendConfirmBtn.disabled = false;
  addFriendConfirmBtn.textContent = t('friend_add_btn');
  if (result.ok) {
    addFriendModal.hidden = true;
    friendCodeInput.value = '';
    friendNameInput.value = '';
    renderCompare();
    showToast(t('toast_friend_added', name || code));
  } else {
    showToast(result.error, 'error');
  }
});

friendCodeInput.addEventListener('keydown', e => { if (e.key === 'Enter') addFriendConfirmBtn.click(); });

function render() {
  if (currentView === 'checklist') renderChecklist();
  else if (currentView === 'compare') renderCompare();
  else if (currentView === 'wiki') renderWiki();
  else if (currentView === 'story') renderStory();
  else renderDashboard();
}

function reRenderActiveView() {
  if (currentView === 'checklist') renderChecklist();
  else if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'compare') renderCompare();
  else if (currentView === 'wiki') renderWiki();
  else if (currentView === 'story') renderStory();
}

langBtn.addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  localStorage.setItem(LANG_KEY, lang);
  langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
  applyI18n();
  reRenderActiveView();
});

render();
applyI18n();
langBtn.textContent = lang === 'es' ? 'EN' : 'ES';

// ================= QR code helpers =================

function buildQRCode(container, text) {
  container.innerHTML = '';
  if (typeof QRCode === 'undefined') {
    container.innerHTML = `<p style="color:var(--muted);font-size:12px">${t('toast_qr_no_lib')}</p>`;
    return;
  }
  new QRCode(container, {
    text,
    width: 180,
    height: 180,
    colorDark: '#eef1f8',
    colorLight: '#131926',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function syncDeepLink(code) {
  return `${location.origin}${location.pathname}?connect=${encodeURIComponent(code)}`;
}

function openShareQRModal() {
  const code = SpriteStore.getRecoveryCode();
  if (!code) { showToast(t('toast_no_sync_code'), 'error'); return; }

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal share-qr-modal';
  modal.innerHTML = `
    <h3>${t('share_qr_title')}</h3>
    <p class="sync-hint">${t('share_qr_hint')}</p>
    <div class="share-qr-canvas-wrap" id="shareQrCanvas"></div>
    <div class="share-qr-code-label">${code}</div>
    <div class="modal-actions" style="margin-top:16px">
      <button class="btn-ghost share-qr-close-btn">${t('share_qr_close')}</button>
      <button class="btn-primary share-qr-copy-btn">${t('share_qr_copy')}</button>
    </div>
  `;
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  buildQRCode(document.getElementById('shareQrCanvas'), syncDeepLink(code));

  const close = () => backdrop.remove();
  modal.querySelector('.share-qr-close-btn').onclick = close;
  backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  modal.querySelector('.share-qr-copy-btn').onclick = () => {
    navigator.clipboard.writeText(syncDeepLink(code))
      .then(() => showToast(t('toast_qr_copy')))
      .catch(() => showToast(t('toast_copy_failed'), 'error'));
  };
}

// ================= Sync modal =================

const syncBtn         = el('syncBtn');
const syncCodeChip    = el('syncCodeChip');
const syncModal       = el('syncModal');
const syncCloseBtn    = el('syncCloseBtn');
const syncCodeDisplay = el('syncCodeDisplay');
const syncCopyBtn     = el('syncCopyBtn');
const syncCodeInput   = el('syncCodeInput');
const syncConnectBtn  = el('syncConnectBtn');
const usernameInput   = el('usernameInput');
const usernameSaveBtn = el('usernameSaveBtn');

const USERNAME_KEY = 'sprite-tracker:username';

function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || null;
}

function setUsername(name) {
  const trimmed = name.trim().slice(0, 32);
  if (trimmed) {
    localStorage.setItem(USERNAME_KEY, trimmed);
  } else {
    localStorage.removeItem(USERNAME_KEY);
  }
  return trimmed;
}

function updateHeaderChip() {
  const username = getUsername();
  const code = SpriteStore.getRecoveryCode();
  syncCodeChip.textContent = username || code || '···';
}

function updateCodeDisplays(code) {
  if (!code) return;
  syncCodeDisplay.textContent = code;
  updateHeaderChip();
}

function openSyncModal() {
  syncCodeDisplay.textContent = SpriteStore.getRecoveryCode() || t('sync_connecting');
  usernameInput.value = getUsername() || '';
  syncCodeInput.value = '';
  syncQrPanel.hidden = true;
  syncQrBtn.classList.remove('active');
  qrRendered = false;
  syncQrCanvas.innerHTML = '';
  syncModal.hidden = false;
}

usernameSaveBtn.addEventListener('click', async () => {
  const saved = setUsername(usernameInput.value);
  updateHeaderChip();
  if (saved) {
    usernameSaveBtn.disabled = true;
    usernameSaveBtn.textContent = t('btn_saving');
    const result = await SpriteStore.setAlias(saved);
    usernameSaveBtn.disabled = false;
    usernameSaveBtn.textContent = t('sync_save_btn');
    updateCodeDisplays(SpriteStore.getRecoveryCode());
    if (result.ok) {
      showToast(t('toast_username_set', result.alias));
    } else {
      showToast(t('toast_username_local', result.error), 'error');
    }
  } else {
    showToast(t('toast_display_name_cleared'));
  }
});

usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') usernameSaveBtn.click();
});

syncBtn.addEventListener('click', openSyncModal);
syncCloseBtn.addEventListener('click', () => { syncModal.hidden = true; });
syncModal.addEventListener('click', (e) => { if (e.target === syncModal) syncModal.hidden = true; });

syncCopyBtn.addEventListener('click', () => {
  const code = SpriteStore.getRecoveryCode();
  if (!code) return;
  navigator.clipboard.writeText(code)
    .then(() => showToast(t('toast_sync_code_copied')))
    .catch(() => showToast(t('toast_copy_failed_manual'), 'error'));
});

const syncQrBtn   = el('syncQrBtn');
const syncQrPanel = el('syncQrPanel');
const syncQrCanvas = el('syncQrCanvas');
let qrRendered = false;

syncQrBtn.addEventListener('click', () => {
  const code = SpriteStore.getRecoveryCode();
  if (!code) return;
  const open = syncQrPanel.hidden;
  syncQrPanel.hidden = !open;
  syncQrBtn.classList.toggle('active', open);
  if (open && !qrRendered) {
    buildQRCode(syncQrCanvas, syncDeepLink(code));
    qrRendered = true;
  }
});

syncConnectBtn.addEventListener('click', async () => {
  const code = syncCodeInput.value.trim();
  if (!code) return;
  syncConnectBtn.disabled = true;
  syncConnectBtn.textContent = t('btn_connecting');
  const result = await SpriteStore.connectDevice(code);
  syncConnectBtn.disabled = false;
  syncConnectBtn.textContent = t('sync_connect_btn');
  if (result.ok) {
    syncModal.hidden = true;
    updateCodeDisplays(SpriteStore.getRecoveryCode());
    render();
    showToast(t('toast_connected'));
  } else {
    showToast(result.error, 'error');
  }
});

// ---- Share modal & Canvas card ----

const shareBtn          = el('shareBtn');
const shareModal        = el('shareModal');
const shareCloseBtn     = el('shareCloseBtn');
const shareDownloadBtn  = el('shareDownloadBtn');
const shareLinkCopyBtn  = el('shareLinkCopyBtn');
const shareLinkText     = el('shareLinkText');
const shareCardCanvas   = el('shareCardCanvas');
const shareCardImg      = el('shareCardImg');
const shareDeviceHint   = el('shareDeviceHint');
const isIOS     = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

const RARITY_COLORS_HEX = { rare: '#4fa8ff', epic: '#c46bff', legendary: '#ff9f43', mythic: '#ffd95a' };

async function openShareModal() {
  const code = SpriteStore.getRecoveryCode();
  if (!code) { showToast(t('toast_share_no_code'), 'error'); return; }
  const link = `${location.origin}/share?code=${encodeURIComponent(code)}`;
  shareLinkText.textContent = link;
  shareModal.hidden = false;
  await drawShareCard(shareCardCanvas, code);

  if (isIOS || isAndroid) {
    // Canvas can't be long-pressed on mobile. Convert to <img> so the native
    // Save to Photos / Save image context menu appears on long-press.
    shareCardCanvas.hidden = true;
    shareCardImg.src = shareCardCanvas.toDataURL('image/png');
    shareCardImg.hidden = false;
    shareDeviceHint.innerHTML = isIOS
      ? t('share_ios_hint')
      : t('share_android_hint');
    shareDeviceHint.hidden = false;
  } else {
    shareCardCanvas.hidden = false;
    shareCardImg.hidden = true;
    shareDeviceHint.hidden = true;
  }
}

shareBtn.addEventListener('click', openShareModal);
shareCloseBtn.addEventListener('click', () => { shareModal.hidden = true; });
shareModal.addEventListener('click', (e) => { if (e.target === shareModal) shareModal.hidden = true; });

shareLinkCopyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shareLinkText.textContent)
    .then(() => showToast(t('toast_link_copied')))
    .catch(() => showToast(t('toast_copy_failed'), 'error'));
});

shareDownloadBtn.addEventListener('click', async () => {
  const code = SpriteStore.getRecoveryCode();
  const filename = `sprite-collection-${code || 'card'}.png`;

  // Reuse the already-drawn canvas (avoid re-rendering)
  const dataURL = shareCardCanvas.toDataURL('image/png');

  if (isIOS) {
    // iOS Safari ignores <a download>. Open image in a new tab so the user
    // can long-press → Save to Photos as a secondary path.
    const w = window.open();
    if (w) {
      w.document.write(`<img src="${dataURL}" style="max-width:100%;display:block;" />`);
      w.document.title = filename;
    }
    return;
  }

  // Android and desktop: standard anchor download
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = filename;
  a.click();
});

async function drawShareCard(canvas, code) {
  await document.fonts.ready;

  const W = 1080, H = 1080;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const state    = SpriteStore.getCurrentState();
  const owned    = CATALOG.filter(s => state[s.id]?.owned).length;
  const mastered = CATALOG.filter(s => state[s.id]?.mastered).length;
  const total    = CATALOG.length;
  const pct      = owned / total;
  const username = getUsername();

  // Background
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow
  const glow = ctx.createRadialGradient(W / 2, 380, 0, W / 2, 380, 600);
  glow.addColorStop(0, 'rgba(139,108,255,0.12)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Top gradient bar
  const topGrad = ctx.createLinearGradient(0, 0, W, 0);
  topGrad.addColorStop(0, '#8b6cff');
  topGrad.addColorStop(1, '#22d3ee');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 8);

  // Brand
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8b6cff';
  ctx.font = '700 44px "Space Grotesk"';
  ctx.fillText('◆', 80, 112);
  ctx.fillStyle = '#eef1f8';
  ctx.font = '600 40px "Space Grotesk"';
  ctx.fillText('SPRITE TRACKER', 136, 112);

  // Username / code
  const displayName = username || code || '';
  if (displayName) {
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '500 24px Inter';
    ctx.fillText(displayName, 80, 152);
  }

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 180); ctx.lineTo(W - 80, 180); ctx.stroke();

  // Big fraction
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eef1f8';
  ctx.font = '700 220px "Space Grotesk"';
  const ownedStr  = String(owned);
  const totalStr  = String(total);
  ctx.fillText(ownedStr, W / 2 - 90, 440);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '300 140px "Space Grotesk"';
  ctx.fillText('/', W / 2 + 40, 420);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '600 100px "Space Grotesk"';
  ctx.fillText(totalStr, W / 2 + 180, 390);

  // Subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '500 34px Inter';
  ctx.fillText(`sprites collected  ·  ${mastered} mastered ★`, W / 2, 498);

  // Progress bar
  const BX = 80, BY = 540, BW = W - 160, BH = 14;
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  roundRectPath(ctx, BX, BY, BW, BH, 7); ctx.fill();
  if (pct > 0) {
    const fillGrad = ctx.createLinearGradient(BX, 0, BX + BW, 0);
    fillGrad.addColorStop(0, '#8b6cff');
    fillGrad.addColorStop(1, '#22d3ee');
    ctx.fillStyle = fillGrad;
    roundRectPath(ctx, BX, BY, BW * pct, BH, 7); ctx.fill();
  }
  // Pct label
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '500 22px Inter';
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(pct * 100)}%`, W - 80, BY - 10);
  ctx.textAlign = 'left';

  // Rarity pills
  const pillW = (BW - 24) / 4;
  const pillY = 590;
  RARITIES.forEach((r, i) => {
    const x = BX + i * (pillW + 8);
    const sprites = CATALOG.filter(s => s.rarity === r);
    const cnt = sprites.filter(s => state[s.id]?.owned).length;
    const color = RARITY_COLORS_HEX[r];

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRectPath(ctx, x, pillY, pillW, 88, 10); ctx.fill();
    ctx.fillStyle = color;
    roundRectPath(ctx, x, pillY, 4, 88, 2); ctx.fill();

    ctx.fillStyle = color;
    ctx.font = '700 18px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(RARITY_LABELS[r].toUpperCase(), x + 16, pillY + 30);

    ctx.fillStyle = '#eef1f8';
    ctx.font = '700 34px "Space Grotesk"';
    ctx.fillText(`${cnt}/${sprites.length}`, x + 16, pillY + 70);
  });

  // Mastered sprite strip (up to 9, centered)
  const masteredSprites = CATALOG.filter(s => state[s.id]?.mastered && s.icon).slice(0, 9);
  if (masteredSprites.length) {
    const SIZE = 84, GAP = 14;
    const stripW = masteredSprites.length * (SIZE + GAP) - GAP;
    let sx = (W - stripW) / 2;
    const sy = 724;
    for (const sprite of masteredSprites) {
      const imgEl = document.querySelector(`img[src="${sprite.icon}"]`);
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath(); ctx.arc(sx + SIZE/2, sy + SIZE/2, SIZE/2 + 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx + SIZE/2, sy + SIZE/2, SIZE/2, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(imgEl, sx, sy, SIZE, SIZE);
        ctx.restore();
      }
      sx += SIZE + GAP;
    }
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '500 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('★  mastered', W / 2, sy + SIZE + 26);
  }

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = '500 24px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(location.host, W / 2, H - 44);

  // Bottom gradient bar
  const botGrad = ctx.createLinearGradient(0, 0, W, 0);
  botGrad.addColorStop(0, '#8b6cff');
  botGrad.addColorStop(1, '#22d3ee');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, H - 8, W, 8);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Show code/username immediately if we already have it (returning visitor), then sync.
updateHeaderChip();
updateCodeDisplays(SpriteStore.getRecoveryCode());
SpriteStore.init().then(({ changed }) => {
  if (changed) render();
  updateCodeDisplays(SpriteStore.getRecoveryCode());
});

// ---- Version-check banner ----
(function initVersionCheck() {
  const SNOOZE_KEY = 'sprite-tracker:update-snoozed-until';
  const POLL_MS    = 30 * 60 * 1000; // 30 min
  const SNOOZE_MS  =  2 * 60 * 60 * 1000; // 2 hr
  let knownEtag    = null;
  let banner       = null;

  async function getEtag() {
    try {
      const res = await fetch('/', { method: 'HEAD', cache: 'no-store' });
      return res.headers.get('etag') || res.headers.get('last-modified');
    } catch { return null; }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'update-banner';
    banner.innerHTML = `
      <span class="update-banner-text">◆ Update available</span>
      <button class="update-banner-btn update-banner-refresh">Refresh now</button>
      <button class="update-banner-btn update-banner-later">Later</button>
    `;
    banner.querySelector('.update-banner-refresh').onclick = () => location.reload();
    banner.querySelector('.update-banner-later').onclick = () => {
      localStorage.setItem(SNOOZE_KEY, Date.now() + SNOOZE_MS);
      banner.remove(); banner = null;
    };
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner?.classList.add('update-banner--visible'));
  }

  async function check() {
    if (document.visibilityState !== 'visible') return;
    const snoozedUntil = Number(localStorage.getItem(SNOOZE_KEY) || 0);
    if (Date.now() < snoozedUntil) return;
    const etag = await getEtag();
    if (!etag) return;
    if (knownEtag === null) { knownEtag = etag; return; }
    if (etag !== knownEtag) showBanner();
  }

  check();
  setInterval(check, POLL_MS);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
})();

// Handle ?connect=<code> deep-link (generated by QR codes). Opens the sync
// modal pre-filled so the user confirms before their data is replaced.
(function handleConnectParam() {
  const params = new URLSearchParams(location.search);
  const code = params.get('connect');
  if (!code) return;
  // Clean the URL so a refresh doesn't re-trigger this
  history.replaceState(null, '', location.pathname);
  // Give the app a moment to init, then open the modal pre-filled
  setTimeout(() => {
    openSyncModal();
    syncCodeInput.value = code.trim();
    syncCodeInput.focus();
    showToast(t('toast_qr_loaded'));
  }, 600);
})();
