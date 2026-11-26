/* Демонстрационные данные прототипа «Без заграна».
   Все цены, места и рейсы вымышленные. В продакшене эти данные отдаёт бэкенд (см. js/api.js). */

const WM = (file, w = 960) =>
  "https://commons.wikimedia.org/wiki/Special:FilePath/" +
  encodeURIComponent(file.replace(/ /g, "_")) + "?width=" + w;
const WM_PAGE = (file) =>
  "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file.replace(/ /g, "_"));

const PHOTO = {
  evnCover: "Mount Ararat and the Yerevan skyline in spring from the Cascade.jpg",
  evnCascade: "Cascade, Yerevan 81.jpg",
  evnNight: "Yerevan, Yerevan Cascade at night, Armenia.jpg",
  alaCover: "Almaty Skyline from the Kök Töbe hill.jpg",
  alaShymbulak: "Shymbulak Alatau mountains in Almaty.jpg",
  alaKokTobe: "Almaty city skyline.jpg",
  msqCover: "Minsk. A view of Svislach river.jpg",
  msqTrinity: "Замалёўкі Мінска 35.jpg",
  msqUpper: "Svislach and upper town in Minsk.jpg",
  hotel1: "Hotel Room with queen size bed.jpg",
  hotel2: "Bed in hotel room 3.jpg",
  hotel3: "Cozy hotel room with modern furnishings and natural light flowing through the curtains.jpg",
  flat1: "Modern living room with stylish furniture and a view of the outdoors in a cozy apartment setting.jpg",
  flat2: "Living room (Unsplash).jpg",
  flat3: "Living Room.jpg",
};

