/* Слой данных. По умолчанию работает на локальных демо-данных (js/data.js).
   Если в js/config.js задан apiBase, те же запросы уходят на бэкенд (папка backend/). */

const Api = (() => {
  const cfg = window.APP_CONFIG || {};
  let failNext = false;

  const DAY = 86400000;
  const toDate = (s) => new Date(s + "T00:00:00");
  const nightsBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY);

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }
  const isBase = (p) => p.from === DEMO.baseRange.from && p.to === DEMO.baseRange.to;

  function seatsFor(city, p) {
    if (isBase(p)) return city.seatsBase;
    return 2 + (hash(city.id + p.from + p.to) % 8); // 2..9 мест на другие даты
  }
  function priceFactor(city, p) {
    if (isBase(p)) return 1;
    return 0.9 + (hash(p.from + city.id + p.to) % 23) / 100;
  }
  const round100 = (x) => Math.round(x / 100) * 100;

  function addTime(hhmm, [h, m], tz) {
    const [H, M] = hhmm.split(":").map(Number);
    let total = H * 60 + M + h * 60 + m + tz * 60;
    const plus = total >= 1440 ? 1 : 0;
    total %= 1440;
    return { time: String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0"), plus };
  }
  const durLabel = ([h, m]) => `${h} ч ${String(m).padStart(2, "0")} мин`;

  function flightsFor(city, p) {
    const seats = seatsFor(city, p), f = priceFactor(city, p);
    return city.flights.map((fl, i) => {
      const there = addTime(fl.dep, fl.dur, city.tz);
      const back = addTime(fl.backDep, fl.backDur, -city.tz);
      const perPerson = round100(fl.price * f);
      return {
        id: city.id + "-f" + (i + 1), seats, perPerson, total: perPerson * p.adults,
        out: { date: p.from, dep: fl.dep, depAp: fl.from, arr: there.time, arrPlus: there.plus, arrAp: city.airport, dur: durLabel(fl.dur) },
        ret: { date: p.to, dep: fl.backDep, depAp: city.airport, arr: back.time, arrPlus: back.plus, arrAp: fl.from, dur: durLabel(fl.backDur) },
      };
    });
  }

  function staysFor(city, p) {
    const nights = nightsBetween(p.from, p.to), f = priceFactor(city, p);
    return city.stays.map((s, i) => {
      const units = s.type === "hotel" ? Math.ceil(p.adults / 2) : Math.ceil(p.adults / 4);
      const total = round100(s.rate * nights * units * f);
      return { ...s, id: city.id + "-s" + (i + 1), nights, units, total, old: round100(total * 1.06) };
    });
  }

  function cityCard(city, p) {
    const flights = flightsFor(city, p);
    return { id: city.id, name: city.name, country: city.country, cover: city.cover, seats: flights[0].seats, from: Math.min(...flights.map((x) => x.total)) };
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function remote(path, p) {
    const q = new URLSearchParams({ from: p.from, to: p.to, adults: p.adults });
    const res = await fetch(cfg.apiBase.replace(/\/$/, "") + path + "?" + q);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  return {
    nightsBetween,
    simulateErrorOnce() { failNext = true; },

    /* Подборка: города, где на даты есть прямой рейс с местами для всей группы */
    async searchNoZagran(p) {
      if (failNext) { failNext = false; await wait(700); throw new Error("network"); }
      if (cfg.apiBase) return remote("/api/no-zagran/search", p);
      await wait(650);
      return DEMO.cities.filter((c) => seatsFor(c, p) >= p.adults).map((c) => cityCard(c, p));
    },
    /* Ближайшие даты той же длины, когда места есть на всю группу хотя бы в одном городе */
    suggestDates(p) {
      const nights = nightsBetween(p.from, p.to), out = [];
      const shift = (s, k) => { const x = toDate(s); x.setDate(x.getDate() + k); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
      for (const k of [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]) {
        const from = shift(p.from, k), to = shift(from, nights);
        if (from <= DEMO.today) continue;
        const q = { from, to, adults: p.adults };
        const count = DEMO.cities.filter((c) => seatsFor(c, q) >= p.adults).length;
        if (count) out.push({ from, to, count });
        if (out.length === 2) break;
      }
      return out.sort((a, b) => (a.from < b.from ? -1 : 1));
    },
    getCity(id) { return DEMO.cities.find((c) => c.id === id); },
    async getFlights(id, p) {
      if (cfg.apiBase) return remote(`/api/no-zagran/cities/${id}/flights`, p);
      return flightsFor(this.getCity(id), p);
    },
    async getStays(id, p) {
      if (cfg.apiBase) return remote(`/api/no-zagran/cities/${id}/stays`, p);
      return staysFor(this.getCity(id), p);
    },
    flightsSync(id, p) { return flightsFor(this.getCity(id), p); },
    staysSync(id, p) { return staysFor(this.getCity(id), p); },
  };
})();
