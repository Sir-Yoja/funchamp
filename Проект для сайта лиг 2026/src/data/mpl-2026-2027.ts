export type TeamRow = {
  name: string; points: number; played: number; wins: number; draws: number;
  losses: number; goalsFor: number; goalsAgainst: number;
};
export type MatchRow = {
  round: number; date: string; home: string; away: string;
  homeScore: number; awayScore: number;
};
export type PlayerRow = {
  name: string; team: string; goals: number; assists: number; appearances: number;
};
export type KeeperRow = {
  name: string; team: string; goalsConceded: number; matches: number; average: number;
};

export const mplLeague = {
  id: "moscow-punk-rock-league",
  name: "Moscow Punk Rock League",
  shortName: "MPL",
  description: "Независимая панк-рок футбольная лига Москвы",
  city: "Москва",
  stadium: "Стадион «Труд Москва»",
  season: "2026 / 2027",
  seasonLabel: "август 2026 — июль 2027",
  seasonNumber: 16,
  logo: "https://mychamp.ru/system/championships/202/large.jpg",
  teams: [
  {
    "name": "ФК Петруч",
    "points": 17,
    "played": 7,
    "wins": 5,
    "draws": 2,
    "losses": 0,
    "goalsFor": 26,
    "goalsAgainst": 7
  },
  {
    "name": "ФК Старые Дрожжи",
    "points": 17,
    "played": 7,
    "wins": 5,
    "draws": 2,
    "losses": 0,
    "goalsFor": 17,
    "goalsAgainst": 4
  },
  {
    "name": "ЛФК Балдёж",
    "points": 16,
    "played": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 20,
    "goalsAgainst": 7
  },
  {
    "name": "ФК Вечер Пятницы",
    "points": 16,
    "played": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 22,
    "goalsAgainst": 11
  },
  {
    "name": "ФК Ракета",
    "points": 11,
    "played": 7,
    "wins": 3,
    "draws": 2,
    "losses": 2,
    "goalsFor": 19,
    "goalsAgainst": 13
  },
  {
    "name": "ФК Душевой Флирт",
    "points": 11,
    "played": 7,
    "wins": 3,
    "draws": 2,
    "losses": 2,
    "goalsFor": 16,
    "goalsAgainst": 10
  },
  {
    "name": "Beamish FC",
    "points": 10,
    "played": 7,
    "wins": 3,
    "draws": 1,
    "losses": 3,
    "goalsFor": 18,
    "goalsAgainst": 16
  },
  {
    "name": "ФК Други",
    "points": 9,
    "played": 7,
    "wins": 2,
    "draws": 3,
    "losses": 2,
    "goalsFor": 7,
    "goalsAgainst": 6
  },
  {
    "name": "Fc King is Dead",
    "points": 7,
    "played": 7,
    "wins": 2,
    "draws": 1,
    "losses": 4,
    "goalsFor": 12,
    "goalsAgainst": 20
  },
  {
    "name": "ФК Черные но Синие",
    "points": 6,
    "played": 7,
    "wins": 2,
    "draws": 0,
    "losses": 5,
    "goalsFor": 10,
    "goalsAgainst": 25
  },
  {
    "name": "Bedros Pilibos",
    "points": 6,
    "played": 7,
    "wins": 2,
    "draws": 0,
    "losses": 5,
    "goalsFor": 5,
    "goalsAgainst": 16
  },
  {
    "name": "Тасманские Дьяволы",
    "points": 5,
    "played": 7,
    "wins": 1,
    "draws": 2,
    "losses": 4,
    "goalsFor": 8,
    "goalsAgainst": 18
  },
  {
    "name": "ФК ЩИТ",
    "points": 4,
    "played": 7,
    "wins": 1,
    "draws": 1,
    "losses": 5,
    "goalsFor": 6,
    "goalsAgainst": 17
  },
  {
    "name": "ФК Клещи",
    "points": 2,
    "played": 7,
    "wins": 0,
    "draws": 2,
    "losses": 5,
    "goalsFor": 5,
    "goalsAgainst": 21
  }
] satisfies TeamRow[],
  matches: [
    {round:1,date:"29 августа 2026",home:"ЛФК Балдёж",away:"Bedros Pilibos",homeScore:1,awayScore:3},
    {round:1,date:"29 августа 2026",home:"ФК Други",away:"ФК Душевой Флирт",homeScore:1,awayScore:0},
    {round:1,date:"29 августа 2026",home:"ФК Старые Дрожжи",away:"ФК Клещи",homeScore:1,awayScore:0},
    {round:1,date:"29 августа 2026",home:"ФК Черные но Синие",away:"Fc King is Dead",homeScore:2,awayScore:4},
    {round:1,date:"29 августа 2026",home:"ФК Петруч",away:"ФК ЩИТ",homeScore:2,awayScore:0},
    {round:1,date:"29 августа 2026",home:"Beamish FC",away:"ФК Ракета",homeScore:3,awayScore:5},
    {round:1,date:"29 августа 2026",home:"ФК Вечер Пятницы",away:"Тасманские Дьяволы",homeScore:3,awayScore:1},
    {round:2,date:"5 сентября 2026",home:"ФК Вечер Пятницы",away:"ФК Ракета",homeScore:4,awayScore:3},
    {round:2,date:"5 сентября 2026",home:"Bedros Pilibos",away:"ФК Черные но Синие",homeScore:0,awayScore:3},
    {round:2,date:"5 сентября 2026",home:"Тасманские Дьяволы",away:"ФК ЩИТ",homeScore:1,awayScore:0},
    {round:2,date:"5 сентября 2026",home:"ФК Петруч",away:"ФК Душевой Флирт",homeScore:1,awayScore:1},
    {round:2,date:"5 сентября 2026",home:"ФК Други",away:"ФК Клещи",homeScore:2,awayScore:0},
    {round:2,date:"5 сентября 2026",home:"ФК Старые Дрожжи",away:"Fc King is Dead",homeScore:5,awayScore:0},
    {round:2,date:"5 сентября 2026",home:"ЛФК Балдёж",away:"Beamish FC",homeScore:3,awayScore:2},
    {round:3,date:"12 сентября 2026",home:"Тасманские Дьяволы",away:"ФК Петруч",homeScore:1,awayScore:4},
    {round:3,date:"12 сентября 2026",home:"ФК ЩИТ",away:"ФК Душевой Флирт",homeScore:1,awayScore:3},
    {round:3,date:"12 сентября 2026",home:"ФК Черные но Синие",away:"ФК Ракета",homeScore:0,awayScore:3},
    {round:3,date:"12 сентября 2026",home:"Fc King is Dead",away:"ФК Клещи",homeScore:1,awayScore:1},
    {round:3,date:"12 сентября 2026",home:"Bedros Pilibos",away:"Beamish FC",homeScore:0,awayScore:3},
    {round:3,date:"12 сентября 2026",home:"ЛФК Балдёж",away:"ФК Други",homeScore:1,awayScore:0},
    {round:3,date:"12 сентября 2026",home:"ФК Вечер Пятницы",away:"ФК Старые Дрожжи",homeScore:0,awayScore:0},
    {round:6,date:"3 октября 2026",home:"ФК Вечер Пятницы",away:"Fc King is Dead",homeScore:5,awayScore:3},
    {round:6,date:"3 октября 2026",home:"Beamish FC",away:"Тасманские Дьяволы",homeScore:4,awayScore:2},
    {round:6,date:"3 октября 2026",home:"ФК Старые Дрожжи",away:"ФК Други",homeScore:2,awayScore:1},
    {round:6,date:"3 октября 2026",home:"Bedros Pilibos",away:"ФК Душевой Флирт",homeScore:0,awayScore:5},
    {round:6,date:"3 октября 2026",home:"ФК Черные но Синие",away:"ЛФК Балдёж",homeScore:0,awayScore:5},
    {round:6,date:"3 октября 2026",home:"ФК Петруч",away:"ФК Клещи",homeScore:10,awayScore:1},
    {round:6,date:"3 октября 2026",home:"ФК ЩИТ",away:"ФК Ракета",homeScore:3,awayScore:1}
  ] satisfies MatchRow[],
  scorers: [
    {name:"Черных Андрей",team:"ФК Вечер Пятницы",goals:5,assists:1,appearances:5},
    {name:"Кравцов Сергей",team:"ФК Старые Дрожжи",goals:5,assists:0,appearances:5},
    {name:"Таци Тимур",team:"ФК Петруч",goals:4,assists:2,appearances:5},
    {name:"Бандит",team:"Beamish FC",goals:4,assists:2,appearances:5},
    {name:"Kotitcyn Iwan",team:"ФК Петруч",goals:4,assists:1,appearances:4},
    {name:"Никишин Денис",team:"ЛФК Балдёж",goals:3,assists:5,appearances:5},
    {name:"Димитров Дмитрий",team:"ФК Ракета",goals:3,assists:4,appearances:5},
    {name:"Авсянкин Денис",team:"ФК Ракета",goals:3,assists:1,appearances:5},
    {name:"Казин Алексей",team:"ФК Душевой Флирт",goals:3,assists:1,appearances:5},
    {name:"Левша Jr",team:"ФК Вечер Пятницы",goals:2,assists:6,appearances:4},
    {name:"Кириллов Сергей",team:"ФК Старые Дрожжи",goals:2,assists:4,appearances:5},
    {name:"Рахимов Максим",team:"Beamish FC",goals:2,assists:2,appearances:5},
    {name:"Ефремов Дмитрий",team:"Beamish FC",goals:2,assists:1,appearances:1},
    {name:"Тулушев Артём",team:"ФК Черные но Синие",goals:2,assists:1,appearances:2},
    {name:"Яцков Толя",team:"ЛФК Балдёж",goals:2,assists:1,appearances:5}
  ] satisfies PlayerRow[],
  goalkeepers: [
    {name:"Евроденс Серый",team:"ФК Други",goalsConceded:3,matches:4,average:0.75},
    {name:"Антон Панюков",team:"ФК Вечер Пятницы",goalsConceded:4,matches:5,average:0.8},
    {name:"Саша Друг",team:"ФК Душевой Флирт",goalsConceded:3,matches:3,average:1},
    {name:"Мазурин Артем",team:"ФК Петруч",goalsConceded:5,matches:4,average:1.25},
    {name:"Кольбус Михаил",team:"ЛФК Балдёж",goalsConceded:7,matches:5,average:1.4},
    {name:"Вторушин Антон",team:"Тасманские Дьяволы",goalsConceded:10,matches:5,average:2},
    {name:"Артём Тёмкин",team:"Bedros Pilibos",goalsConceded:10,matches:5,average:2},
    {name:"Маркин Дмитрий",team:"ФК Ракета",goalsConceded:6,matches:3,average:2},
    {name:"Бивис Евген",team:"ФК Черные но Синие",goalsConceded:9,matches:4,average:2.25},
    {name:"Репин Андрей",team:"ФК Клещи",goalsConceded:7,matches:3,average:2.33},
    {name:"Ширин Ден",team:"ФК ЩИТ",goalsConceded:13,matches:5,average:2.6},
    {name:"Мышко Всеволод",team:"Fc King is Dead",goalsConceded:9,matches:3,average:3},
    {name:"Горелов Виктор",team:"Beamish FC",goalsConceded:13,matches:4,average:3.25}
  ] satisfies KeeperRow[],
  source: {
    main: "https://mychamp.ru/ru/championships/202",
    matches: "https://mychamp.ru/championships/202/games",
    statistics: "https://mychamp.ru/championships/202/statistic",
    standings: "https://mychamp.ru/championships/202/show_table"
  },
  dataNote: "Публичный снимок MyChamp: таблица отражает 7 сыгранных матчей. Индивидуальная статистика и матчевый архив могут иметь отдельные даты обновления; непроверенные результаты не подставляются."
} as const;