const DEMO = {
  today: "2026-11-26",
  departure: { code: "MOW", name: "Москва", gen: "Москвы" },
  defaults: { from: "2026-12-07", to: "2026-12-11", adults: 3 },
  baseRange: { from: "2026-12-07", to: "2026-12-11" },
  maxAdults: 12,

  cities: [
    {
      id: "evn", name: "Ереван", country: "Армения", airport: "EVN", tz: 1,
      cover: PHOTO.evnCover, seatsBase: 4, ruleChecked: "20 ноября 2026",
      weather: { day: 4, night: -3, kind: "cloud", label: "облачно" },
      places: [
        { name: "Каскад", note: "Лестница-музей и вид на Арарат", photo: PHOTO.evnCascade },
        { name: "Каскад вечером", note: "Подсветка и кафе у подножия", photo: PHOTO.evnNight },
      ],
      flights: [
        { from: "VKO", dep: "08:15", dur: [3, 5], backDep: "13:10", backDur: [3, 10], price: 24300 },
        { from: "SVO", dep: "14:40", dur: [3, 5], backDep: "19:30", backDur: [3, 10], price: 26900 },
      ],
      stays: [
        { name: "Отель «Каскад Сити»", type: "hotel", rating: 4.8, reviews: 612, area: "Центр, 5 минут до Каскада", rate: 9400, photo: PHOTO.hotel1 },
        { name: "Апартаменты на Абовяна", type: "flat", rating: 4.7, reviews: 238, area: "Центр, до 4 гостей", rate: 8200, photo: PHOTO.flat1 },
      ],
    },
    {
      id: "ala", name: "Алматы", country: "Казахстан", airport: "ALA", tz: 2,
      cover: PHOTO.alaCover, seatsBase: 3, ruleChecked: "20 ноября 2026",
      weather: { day: 1, night: -7, kind: "snow", label: "снег" },
      places: [
        { name: "Шымбулак", note: "Горнолыжный курорт в 25 км от центра", photo: PHOTO.alaShymbulak },
        { name: "Кок-Тобе", note: "Канатная дорога и панорама города", photo: PHOTO.alaKokTobe },
      ],
      flights: [
        { from: "DME", dep: "00:35", dur: [4, 20], backDep: "08:00", backDur: [4, 40], price: 31800 },
        { from: "SVO", dep: "11:20", dur: [4, 20], backDep: "19:10", backDur: [4, 40], price: 34600 },
      ],
      stays: [
        { name: "Отель «Кок-Тобе Вью»", type: "hotel", rating: 4.9, reviews: 1043, area: "Медеуский район, вид на горы", rate: 10800, photo: PHOTO.hotel3 },
        { name: "Квартира у Арбата", type: "flat", rating: 4.6, reviews: 187, area: "Центр, до 4 гостей", rate: 7600, photo: PHOTO.flat2 },
      ],
    },
    {
      id: "msq", name: "Минск", country: "Беларусь", airport: "MSQ", tz: 0,
      cover: PHOTO.msqCover, seatsBase: 8, ruleChecked: "20 ноября 2026",
      weather: { day: -1, night: -5, kind: "cloud", label: "облачно" },
      places: [
        { name: "Троицкое предместье", note: "Старый город на берегу Свислочи", photo: PHOTO.msqTrinity },
        { name: "Верхний город", note: "Ратуша и соборы XVII века", photo: PHOTO.msqUpper },
      ],
      flights: [
        { from: "SVO", dep: "07:05", dur: [1, 25], backDep: "10:00", backDur: [1, 25], price: 14200 },
        { from: "VKO", dep: "17:50", dur: [1, 25], backDep: "20:30", backDur: [1, 25], price: 15900 },
      ],
      stays: [
        { name: "Отель «Немига Парк»", type: "hotel", rating: 4.8, reviews: 954, area: "Центр, у Троицкого предместья", rate: 7900, photo: PHOTO.hotel2 },
        { name: "Квартира на Зыбицкой", type: "flat", rating: 4.7, reviews: 312, area: "Старый город, до 4 гостей", rate: 6400, photo: PHOTO.flat3 },
      ],
    },
  ],

  /* Демо-выдача других разделов */
  other: {
    stay: [
      { name: "Гостиница «Волжская»", meta: "4,7 · 1 280 отзывов", price: 6900, photo: PHOTO.hotel2 },
      { name: "Апарт-отель «Кремлёвский»", meta: "4,8 · 640 отзывов", price: 8400, photo: PHOTO.flat3 },
      { name: "Квартира у набережной", meta: "4,6 · 210 отзывов", price: 5600, photo: PHOTO.flat2 },
    ],
    avia: [
      { time: "07:20 — 11:15", route: "SVO → AER", dur: "3 ч 55 мин", note: "Прямой", price: 8900 },
      { time: "12:05 — 16:00", route: "VKO → AER", dur: "3 ч 55 мин", note: "Прямой", price: 10400 },
      { time: "18:40 — 00:35", route: "DME → AER", dur: "5 ч 55 мин", note: "1 пересадка", price: 7600 },
    ],
    train: [
      { time: "06:43 — 10:39", route: "Ленинградский вокзал → Московский вокзал", dur: "3 ч 56 мин", note: "Скоростной, сидячий", price: 4300 },
      { time: "13:30 — 17:25", route: "Ленинградский вокзал → Московский вокзал", dur: "3 ч 55 мин", note: "Скоростной, сидячий", price: 5100 },
      { time: "23:55 — 08:05", route: "Ленинградский вокзал → Московский вокзал", dur: "8 ч 10 мин", note: "Купе", price: 6200 },
    ],
    weekend: [
      { name: "Подольск", photo: "assets/img/weekend-podolsk.jpg" },
      { name: "Верея", photo: "assets/img/weekend-vereya.jpg" },
    ],
  },

  credits: [
    [PHOTO.evnCover, "Serouj Ourishian"], [PHOTO.evnCascade, "23artashes"], [PHOTO.evnNight, "Argenberg"],
    [PHOTO.alaCover, "Dauren Nabijan"], [PHOTO.alaKokTobe, "Dauren Nabijan"], [PHOTO.alaShymbulak, "Ninaras"],
    [PHOTO.msqCover, "Vadim Sazanovich"], [PHOTO.msqTrinity, "Wikimedia Commons"], [PHOTO.msqUpper, "Wikimedia Commons"],
    [PHOTO.hotel1, "Tim36272"], [PHOTO.hotel2, "Kurt Kaiser"], [PHOTO.hotel3, "Wikimedia Commons"],
    [PHOTO.flat1, "Shixart1985"], [PHOTO.flat2, "Jarosław Ceborski"], [PHOTO.flat3, "Tim Collins"],
  ],
};
