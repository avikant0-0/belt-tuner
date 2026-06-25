export const targets = [
  {
    id: "prusa-core-one",
    name: "Prusa CORE One / CORE One+ / CORE One L — XY belts",
    lo: 85,
    hi: 95,
    confidence: "official",
    source: "https://help.prusa3d.com/",
    notes: "Target applies to both upper and lower belts. Ensure gantry is square first."
  },
  {
    id: "markforged-mark-two-front",
    name: "Markforged Mark Two — Front belt",
    lo: 46,
    hi: 49,
    confidence: "official",
    source: "https://support.markforged.com/",
    notes: "Desktop series. Access maintenance utility on touchscreen to position."
  },
  {
    id: "markforged-mark-two-rear",
    name: "Markforged Mark Two — Rear belt",
    lo: 46,
    hi: 49,
    confidence: "official",
    source: "https://support.markforged.com/",
    notes: "Desktop series. Access maintenance utility on touchscreen to position."
  },
  {
    id: "markforged-metal-x",
    name: "Markforged Metal X",
    lo: 82,
    hi: 85,
    confidence: "official",
    source: "https://support.markforged.com/",
    notes: "Industrial series."
  },
  {
    id: "prusa-mk3-x",
    name: "Prusa MK3 / MK3S — X axis",
    lo: 60,
    hi: 90,
    confidence: "community",
    source: "https://forum.prusa3d.com/",
    notes: "Prusa officially recommends the LCD Belt Status (target ~250±15), not Hz. This Hz range is community-measured."
  },
  {
    id: "prusa-mk3-y",
    name: "Prusa MK3 / MK3S — Y axis",
    lo: 60,
    hi: 90,
    confidence: "community",
    source: "https://forum.prusa3d.com/",
    notes: "Prusa officially recommends the LCD Belt Status (target ~275±15), not Hz. This Hz range is community-measured."
  },
  {
    id: "voron-24-a",
    name: "Voron 2.4 — A belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "voron-24-b",
    name: "Voron 2.4 — B belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "voron-trident-a",
    name: "Voron Trident — A belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "voron-trident-b",
    name: "Voron Trident — B belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "ender-3",
    name: "Ender 3 / 3 V2 / Pro / S1",
    lo: null,
    hi: null,
    confidence: "none",
    source: "",
    notes: "Creality does not publish official Hz targets. Adjust until prints are dimensionally accurate without ringing."
  },
  {
    id: "cr-10",
    name: "CR-10 series",
    lo: null,
    hi: null,
    confidence: "none",
    source: "",
    notes: "Creality does not publish official Hz targets."
  },
  {
    id: "ender-5",
    name: "Ender 5 series",
    lo: null,
    hi: null,
    confidence: "none",
    source: "",
    notes: "Creality does not publish official Hz targets."
  },
  {
    id: "bambu-a1-p1-x1",
    name: "Bambu A1 / P1 / X1",
    lo: null,
    hi: null,
    confidence: "none",
    source: "",
    notes: "Bambu Lab uses an automated belt tensioning procedure, no Hz target provided."
  },
  {
    id: "creality-k1",
    name: "Creality K1 / K1C — A/B belts",
    lo: 110,
    hi: 125,
    confidence: "community",
    source: "https://www.reddit.com/r/crealityk1/",
    notes: "Move X-axis so belt section between X-axis pulley and front idler is 150mm before plucking."
  },
  {
    id: "voron-v0-a",
    name: "Voron V0 — A belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "voron-v0-b",
    name: "Voron V0 — B belt",
    lo: 105,
    hi: 115,
    confidence: "community",
    source: "https://docs.vorondesign.com/",
    notes: "Move X extrusion so X/Y idler centers are 150mm from front idler centers before plucking."
  },
  {
    id: "prusa-mini",
    name: "Prusa MINI / MINI+",
    lo: null,
    hi: null,
    confidence: "none",
    source: "https://help.prusa3d.com/article/adjusting-belt-tension-mini-mini_205663",
    notes: "Prusa explicitly recommends using the printed Tension Meter rather than audio frequency."
  }
];
