/* Прототип «Без заграна» для Яндекс Путешествий. Одностраничное приложение без зависимостей. */
(() => {
  "use strict";

  /* ---------- Утилиты ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const MONTHS_FULL = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const WD = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const d = (s) => new Date(s + "T00:00:00");
  const iso = (dt) => dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };
  const rub = (n) => n.toLocaleString("ru-RU").replace(/[\s\u00a0\u202f]/g, "\u00a0") + "\u00a0₽";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function rangeLabel(from, to) {
    if (!from) return "";
    const a = d(from); if (!to) return a.getDate() + " " + MONTHS_SHORT[a.getMonth()];
    const b = d(to);
    return a.getMonth() === b.getMonth() ? `${a.getDate()} – ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}` : `${a.getDate()} ${MONTHS_SHORT[a.getMonth()]} – ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}`;
  }
  const rangeLong = (from, to) => { const a = d(from), b = d(to); return `${a.getDate()} ${MONTHS_SHORT[a.getMonth()]} — ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}`; };
  const dayLabel = (s) => { const x = d(s); return `${WD[x.getDay()]}, ${x.getDate()} ${MONTHS_SHORT[x.getMonth()]}`; };
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Иконки ---------- */
  const I = {
    close: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    back: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>',
    bed: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5V9h-1.2a2 2 0 0 0-1.9-1.4h-2.2A2 2 0 0 0 12 9a2 2 0 0 0-1.7-1.4H8.1A2 2 0 0 0 6.2 9H5zM3 12.5A2.5 2.5 0 0 1 5.5 10h13a2.5 2.5 0 0 1 2.5 2.5V20h-2.6v-2H5.6v2H3z"/></svg>',
    plane: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M21.4 3.2c.9.9.4 2.6-.7 3.7l-3.4 3.4 2 8.6c.1.4 0 .8-.3 1.1l-1 1c-.4.4-1.1.3-1.4-.2l-3.6-6.9-3.2 3.2.4 2.6c.1.3 0 .7-.3.9l-.7.7c-.4.4-1.1.3-1.3-.2l-1.6-3.1-3.1-1.6c-.5-.3-.6-.9-.2-1.3l.7-.7c.2-.3.6-.4.9-.3l2.6.4 3.2-3.2-6.9-3.6c-.5-.3-.6-1-.2-1.4l1-1c.3-.3.7-.4 1.1-.3l8.6 2 3.4-3.4c1.1-1.1 2.8-1.6 3.7-.7z"/></svg>',
    train: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-2.2 2.9L19.5 21h-2.3l-1.4-3H8.2l-1.4 3H4.5l1.7-3.1A3 3 0 0 1 4 15V5a3 3 0 0 1 3-3zm-.5 3.5v4h11v-4zm1.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
    party: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M3.2 20.8 8 8.6l7.4 7.4zM12.5 3.2c.6.9.6 2.2 0 3.1l-1.2-.8c.3-.5.3-1.1 0-1.5zM20.8 11.5l-.8-1.2c.4-.3 1-.3 1.5 0l-.8 1.2zM17.6 2.9l1.3.6-1.7 3.6-1.3-.6zM21.1 6.4l.6 1.3-3.6 1.7-.6-1.3z"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="19.5" cy="13.8" r="1.1" fill="currentColor"/><circle cx="9.8" cy="3.5" r="1.1" fill="currentColor"/></svg>',
    passport: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M6.5 2h10A2.5 2.5 0 0 1 19 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2zm5 4.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm-1.3 1.6c-.3.6-.5 1.4-.6 2.2H8.3a3 3 0 0 1 1.9-2.2zm2.6 0a3 3 0 0 1 1.9 2.2h-1.3c-.1-.8-.3-1.6-.6-2.2zM11.5 7.6c.3.4.6 1.3.7 2.4h-1.4c.1-1.1.4-2 .7-2.4zM8.3 11h1.3c.1.8.3 1.6.6 2.2A3 3 0 0 1 8.3 11zm2.5 0h1.4c-.1 1.1-.4 2-.7 2.4-.3-.4-.6-1.3-.7-2.4zm2.6 0h1.3a3 3 0 0 1-1.9 2.2c.3-.6.5-1.4.6-2.2zM8 17.2h7v1.6H8z"/></svg>',
    cal: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    person: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/></svg>',
    chev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>',
    chevL: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
    info: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5" stroke-linecap="round"/></svg>',
    check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    heart: '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.5s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 8.8 6c1.4 0 2.5.7 3.2 1.7.7-1 1.8-1.7 3.2-1.7a4.3 4.3 0 0 1 4.3 4.3c0 5.8-7.5 10.2-7.5 10.2z" opacity=".9"/></svg>',
    share: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M8 10.5H6.5A1.5 1.5 0 0 0 5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5H16"/></svg>',
    seat: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 4v9a3 3 0 0 0 3 3h7M7 20h10M17 16v4"/></svg>',
    cloud: '<svg width="34" height="26" viewBox="0 0 34 26"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dfe3ea"/></linearGradient></defs><circle cx="25" cy="8" r="6" fill="#ffc83d"/><path d="M9 24a7 7 0 0 1-.6-14A9 9 0 0 1 25.7 13 5.5 5.5 0 0 1 25 24z" fill="url(#cg)" stroke="#e3e6ec"/></svg>',
    snow: '<svg width="34" height="28" viewBox="0 0 34 28"><path d="M9 18a7 7 0 0 1-.6-14A9 9 0 0 1 25.7 7 5.5 5.5 0 0 1 25 18z" fill="#eef1f6" stroke="#e1e5eb"/><g fill="#8fc3f0"><circle cx="11" cy="23" r="2"/><circle cx="18" cy="25" r="2"/><circle cx="25" cy="23" r="2"/></g></svg>',
  };
  const TABS = [
    { id: "stay", label: "Жильё", icon: I.bed },
    { id: "avia", label: "Авиа", icon: I.plane },
    { id: "train", label: "Поезда", icon: I.train },
    { id: "weekend", label: "Выходные", icon: I.party },
    { id: "bz", label: "Без заграна", icon: I.passport },
  ];

  /* ---------- Состояние (сохраняется на время сессии) ---------- */
  const KEY = "bz-proto-state-v1";
  const fresh = () => ({
    bz: { ...DEMO.defaults },
    stay: { kind: "any", city: "Казань", from: "2026-12-12", to: "2026-12-14", guests: 2 },
    avia: { fromCity: "Москва", toCity: "Сочи", from: "2026-12-18", to: "2026-12-22", pax: 1 },
    train: { fromCity: "Москва", toCity: "Санкт-Петербург", from: "2026-12-05", pax: 1 },
    weekend: { city: "", from: "2026-11-28", to: "2026-11-29", adults: 2 },
    lastTab: "stay",
  });
  let S = fresh();
  try { const raw = sessionStorage.getItem(KEY); if (raw) S = { ...S, ...JSON.parse(raw) }; } catch (e) { /* хранилище недоступно */ }
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ---------- Аналитика (демо): события пишутся в консоль и в панель ---------- */
  const EVENTS = [];
  function track(name, props = {}) {
    EVENTS.push({ t: new Date(), name, props });
    console.info("[analytics]", name, props);
    renderEvents();
  }
  function evLine(e) {
    const tm = e.t.toTimeString().slice(0, 8);
    const pr = Object.entries(e.props).map(([k, v]) => `${k}=${v}`).join(" ");
    return `<li><time>${tm}</time><b>${esc(e.name)}</b>${pr ? `<span>${esc(pr)}</span>` : ""}</li>`;
  }
  function renderEvents() {
    const box = document.getElementById("events");
    if (box) box.innerHTML = EVENTS.length ? EVENTS.slice(-9).reverse().map(evLine).join("") : '<li class="empty">Пройдите сценарий в прототипе, события появятся здесь</li>';
    const sheetList = document.getElementById("eventsSheet");
    if (sheetList) sheetList.innerHTML = EVENTS.slice().reverse().map(evLine).join("") || '<li class="empty">Пока нет событий</li>';
  }

  /* ---------- Навигация ---------- */
  const screen = $("#screen");
  const statusbar = $("#statusbar");
  let current = null, idx = 0, cleanup = null;

  function parse(hash) {
    const raw = (hash || "").replace(/^#\/?/, "");
    const [path, qs] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    return { path, parts, query: new URLSearchParams(qs || "") };
  }
  /* Параметры из ссылки, которой поделились: #/bz/evn?from=2026-12-07&to=2026-12-11&n=3 */
  function applySharedParams(q) {
    const from = q.get("from"), to = q.get("to"), n = Number(q.get("n"));
    const ok = /^\d{4}-\d{2}-\d{2}$/;
    if (from && to && ok.test(from) && ok.test(to) && from < to && n >= 1 && n <= DEMO.maxAdults) {
      S.bz = { from, to, adults: n }; save(); return true;
    }
    return false;
  }
  const shareUrl = (path) => location.origin + location.pathname + "#/" + path + `?from=${S.bz.from}&to=${S.bz.to}&n=${S.bz.adults}`;
  function go(path, opts = {}) {
    idx += 1;
    const method = opts.replace ? "replaceState" : "pushState";
    if (opts.replace) idx -= 1;
    history[method]({ i: idx }, "", "#/" + path);
    render(path, opts.dir || "fwd");
  }
  function parentOf(path) {
    const p = path.split("/");
    if (p[0] === "bz" && p.length > 1) return p.slice(0, -1).join("/");
    if (p[0] === "bz") return "search/bz";
    if (p[0] === "results") return "search/" + p[1];
    return "";
  }
  function back() {
    if (history.state && history.state.i > 0) history.back();
    else { const par = parentOf(parse(location.hash).path); history.replaceState({ i: 0 }, "", "#/" + par); render(par, "back"); }
  }
  window.addEventListener("popstate", (e) => {
    const i = (e.state && e.state.i) || 0;
    const dir = i < idx ? "back" : "fwd";
    idx = i;
    render(location.hash.replace(/^#\/?/, ""), dir);
  });

  function render(path, dir) {
    closeSheet(true);
    const parsed = parse("#/" + path);
    if (parsed.parts[0] === "bz" && applySharedParams(parsed.query)) {
      history.replaceState(history.state, "", "#/" + parsed.path);
      track("shared_link_open", { path: parsed.path });
    }
    path = parsed.path;
    const { parts } = parsed;
    let view;
    if (!parts.length) view = Home();
    else if (parts[0] === "search") view = Search(parts[1] || S.lastTab);
    else if (parts[0] === "results") view = OtherResults(parts[1]);
    else if (parts[0] === "bz" && parts.length === 1) view = BzResults();
    else if (parts[0] === "bz" && parts[2] === "flights") view = Flights(parts[1]);
    else if (parts[0] === "bz" && parts[2] === "stays") view = Stays(parts[1]);
    else if (parts[0] === "bz") view = City(parts[1]);
    else view = Home();
    mount(view, dir);
  }

  function mount(view, dir) {
    const page = document.createElement("section");
    page.className = "page" + (view.white ? " white" : "");
    page.innerHTML = view.html;
    const old = current;
    if (cleanup) { cleanup(); cleanup = null; }
    statusbar && statusbar.classList.toggle("light", !!view.lightStatus);
    if (!old || dir === "none") {
      if (old) old.remove();
      screen.appendChild(page);
    } else {
      const fwd = dir !== "back";
      page.classList.add(fwd ? "enter-fwd" : "enter-back");
      if (fwd) { screen.appendChild(page); page.classList.add("shadow"); }
      else { screen.insertBefore(page, old); old.classList.add("shadow"); }
      page.getBoundingClientRect();
      page.classList.add("anim"); old.classList.add("anim");
      requestAnimationFrame(() => {
        page.classList.remove("enter-fwd", "enter-back");
        old.classList.add(fwd ? "exit-fwd" : "exit-back");
      });
      const done = () => { old.remove(); page.classList.remove("anim", "shadow"); };
      setTimeout(done, reduced() ? 260 : 520);
    }
    current = page;
    if (view.mount) cleanup = view.mount(page) || null;
  }

  /* ---------- Делегирование событий ---------- */
  screen.addEventListener("click", (e) => {
    const t = e.target.closest("[data-go],[data-act]");
    if (!t || !screen.contains(t)) return;
    if (t.dataset.go !== undefined) { go(t.dataset.go); return; }
    const fn = ACTIONS[t.dataset.act];
    if (fn) fn(t, e);
  });
  document.addEventListener("touchstart", () => {}, { passive: true }); // включает :active в iOS Safari

  const ACTIONS = {
    back: () => back(),
    home: () => go("", { dir: "back" }),
    credits: () => openCredits(),
    toast: (t) => toast(t.dataset.msg),
    reset: () => { if (T.on) stopTour(); try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } S = fresh(); history.replaceState({ i: 0 }, "", "#/"); idx = 0; render("", "none"); toast("Демо сброшено к исходным параметрам"); },
  };

  /* ---------- Главная ---------- */
  function Home() {
    const tiles = [
      ["stay-hotels", "tile-hotels.png", "Отели"], ["stay-flats", "tile-apartments.png", "Квартиры и дома"],
      ["avia", "tile-avia.png", "Авиа"], ["train", "tile-trains.png", "Поезда"],
      ["weekend", "tile-weekend.png", "Выходные"], ["bz", "tile-nozagran.svg", "Без заграна", true],
    ];
    return {
      html: `
      <div class="page-scroll">
        <div class="hero">
          <img src="assets/img/hero-autumn.jpg" alt="Осенние скидки, выгода до 35%" width="900" height="1097">
          <button class="hero-search" data-act="openSearch" aria-label="Найти жильё или билет"></button>
        </div>
        <div class="home-body">
          <nav class="tiles" aria-label="Разделы">
            ${tiles.map(([id, img, label, isNew]) => `
              <button class="tile press" data-act="tile" data-tile="${id}">
                <img src="assets/img/${img}" alt="" width="56" height="56">
                ${isNew ? '<em class="new">new</em>' : ""}
                <span>${label}</span>
              </button>`).join("")}
          </nav>
          <div class="row-head" style="margin-top:34px"><h2 class="h2">Продолжить поиск</h2></div>
          <button class="continue press" data-act="tile" data-tile="avia">
            <span class="icon-box">${I.plane}</span>
            <span><b>Москва — Сочи</b><span class="meta"><span>${I.cal} 18 дек</span><span>${I.person} 1</span></span></span>
          </button>
          <div class="row-head"><h2 class="h2">Недавно смотрели</h2><span class="all">Все</span></div>
          <div class="hscroll">
            <div class="recent"><div class="ph"><img src="${WM(PHOTO.flat3, 640)}" alt="" loading="lazy"><span class="heart">${I.heart}</span></div><b>Апарт-отель «Кремлёвский»</b><small>Казань · 4,8</small></div>
            <div class="recent"><div class="ph"><img src="${WM(PHOTO.hotel2, 640)}" alt="" loading="lazy"><span class="heart">${I.heart}</span></div><b>Гостиница «Волжская»</b><small>Казань · 4,7</small></div>
          </div>
          <p class="demo-note">Концепт для продуктового кейса, не официальный сервис. Цены, рейсы и наличие мест демонстрационные. <button data-act="tour">Смотреть сценарий</button> · <button data-act="events">События аналитики</button> · <button data-act="credits">Фото: Wikimedia Commons</button></p>
        </div>
      </div>`,
      lightStatus: false,
      mount() { track("tile_impression", { tile: "no_zagran", place: "home" }); },
    };
  }
  ACTIONS.openSearch = () => go("search/" + S.lastTab);
  ACTIONS.tile = (t) => {
    const id = t.dataset.tile;
    if (id === "stay-hotels") { S.stay.kind = "hotels"; save(); go("search/stay"); }
    else if (id === "stay-flats") { S.stay.kind = "flats"; save(); go("search/stay"); }
    else { if (id === "bz") track("entry_click", { entry: "home_tile" }); go("search/" + id); }
  };

  /* ---------- Экран поиска с круглыми вкладками ---------- */
  function Search(tab) {
    if (!TABS.some((x) => x.id === tab)) tab = "stay";
    S.lastTab = tab; save();
    return {
      html: `
      <div class="search-top">
        <div class="top-row"><button class="icon-btn press" data-act="home" aria-label="Закрыть">${I.close}</button></div>
        <div class="tabs" role="tablist">
          ${TABS.map((x) => `<button class="tab" role="tab" data-act="tab" data-tab="${x.id}" aria-selected="${x.id === tab}"><span class="tab-label">${x.label}</span><span class="tab-circle">${x.icon}</span></button>`).join("")}
        </div>
      </div>
      <div class="page-scroll"><div class="form" id="form">${formHtml(tab)}</div></div>
      <div class="bottom-bar" id="bbar">${barHtml(tab)}</div>`,
    };
  }
  ACTIONS.tab = (t) => {
    const tab = t.dataset.tab;
    if (tab === "bz" && S.lastTab !== "bz") track("entry_click", { entry: "search_tab" });
    S.lastTab = tab; save();
    history.replaceState(history.state, "", "#/search/" + tab);
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    const f = $("#form"); f.innerHTML = formHtml(tab); f.classList.remove("swap"); void f.offsetWidth; f.classList.add("swap");
    $("#bbar").innerHTML = barHtml(tab);
  };

  const rowBtn = (act, label, val, empty) => `<button class="row press" data-act="${act}"><span>${label}</span><span class="val${empty ? " empty" : ""}">${esc(val)}</span></button>`;

  function formHtml(tab) {
    if (tab === "bz") {
      const b = S.bz;
      return `
        <div class="card">
          <h2 class="h2">Куда без заграна?</h2>
          <p class="lead">Покажем зарубежные города, куда всю компанию пустят по внутреннему паспорту РФ, и рейсы туда и обратно без пересадок за границей.</p>
        </div>
        ${rowBtn("pickBzDates", "Когда", rangeLabel(b.from, b.to))}
        ${rowBtn("pickBzPeople", "Участники", b.adults + " чел")}
        <div class="hint">${I.info}<span>Детям до 14 лет для выезда нужен загранпаспорт, поэтому считаем участников от 14 лет.</span></div>`;
    }
    if (tab === "stay") {
      const s = S.stay;
      const chip = (k, l) => `<button class="chip press" data-act="stayKind" data-kind="${k}" aria-pressed="${s.kind === k}">${l}</button>`;
      return `
        <div class="card">
          <h2 class="h2">Где будете жить?</h2>
          <div class="chips">${chip("any", "Всё равно")}${chip("hotels", "Отели")}${chip("flats", "Квартиры")}</div>
          <input class="field" data-bind="stay.city" placeholder="Город или название" value="${esc(s.city)}">
        </div>
        ${rowBtn("pickStayDates", "Когда", s.from ? rangeLabel(s.from, s.to) : "Заезд — выезд", !s.from)}
        ${rowBtn("pickStayGuests", "Гости", s.guests + " " + plural(s.guests, "гость", "гостя", "гостей"))}`;
    }
    if (tab === "avia") {
      const s = S.avia;
      return `
        <div class="card">
          <h2 class="h2">Куда полетим?</h2>
          <input class="field" data-bind="avia.fromCity" placeholder="Откуда" value="${esc(s.fromCity)}">
          <input class="field" data-bind="avia.toCity" placeholder="Куда" value="${esc(s.toCity)}">
        </div>
        ${rowBtn("pickAviaDates", "Когда", rangeLabel(s.from, s.to))}
        ${rowBtn("pickAviaPax", "Пассажиры", s.pax + " " + plural(s.pax, "пассажир", "пассажира", "пассажиров"))}`;
    }
    if (tab === "train") {
      const s = S.train;
      return `
        <div class="card">
          <h2 class="h2">Куда поедем?</h2>
          <input class="field" data-bind="train.fromCity" placeholder="Откуда" value="${esc(s.fromCity)}">
          <input class="field" data-bind="train.toCity" placeholder="Куда" value="${esc(s.toCity)}">
        </div>
        ${rowBtn("pickTrainDate", "Когда", rangeLabel(s.from))}
        ${rowBtn("pickTrainPax", "Пассажиры", s.pax + " " + plural(s.pax, "пассажир", "пассажира", "пассажиров"))}`;
    }
    const s = S.weekend;
    return `
      <div class="card">
        <h2 class="h2">В какой город?</h2>
        <input class="field" data-bind="weekend.city" placeholder="Куда угодно" value="${esc(s.city)}">
      </div>
      ${rowBtn("pickWeekendDates", "Когда", rangeLabel(s.from, s.to))}
      ${rowBtn("pickWeekendPeople", "Участники", s.adults + " чел")}`;
  }
  function barHtml(tab) {
    if (tab === "bz" || tab === "weekend") return `<button class="btn btn-white" data-act="reset-${tab}">Сбросить</button><button class="btn btn-yellow" data-act="find" data-tab="${tab}">Найти</button>`;
    return `<button class="btn btn-yellow" data-act="find" data-tab="${tab}">Найти</button>`;
  }
  screen.addEventListener("input", (e) => {
    const k = e.target.dataset && e.target.dataset.bind;
    if (!k) return;
    const [a, b] = k.split("."); S[a][b] = e.target.value; save();
  });
  const refreshForm = () => { const f = $("#form"); if (f) f.innerHTML = formHtml(S.lastTab); };

  ACTIONS.stayKind = (t) => { S.stay.kind = t.dataset.kind; save(); refreshForm(); };
  ACTIONS["reset-bz"] = () => { S.bz = { ...DEMO.defaults }; save(); refreshForm(); toast("Вернули 7–11 декабря и 3 участников"); };
  ACTIONS["reset-weekend"] = () => { S.weekend = fresh().weekend; save(); refreshForm(); };
  ACTIONS.find = (t) => {
    const tab = t.dataset.tab;
    if (tab === "bz") { track("search_submit", { from: S.bz.from, to: S.bz.to, adults: S.bz.adults }); go("bz"); }
    else go("results/" + tab);
  };

  ACTIONS.pickBzDates = () => openCalendar({ mode: "range", from: S.bz.from, to: S.bz.to, title: "Когда" }, (a, b) => { S.bz.from = a; S.bz.to = b; save(); refreshForm(); });
  ACTIONS.pickBzPeople = () => openCounter({ title: "Участники", label: "Взрослые и подростки", sub: "От 14 лет", value: S.bz.adults, min: 1, max: DEMO.maxAdults, hint: "Детям до 14 лет для выезда за границу нужен загранпаспорт" }, (v) => { S.bz.adults = v; save(); refreshForm(); });
  ACTIONS.pickStayDates = () => openCalendar({ mode: "range", from: S.stay.from, to: S.stay.to, title: "Заезд и выезд" }, (a, b) => { S.stay.from = a; S.stay.to = b; save(); refreshForm(); });
  ACTIONS.pickStayGuests = () => openCounter({ title: "Гости", label: "Взрослые", sub: "", value: S.stay.guests, min: 1, max: 10 }, (v) => { S.stay.guests = v; save(); refreshForm(); });
  ACTIONS.pickAviaDates = () => openCalendar({ mode: "range", from: S.avia.from, to: S.avia.to, title: "Туда и обратно" }, (a, b) => { S.avia.from = a; S.avia.to = b; save(); refreshForm(); });
  ACTIONS.pickAviaPax = () => openCounter({ title: "Пассажиры", label: "Взрослые", sub: "", value: S.avia.pax, min: 1, max: 9 }, (v) => { S.avia.pax = v; save(); refreshForm(); });
  ACTIONS.pickTrainDate = () => openCalendar({ mode: "single", from: S.train.from, title: "Дата поездки" }, (a) => { S.train.from = a; save(); refreshForm(); });
  ACTIONS.pickTrainPax = () => openCounter({ title: "Пассажиры", label: "Взрослые", sub: "", value: S.train.pax, min: 1, max: 9 }, (v) => { S.train.pax = v; save(); refreshForm(); });
  ACTIONS.pickWeekendDates = () => openCalendar({ mode: "range", from: S.weekend.from, to: S.weekend.to, title: "Когда" }, (a, b) => { S.weekend.from = a; S.weekend.to = b; save(); refreshForm(); });
  ACTIONS.pickWeekendPeople = () => openCounter({ title: "Участники", label: "Взрослые", sub: "", value: S.weekend.adults, min: 1, max: 10 }, (v) => { S.weekend.adults = v; save(); refreshForm(); });

  /* ---------- Выдача «Без заграна» ---------- */
  const bzPill = () => `
    <button class="pill press" data-act="back" aria-label="Изменить параметры">
      <b>Без заграна</b>
      <span class="meta"><span>${I.cal} ${rangeLabel(S.bz.from, S.bz.to)}</span><span>${I.person} ${S.bz.adults}</span></span>
    </button>`;

  function BzResults() {
    return {
      white: true,
      html: `
        <div class="res-head"><button class="icon-btn press" data-act="back" aria-label="Назад">${I.back}</button>${bzPill()}<button class="icon-btn press" data-act="share" aria-label="Отправить друзьям">${I.share}</button></div>
        <div class="page-scroll" style="background:#fff">
          <div class="res-sub">Только по внутреннему паспорту РФ, без пересадок за границей</div>
          <div class="res-list" id="bzlist">${[0, 1].map(() => '<div class="skel"></div>').join("")}</div>
          <div class="res-foot">Цены и наличие мест демонстрационные · <button data-act="simError">Демо: ошибка сети</button></div>
        </div>`,
      mount(page) { loadBz(page); },
    };
  }
  async function loadBz(page) {
    const list = $("#bzlist", page);
    const p = { ...S.bz };
    try {
      const items = await Api.searchNoZagran(p);
      if (!page.isConnected) return;
      if (!items.length) {
        const sug = Api.suggestDates(p);
        track("empty_shown", { adults: p.adults, suggestions: sug.length });
        list.innerHTML = `
          <div class="state">
            <img src="assets/img/tile-nozagran.svg" alt="">
            <h3 class="h3">На выбранные даты не нашли подходящих перелётов</h3>
            <p>На ${rangeLabel(p.from, p.to)} нет рейсов с местами для ${p.adults} ${plural(p.adults, "человека", "человек", "человек")}.${sug.length ? "" : " Попробуйте другие даты или уменьшите число участников."}</p>
            ${sug.length ? `<div class="suggest"><div class="suggest-title">Места на всех есть в ближайшие даты</div>
              ${sug.map((s) => `<button class="sug press" data-act="useDates" data-from="${s.from}" data-to="${s.to}"><b>${rangeLabel(s.from, s.to)}</b><span>${s.count} ${plural(s.count, "город", "города", "городов")}</span></button>`).join("")}</div>` : ""}
            <button class="btn btn-yellow" data-act="back">Изменить параметры</button>
          </div>`;
        return;
      }
      track("results_shown", { count: items.length, adults: p.adults });
      list.innerHTML = items.map((c, i) => `
        <button class="dest press" data-go="bz/${c.id}" style="animation:swap .45s var(--ease) ${i * 70}ms both">
          <img src="${WM(c.cover, 960)}" alt="" loading="${i ? "lazy" : "eager"}">
          <span class="name"><b>${c.name}</b><span>${c.country}</span></span>
          <span class="foot"><span class="glass">${I.check} Места есть для ${p.adults}</span><span class="glass">от ${rub(c.from)}</span></span>
        </button>`).join("");
    } catch (err) {
      if (!page.isConnected) return;
      track("search_error", { reason: "network" });
      list.innerHTML = `
        <div class="state">
          <div class="ill">${I.info.replace('width="17" height="17"', 'width="48" height="48"')}</div>
          <h3 class="h3">Не получилось загрузить подборку</h3>
          <p>Проверьте подключение к интернету и попробуйте ещё раз.</p>
          <button class="btn btn-yellow" data-act="retryBz">Повторить</button>
        </div>`;
    }
  }
  ACTIONS.simError = () => { Api.simulateErrorOnce(); const pg = current; $("#bzlist", pg).innerHTML = [0, 1].map(() => '<div class="skel"></div>').join(""); loadBz(pg); };
  ACTIONS.useDates = (t) => {
    S.bz.from = t.dataset.from; S.bz.to = t.dataset.to; save();
    track("date_suggestion_click", { from: S.bz.from, to: S.bz.to });
    render("bz", "none");
  };
  ACTIONS.share = async (t) => {
    const city = t.dataset.city ? Api.getCity(t.dataset.city) : null;
    const url = shareUrl(city ? "bz/" + city.id : "bz");
    const n = S.bz.adults;
    const text = city
      ? `Летим в ${city.name}? ${rangeLabel(S.bz.from, S.bz.to)}, нас ${n}. Пускают по внутреннему паспорту`
      : `Куда полетим без заграна: ${rangeLabel(S.bz.from, S.bz.to)}, нас ${n}`;
    track("share_click", { screen: city ? "city" : "results", city: city ? city.id : "-" });
    if (navigator.share) { try { await navigator.share({ title: "Без заграна", text, url }); } catch (e) { /* отменили */ } return; }
    try { await navigator.clipboard.writeText(text + " " + url); } catch (e) {
      const ta = document.createElement("textarea"); ta.value = text + " " + url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* ignore */ } ta.remove();
    }
    toast("Ссылка скопирована. Друзья откроют подборку с теми же датами и составом группы");
  };
  ACTIONS.events = () => openSheet(`
      <div class="s-head"><h2 class="h3">События аналитики</h2><small>демо</small></div>
      <div class="s-body"><ul class="events" id="eventsSheet"></ul></div>
      <div class="s-foot"><button class="btn btn-white" data-close>Закрыть</button></div>`, (sh) => {
      renderEvents();
      sh.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });
    });
  ACTIONS.select = (t) => { track("offer_select", { type: t.dataset.type, city: t.dataset.city }); toast(t.dataset.msg); };
  ACTIONS.retryBz = () => { const pg = current; $("#bzlist", pg).innerHTML = [0, 1].map(() => '<div class="skel"></div>').join(""); loadBz(pg); };

  /* ---------- Страница города ---------- */
  function City(id) {
    const c = Api.getCity(id);
    if (!c) return Home();
    const p = { ...S.bz };
    const nights = Api.nightsBetween(p.from, p.to);
    const days = []; for (let x = d(p.from); x <= d(p.to) && days.length < 5; x = new Date(x.getTime() + 86400000)) days.push(iso(x));
    const flights = Api.flightsSync(id, p), stays = Api.staysSync(id, p);
    const minF = Math.min(...flights.map((f) => f.total));
    const wIcon = c.weather.kind === "snow" ? I.snow : I.cloud;
    return {
      white: true, lightStatus: true,
      html: `
        <button class="round-back press" data-act="back" aria-label="Назад">${I.back}</button>
        <button class="round-back round-share press" data-act="share" data-city="${id}" aria-label="Отправить друзьям">${I.share}</button>
        <div class="compact" id="compact"><button class="icon-btn press" data-act="back" aria-label="Назад">${I.back}</button><b>${c.name}</b><button class="icon-btn press" data-act="share" data-city="${id}" aria-label="Отправить друзьям">${I.share}</button></div>
        <div class="page-scroll" id="cityScroll">
          <div class="cover" id="cover">
            <img src="${WM(c.cover, 1100)}" alt="">
            <div class="in">
              <div class="hello">Привет, это</div>
              <div class="city">${c.name}</div>
              <div class="chips-row"><span class="glass">${I.cal} ${rangeLong(p.from, p.to)}</span><span class="glass">${I.person} ${p.adults}</span></div>
            </div>
          </div>
          <div class="city-body">
            <div class="rule">
              <img src="assets/img/tile-nozagran.svg" alt="">
              <div><b>По внутреннему паспорту РФ</b><small>${c.country}: въезд для граждан РФ от 14 лет. Правило проверено ${c.ruleChecked}. Рейсы без пересадок за границей.</small></div>
            </div>

            <div class="sec"><h2 class="h2">Погода</h2>
              <div class="hscroll">${days.map((day) => `<div class="weather"><small>${dayLabel(day)} обычно</small><div class="t">${wIcon}${c.weather.day > 0 ? "+" : ""}${c.weather.day}°<i>${c.weather.night}°</i><span>· ${c.weather.label}</span></div></div>`).join("")}</div>
            </div>

            <div class="sec"><h2 class="h2">Куда сходить</h2>
              <div class="hscroll">${c.places.map((pl) => `<div class="place"><div class="ph"><img src="${WM(pl.photo, 640)}" alt="" loading="lazy"></div><b>${pl.name}</b><small>${pl.note}</small></div>`).join("")}</div>
            </div>

            <div class="sec">
              <div class="row-head" style="margin-top:0"><h2 class="h2">Где остановиться</h2><button class="all" data-go="bz/${id}/stays">Все</button></div>
              <div class="hscroll">${stays.map((s) => `
                <button class="stay-card press" data-go="bz/${id}/stays">
                  <span class="ph"><img src="${WM(s.photo, 400)}" alt="" loading="lazy"></span>
                  <span class="info"><b>${s.name}</b><span class="rating"><em>${s.rating.toFixed(1).replace(".", ",")}</em>${s.reviews} ${plural(s.reviews, "отзыв", "отзыва", "отзывов")}</span>
                  <span class="price"><b>${rub(s.total)}</b><s>${rub(s.old)}</s><small>${nights} ${plural(nights, "ночь", "ночи", "ночей")}</small></span></span>
                </button>`).join("")}</div>
            </div>

            <div class="sec"><h2 class="h2">Как добраться</h2>
              <button class="route press" data-go="bz/${id}/flights">
                <span class="icon-box">${I.plane}</span>
                <span><b>Москва — ${c.name}</b><small>Прямой рейс · ${flights[0].out.dur}</small>
                <span class="big">от ${rub(minF)}<span>за ${p.adults} чел, туда-обратно</span></span></span>
                <span class="chev">${I.chev}</span>
              </button>
            </div>
            <p class="demo-note" style="text-align:center">Цены и наличие мест демонстрационные</p>
          </div>
        </div>`,
      mount(page) {
        track("city_open", { city: id });
        const sc = $("#cityScroll", page), compact = $("#compact", page), coverImg = $("#cover img", page);
        let ticking = false;
        const onScroll = () => {
          if (ticking) return; ticking = true;
          requestAnimationFrame(() => {
            const y = sc.scrollTop;
            compact.classList.toggle("show", y > 330);
            statusbar && statusbar.classList.toggle("light", y <= 330);
            if (y < 0) coverImg.style.transform = `scale(${1 + -y / 400})`; // растяжение обложки при оттягивании
            ticking = false;
          });
        };
        sc.addEventListener("scroll", onScroll, { passive: true });
        return () => sc.removeEventListener("scroll", onScroll);
      },
    };
  }

  /* ---------- Рейсы ---------- */
  const listHead = (title, sub) => `<div class="list-head"><button class="icon-btn press" data-act="back" aria-label="Назад">${I.back}</button><div class="t"><b>${title}</b><small>${sub}</small></div><span class="icon-btn" aria-hidden="true"></span></div>`;
  function seg(label, s) {
    return `<div class="seg"><span class="lbl">${label}, ${dayLabel(s.date).toLowerCase()}</span>
      <span><span class="tm">${s.dep}</span><div class="ap">${s.depAp}</div></span>
      <span class="mid">${s.dur}</span>
      <span class="r"><span class="tm">${s.arr}${s.arrPlus ? "<sup>+1</sup>" : ""}</span><div class="ap">${s.arrAp}</div></span></div>`;
  }
  function Flights(id) {
    const c = Api.getCity(id); if (!c) return Home();
    const p = { ...S.bz };
    const fl = Api.flightsSync(id, p);
    return {
      white: true,
      html: `
        ${listHead("Москва — " + c.name, `${rangeLabel(p.from, p.to)} · ${p.adults} ${plural(p.adults, "пассажир", "пассажира", "пассажиров")} · туда-обратно`)}
        <div class="page-scroll" style="background:#fff">
          <div class="note-strip">${I.passport.replace('width="30" height="30"', 'width="20" height="20"')}<span>По внутреннему паспорту РФ: прямые рейсы, без пересадок за границей</span></div>
          <div class="list">${fl.map((f, i) => `
            <article class="offer" style="animation:swap .4s var(--ease) ${i * 60}ms both">
              <div class="top"><div class="sum"><b>${rub(f.total)}</b><small>за ${p.adults} ${plural(p.adults, "пассажира", "пассажиров", "пассажиров")}</small><small>${rub(f.perPerson)} за человека</small></div>
              <span class="seats">Осталось ${f.seats} ${plural(f.seats, "место", "места", "мест")}</span></div>
              ${seg("Туда", f.out)}${seg("Обратно", f.ret)}
              <div class="bottom"><small>Багаж 23 кг включён</small><button class="btn btn-yellow btn-small" data-act="select" data-type="flight" data-city="${id}" data-msg="Демо: здесь начинается оформление билетов на ${p.adults} ${plural(p.adults, "пассажира", "пассажиров", "пассажиров")}. Даты и состав группы уже подставлены.">Выбрать</button></div>
            </article>`).join("")}</div>
          <div class="small-print">Время местное. Цены и наличие мест демонстрационные.</div>
        </div>`,
      mount() { track("flights_open", { city: id }); },
    };
  }

  /* ---------- Жильё ---------- */
  function Stays(id) {
    const c = Api.getCity(id); if (!c) return Home();
    const p = { ...S.bz };
    const st = Api.staysSync(id, p);
    const nights = Api.nightsBetween(p.from, p.to);
    return {
      white: true,
      html: `
        ${listHead("Где остановиться · " + c.name, `${rangeLabel(p.from, p.to)} · ${nights} ${plural(nights, "ночь", "ночи", "ночей")} · ${p.adults} ${plural(p.adults, "гость", "гостя", "гостей")}`)}
        <div class="page-scroll" style="background:#fff">
          <div class="list">${st.map((s, i) => `
            <article class="stay-big" style="animation:swap .4s var(--ease) ${i * 60}ms both">
              <div class="ph"><img src="${WM(s.photo, 800)}" alt="" loading="lazy"></div>
              <div class="body">
                <b class="n">${s.name}</b>
                <div class="rating"><em>${s.rating.toFixed(1).replace(".", ",")}</em>${s.reviews} ${plural(s.reviews, "отзыв", "отзыва", "отзывов")}</div>
                <div class="area">${s.area}</div>
                <div class="offer-bottom" style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:14px;gap:10px">
                  <div class="price"><b>${rub(s.total)}</b><s>${rub(s.old)}</s><small>за ${nights} ${plural(nights, "ночь", "ночи", "ночей")} · ${s.type === "hotel" ? s.units + " " + plural(s.units, "номер", "номера", "номеров") : s.units > 1 ? s.units + " квартиры" : "вся квартира"}</small></div>
                  <button class="btn btn-yellow btn-small" data-act="select" data-type="stay" data-city="${id}" data-msg="Демо: здесь начинается бронирование на ${rangeLabel(p.from, p.to)} для ${p.adults} ${plural(p.adults, "гостя", "гостей", "гостей")}.">Выбрать</button>
                </div>
              </div>
            </article>`).join("")}</div>
          <div class="small-print">Цена за весь период. Цены демонстрационные.</div>
        </div>`,
      mount() { track("stays_open", { city: id }); },
    };
  }

  /* ---------- Демо-выдача остальных разделов ---------- */
  function OtherResults(tab) {
    const o = DEMO.other;
    let title, metaHtml, items;
    const dm = (txt, n) => `<span class="meta"><span>${I.cal} ${txt}</span><span>${I.person} ${n}</span></span>`;
    if (tab === "stay") {
      const s = S.stay; title = (s.city || "Любой город") + (s.kind === "hotels" ? " · отели" : s.kind === "flats" ? " · квартиры" : "");
      metaHtml = dm(rangeLabel(s.from, s.to), s.guests);
      const nights = Math.max(1, Api.nightsBetween(s.from, s.to));
      const list = s.kind === "flats" ? [o.stay[2], o.stay[1]] : s.kind === "hotels" ? [o.stay[0], o.stay[1]] : o.stay;
      items = list.map((h) => `<button class="stay-card press" style="width:100%" data-act="toast" data-msg="В прототипе подробно проработан раздел «Без заграна». Здесь — демо-выдача.">
        <span class="ph"><img src="${WM(h.photo, 400)}" alt="" loading="lazy"></span>
        <span class="info"><b>${h.name}</b><span class="rating">${h.meta}</span><span class="price"><b>${rub(h.price * nights)}</b><small>за ${nights} ${plural(nights, "ночь", "ночи", "ночей")}</small></span></span></button>`).join("");
    } else if (tab === "avia" || tab === "train") {
      const s = S[tab]; const isA = tab === "avia";
      title = `${s.fromCity || "Москва"} — ${s.toCity || (isA ? "Сочи" : "Санкт-Петербург")}`;
      metaHtml = dm(isA ? rangeLabel(s.from, s.to) : rangeLabel(s.from), s.pax);
      items = o[tab].map((f) => `<button class="offer press" style="text-align:left;width:100%" data-act="toast" data-msg="В прототипе подробно проработан раздел «Без заграна». Здесь — демо-выдача.">
        <div class="top"><div class="sum"><b>${rub(f.price * s.pax)}</b><small>${f.note} · ${f.dur}</small></div></div>
        <div style="margin-top:12px;font-size:20px;font-weight:700">${f.time}</div><div class="muted" style="font-size:14px;margin-top:2px">${f.route}</div></button>`).join("");
    } else {
      const s = S.weekend; title = s.city || "Куда угодно";
      metaHtml = dm(rangeLabel(s.from, s.to), s.adults);
      items = o.weekend.map((w) => `<button class="weekend-card press" data-act="toast" data-msg="${w.name}: демо-выдача раздела «Выходные». Подробно проработан раздел «Без заграна».">
        <img src="${w.photo}" alt="${w.name}" loading="lazy"></button>`).join("");
    }
    return {
      white: true,
      html: `
        <div class="res-head"><button class="icon-btn press" data-act="back" aria-label="Назад">${I.back}</button><button class="pill press" data-act="back"><b>${esc(title)}</b>${metaHtml}</button><span class="icon-btn" aria-hidden="true"></span></div>
        <div class="page-scroll" style="background:#fff"><div class="res-list">${items}</div><div class="res-foot">Демо-выдача. Цены вымышленные.</div></div>`,
    };
  }

  /* ---------- Нижняя шторка с перетаскиванием ---------- */
  let sheetState = null;
  function openSheet(html, onMount) {
    closeSheet(true);
    const ov = document.createElement("div"); ov.className = "overlay";
    const sh = document.createElement("div"); sh.className = "sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true");
    sh.innerHTML = '<div class="grab"></div>' + html;
    screen.appendChild(ov); screen.appendChild(sh);
    sh.getBoundingClientRect();
    sh.classList.add("anim");
    requestAnimationFrame(() => { ov.classList.add("show"); sh.style.transform = "translateY(0)"; });
    ov.addEventListener("click", () => closeSheet());
    // Перетаскивание: 1:1 за пальцем, на отпускании учитываем скорость.
    let startY = 0, lastY = 0, lastT = 0, vel = 0, dragging = false;
    const onDown = (e) => {
      if (e.target.closest(".s-body") && $(".s-body", sh).scrollTop > 0) return;
      if (e.target.closest("button")) return;
      dragging = true; startY = lastY = e.clientY; lastT = performance.now(); vel = 0;
      sh.classList.remove("anim"); sh.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const now = performance.now(), dy = e.clientY - startY;
      vel = (e.clientY - lastY) / Math.max(1, now - lastT); lastY = e.clientY; lastT = now;
      const y = dy < 0 ? dy / (1 + -dy / 60) * 0.5 : dy; // сопротивление при тяге вверх
      sh.style.transform = `translateY(${y}px)`;
    };
    const onUp = (e) => {
      if (!dragging) return; dragging = false;
      const dy = e.clientY - startY;
      const projected = dy + vel * 1000 * 0.998 / (1 - 0.998) / 1000 * 0.2; // проекция инерции
      sh.classList.add("anim");
      if (projected > sh.offsetHeight * 0.35 || vel > 0.9) closeSheet();
      else sh.style.transform = "translateY(0)";
    };
    sh.addEventListener("pointerdown", onDown);
    sh.addEventListener("pointermove", onMove);
    sh.addEventListener("pointerup", onUp);
    sh.addEventListener("pointercancel", onUp);
    sheetState = { ov, sh };
    if (onMount) onMount(sh);
    return sh;
  }
  function closeSheet(instant) {
    if (!sheetState) return;
    const { ov, sh } = sheetState; sheetState = null;
    if (instant) { ov.remove(); sh.remove(); return; }
    ov.classList.remove("show"); sh.classList.add("anim"); sh.style.transform = "translateY(100%)";
    setTimeout(() => { ov.remove(); sh.remove(); }, 420);
  }

  /* Календарь */
  function openCalendar(opts, onDone) {
    let a = opts.from, b = opts.mode === "range" ? opts.to : null;
    let view = d(a || DEMO.today); view = new Date(view.getFullYear(), view.getMonth(), 1);
    const min = new Date(2026, 10, 1), max = new Date(2027, 2, 1);
    const head = () => {
      if (!a) return "Выберите даты";
      if (opts.mode === "single") return rangeLabel(a);
      if (!b) return rangeLabel(a) + " — выберите выезд";
      const n = Api.nightsBetween(a, b);
      return `${rangeLabel(a, b)}, ${n} ${plural(n, "ночь", "ночи", "ночей")}`;
    };
    const grid = () => {
      const y = view.getFullYear(), m = view.getMonth();
      const first = new Date(y, m, 1), shift = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      let h = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((w, i) => `<div class="wd${i > 4 ? " we" : ""}">${w}</div>`).join("");
      for (let i = 0; i < shift; i++) h += "<div></div>";
      for (let day = 1; day <= days; day++) {
        const s = iso(new Date(y, m, day)), wd = (shift + day - 1) % 7;
        const cls = ["day"];
        if (s < DEMO.today) cls.push("off");
        if (wd > 4) cls.push("we");
        if (s === DEMO.today) cls.push("today");
        if (a && s === a) cls.push("start");
        if (b && s === b) cls.push("end");
        if (a && b && s >= a && s <= b) cls.push("in");
        h += `<button class="${cls.join(" ")}" data-day="${s}"><span>${day}</span></button>`;
      }
      return h;
    };
    const sh = openSheet(`
      <div class="s-head"><h2 class="h3">${opts.title}</h2><small id="calHead">${head()}</small></div>
      <div class="cal-nav"><button data-nav="-1" aria-label="Предыдущий месяц">${I.chevL}</button><b id="calMonth"></b><button data-nav="1" aria-label="Следующий месяц">${I.chev}</button></div>
      <div class="s-body"><div class="cal" id="calGrid"></div></div>
      <div class="s-foot"><button class="btn btn-yellow" id="calDone">Готово</button></div>`);
    const upd = () => {
      $("#calGrid", sh).innerHTML = grid();
      $("#calMonth", sh).textContent = MONTHS_FULL[view.getMonth()] + " " + view.getFullYear();
      $("#calHead", sh).textContent = head();
      sh.querySelector('[data-nav="-1"]').disabled = view <= min;
      sh.querySelector('[data-nav="1"]').disabled = view >= max;
      $("#calDone", sh).disabled = opts.mode === "range" ? !(a && b) : !a;
    };
    upd();
    sh.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) { view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1); upd(); return; }
      const dayEl = e.target.closest("[data-day]");
      if (dayEl) {
        const s = dayEl.dataset.day;
        if (opts.mode === "single") a = s;
        else if (!a || b || s <= a) { a = s; b = null; }
        else b = s;
        upd(); return;
      }
      if (e.target.closest("#calDone")) { onDone(a, b); closeSheet(); }
    });
  }

  /* Счётчик участников */
  function openCounter(o, onDone) {
    let v = o.value;
    const sh = openSheet(`
      <div class="s-head"><h2 class="h3">${o.title}</h2></div>
      <div class="counter"><div><b>${o.label}</b>${o.sub ? `<small>${o.sub}</small>` : ""}</div>
        <div class="stepper"><button data-step="-1" aria-label="Меньше">−</button><output id="cnt" aria-live="polite">${v}</output><button data-step="1" aria-label="Больше">+</button></div></div>
      ${o.hint ? `<div class="hint" style="padding:8px 0 4px">${I.info}<span>${o.hint}</span></div>` : ""}
      <div class="s-foot"><button class="btn btn-yellow" id="cntDone">Готово</button></div>`);
    const upd = () => {
      const out = $("#cnt", sh); out.textContent = v; out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
      sh.querySelector('[data-step="-1"]').disabled = v <= o.min;
      sh.querySelector('[data-step="1"]').disabled = v >= o.max;
    };
    upd();
    sh.addEventListener("click", (e) => {
      const st = e.target.closest("[data-step]");
      if (st) { v = Math.min(o.max, Math.max(o.min, v + Number(st.dataset.step))); upd(); return; }
      if (e.target.closest("#cntDone")) { onDone(v); closeSheet(); }
    });
  }

  function openCredits() {
    openSheet(`
      <div class="s-head"><h2 class="h3">Фото</h2><small>Wikimedia Commons</small></div>
      <div class="s-body credits">${DEMO.credits.map(([f, a]) => `<a href="${WM_PAGE(f)}" target="_blank" rel="noopener">${esc(f)} <span>· ${esc(a)}</span></a>`).join("")}
      <p class="demo-note" style="margin:12px 0 0">Иконки категорий и баннер взяты со скриншотов приложения Яндекс Путешествия для демонстрации концепта.</p></div>
      <div class="s-foot"><button class="btn btn-white" data-close>Закрыть</button></div>`, (sh) => {
      sh.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });
    });
  }
  renderEvents();
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-side]");
    if (!t) return;
    if (t.dataset.side === "credits") openCredits();
    if (t.dataset.side === "reset") ACTIONS.reset();
    if (t.dataset.side === "tour") (T.on ? stopTour() : startTour());
  });

  /* ---------- Автопроход сценария: подсвечивает шаги стеклянной рамкой и нажимает сам ---------- */
  const T = { on: false, layer: null, ring: null, cap: null, run: 0 };
  const STOP = new Error("tour-stopped");
  const rawWait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function pause(ms) { await rawWait(reduced() ? Math.min(ms, 900) : ms); if (!T.on) throw STOP; }
  const inScope = (el) => el.offsetParent !== null && (el.closest(".sheet") || el.closest(".page") === current);
  async function waitFor(sel, timeout = 4500) {
    const t0 = performance.now();
    while (performance.now() - t0 < timeout) {
      if (!T.on) throw STOP;
      const el = [...screen.querySelectorAll(sel)].find(inScope);
      if (el) return el;
      await rawWait(80);
    }
    throw new Error("Не найден элемент " + sel);
  }
  function caption(text, step, total, place) {
    const tx = $(".tx", T.cap);
    tx.innerHTML = `<small>Шаг ${step} из ${total}</small><b>${text}</b>`;
    tx.classList.remove("swap"); void tx.offsetWidth; tx.classList.add("swap");
    T.cap.classList.toggle("top", place === "top"); T.cap.classList.toggle("bottom", place !== "top");
    $(".tour-bar i", T.cap).style.width = Math.round((step / total) * 100) + "%";
  }
  let stepNo = 0, stepTotal = 0;
  async function focus(el, text, ms) {
    const sc = el.closest(".page-scroll, .s-body");
    if (sc) {
      const r = el.getBoundingClientRect(), s = sc.getBoundingClientRect();
      if (r.top < s.top + 70 || r.bottom > s.bottom - 90) {
        sc.scrollTo({ top: sc.scrollTop + (r.top - s.top) - (s.height - Math.min(r.height, s.height * 0.6)) / 2, behavior: reduced() ? "auto" : "smooth" });
        await pause(700);
      }
    }
    const r = el.getBoundingClientRect(), base = screen.getBoundingClientRect(), pad = 6;
    const rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 14;
    Object.assign(T.ring.style, { left: r.left - base.left - pad + "px", top: r.top - base.top - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px", borderRadius: rad + pad + "px" });
    T.ring.classList.remove("hide");
    const centerY = r.top - base.top + r.height / 2;
    caption(text, ++stepNo, stepTotal, centerY > base.height * 0.52 ? "top" : "bottom");
    await pause(ms);
  }
  async function tap(el) {
    T.ring.classList.remove("tap"); void T.ring.offsetWidth; T.ring.classList.add("tap");
    await pause(380);
    T.ring.classList.add("hide");
    el.click();
    await pause(750);
  }
  async function tourBack() { T.ring.classList.add("hide"); await pause(250); back(); await pause(800); }

  const TOUR = [
    async () => { const el = await waitFor('[data-tile="bz"]'); await focus(el, "На главной новая плитка «Без заграна» в одном ряду с другими разделами", 3200); await tap(el); },
    async () => { const el = await waitFor('[data-tab="bz"] .tab-circle'); await focus(el, "Тот же раздел открывается из поиска: круглая вкладка справа от «Выходных»", 3200); },
    async () => { const el = await waitFor("#form .card"); await focus(el, "Город назначения вводить не нужно: его выбирают в подборке", 3000); },
    async () => { const el = await waitFor('[data-act="pickBzDates"]'); await focus(el, "Даты поездки уже стоят: 7–11 декабря", 2400); },
    async () => { const el = await waitFor('[data-act="pickBzPeople"]'); await focus(el, "В компании четверо, меняем число участников", 2400); await tap(el); },
    async () => { const el = await waitFor('.sheet [data-step="1"]'); await focus(el, "Плюс один участник: теперь их 4", 2000); await tap(el); const d2 = await waitFor("#cntDone"); await focus(d2, "Готово", 1200); await tap(d2); },
    async () => { const el = await waitFor('[data-act="find"][data-tab="bz"]'); await focus(el, "Ищем города, куда можно полететь всем вчетвером", 2400); await tap(el); },
    async () => { await waitFor(".dest"); await pause(500); const el = await waitFor("#bzlist"); await focus(el, "Остались Ереван и Минск. В Алматы на эти даты только 3 места, поэтому его в подборке нет", 3800); },
    async () => { const el = await waitFor('.res-head [data-act="share"]'); await focus(el, "Подборку можно отправить друзьям: ссылка сохранит даты и состав группы", 3000); },
    async () => { const el = await waitFor(".dest"); await focus(el, "Открываем Ереван", 1800); await tap(el); },
    async () => { const el = await waitFor(".rule"); await focus(el, "Правило въезда проверено редакцией, указана дата проверки", 3000); },
    async () => { const el = await waitFor(".route"); await focus(el, "Как добраться: рейсы туда и обратно на те же даты", 2600); await tap(el); },
    async () => { const el = await waitFor(".offer"); await focus(el, "Прямые рейсы, цена сразу за всю группу и сколько мест осталось", 3600); await tourBack(); },
    async () => { const el = await waitFor(".stay-card"); await focus(el, "Где остановиться: цена за все 4 ночи", 2600); await tap(el); },
    async () => { const el = await waitFor(".stay-big"); await focus(el, "Жильё на те же даты и для того же числа гостей", 3000); await tourBack(); await tourBack(); },
    async () => { const el = await waitFor(".res-head .pill"); await focus(el, "Вернулись к подборке: даты и участники сохранились", 3200); },
  ];

  async function startTour() {
    if (T.on) return;
    T.on = true; const runId = ++T.run;
    stepNo = 0; stepTotal = TOUR.length + 1;
    const btn = document.getElementById("tourBtn");
    if (btn) { btn.classList.add("on"); $("span", btn).textContent = "Остановить"; }
    // Начинаем с чистого состояния на главной
    S = fresh(); save(); history.replaceState({ i: 0 }, "", "#/"); idx = 0; render("", "none");
    T.layer = document.createElement("div"); T.layer.className = "tour-layer";
    T.layer.innerHTML = '<div class="tour-ring hide"></div><div class="tour-cap bottom" role="status" aria-live="polite"><div class="tx"></div><button data-tour="stop">Стоп</button><div class="tour-bar"><i></i></div></div>';
    screen.appendChild(T.layer);
    T.ring = $(".tour-ring", T.layer); T.cap = $(".tour-cap", T.layer);
    T.layer.addEventListener("click", (e) => { if (e.target.closest('[data-tour="stop"]')) stopTour(); if (e.target.closest('[data-tour="close"]')) stopTour(); });
    caption("Покажу весь путь: от плитки на главной до рейсов и жилья", 0, stepTotal, "bottom");
    try {
      await pause(2200);
      for (const step of TOUR) { if (runId !== T.run) return; await step(); }
      T.ring.classList.add("hide");
      caption("Это весь сценарий. Попробуйте сами: поставьте 9 участников и посмотрите, какие даты предложит сервис", stepTotal, stepTotal, "bottom");
      T.cap.classList.add("final");
      $('[data-tour="stop"]', T.cap).outerHTML = '<button class="primary" data-tour="close">Пройти самому</button>';
    } catch (err) {
      if (err !== STOP) { console.warn("[tour]", err); stopTour(); }
    }
  }
  function stopTour() {
    T.on = false; T.run++;
    if (T.layer) T.layer.remove();
    T.layer = T.ring = T.cap = null;
    const btn = document.getElementById("tourBtn");
    if (btn) { btn.classList.remove("on"); $("span", btn).textContent = "Смотреть сценарий"; }
  }
  ACTIONS.tour = () => startTour();
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && T.on) stopTour(); });

  /* Тост */
  let toastTimer = null;
  function toast(msg) {
    let el = $(".toast", screen);
    if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); screen.appendChild(el); }
    el.textContent = msg; el.getBoundingClientRect(); el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  /* Если фото не загрузилось, оставляем аккуратную подложку вместо значка битой картинки */
  document.addEventListener("error", (e) => {
    const el = e.target;
    if (el && el.tagName === "IMG") { el.style.visibility = "hidden"; el.setAttribute("data-failed", ""); }
  }, true);

  /* ---------- Старт ---------- */
  const start = location.hash.replace(/^#\/?/, "");
  history.replaceState({ i: 0 }, "", "#/" + start);
  render(start, "none");
})();
