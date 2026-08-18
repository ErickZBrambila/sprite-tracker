const getDb = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const sql = getDb();

  const [[totals], [activity]] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*) FROM devices)                            AS total_devices,
        (SELECT COUNT(DISTINCT device_id) FROM events)           AS active_devices,
        (SELECT COUNT(*) FROM devices WHERE alias IS NOT NULL)   AS named_users,
        (SELECT COUNT(*) FROM events)                            AS total_events,
        (SELECT COUNT(*) FROM devices
           WHERE created_at > to_char(NOW() - INTERVAL '7 days', 'YYYY-MM-DD'))  AS new_7d,
        (SELECT COUNT(*) FROM devices
           WHERE created_at > to_char(NOW() - INTERVAL '30 days', 'YYYY-MM-DD')) AS new_30d
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE at > to_char(NOW() - INTERVAL '1 day',  'YYYY-MM-DD'))  AS events_24h,
        COUNT(*) FILTER (WHERE at > to_char(NOW() - INTERVAL '7 days', 'YYYY-MM-DD'))  AS events_7d
      FROM events
    `,
  ]);

  const topSprites = await sql`
    SELECT sprite_id, COUNT(*) AS toggles
    FROM events WHERE owned = true
    GROUP BY sprite_id ORDER BY toggles DESC LIMIT 10
  `;

  res.setHeader('Cache-Control', 'public, s-maxage=60');
  res.json({
    devices: {
      total:   Number(totals.total_devices),
      active:  Number(totals.active_devices),
      named:   Number(totals.named_users),
      new_7d:  Number(totals.new_7d),
      new_30d: Number(totals.new_30d),
    },
    events: {
      total:    Number(totals.total_events),
      last_24h: Number(activity.events_24h),
      last_7d:  Number(activity.events_7d),
    },
    top_sprites: topSprites.map(r => ({ id: r.sprite_id, toggles: Number(r.toggles) })),
  });
};
