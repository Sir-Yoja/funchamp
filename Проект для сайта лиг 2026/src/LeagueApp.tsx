import React, { useMemo, useState } from "react";
import {
  Trophy, Table2, CalendarDays, Shield, Users, Menu, X, ExternalLink,
  MapPin, Search, ChevronRight, ArrowLeft, ChartNoAxesCombined, Goal,
  Layers3
} from "lucide-react";
import { mplLeague } from "./data/mpl-2026-2027";
import { mplScorers, mplGoalkeepers, mplCards } from "./data/mpl-players";

type LeagueTab = "overview" | "table" | "matches" | "players" | "teams";
type Page = "home" | "leagues" | "league";

const leagues = [mplLeague];
const teamLogos: Record<string, string> = {
  "ФК Вечер Пятницы": "https://mychamp.ru/system/clubs/5326/mini.jpg",
  "Тасманские Дьяволы": "https://mychamp.ru/system/clubs/14120/mini.jpg",
  "Beamish FC": "https://mychamp.ru/system/clubs/2186/mini.jpg",
  "ФК Ракета": "https://mychamp.ru/system/clubs/2178/mini.jpg",
  "ФК Петруч": "https://mychamp.ru/system/clubs/7118/mini.jpg",
  "ФК ЩИТ": "https://mychamp.ru/system/clubs/5296/mini.png",
  "ФК Черные но Синие": "https://mychamp.ru/system/clubs/9018/mini.jpg",
  "Fc King is Dead": "https://mychamp.ru/system/clubs/2182/mini.jpg",
  "ФК Старые Дрожжи": "https://mychamp.ru/system/clubs/40343/mini.jpeg",
  "ФК Клещи": "https://mychamp.ru/system/clubs/29818/mini.jpg",
  "ФК Други": "https://mychamp.ru/system/clubs/9021/mini.jpg",
  "ФК Душевой Флирт": "https://mychamp.ru/system/clubs/18308/mini.jpg",
  "ЛФК Балдёж": "https://mychamp.ru/system/clubs/40283/mini.png",
  "Bedros Pilibos": "https://mychamp.ru/system/clubs/35749/mini.jpg"
};

function ImageBadge({ src, name, size = 38 }: { src?: string; name: string; size?: number }) {
  const [attempt, setAttempt] = useState(0);
  const proxySrc = src ? `https://images.weserv.nl/?url=${encodeURIComponent(src)}` : undefined;
  const imageSrc = attempt === 0 ? src : attempt === 1 ? proxySrc : undefined;
  return <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d7e4f5] bg-[#f0f6ff]">
    {imageSrc
      ? <img src={imageSrc} alt={name} loading="lazy" decoding="async" className="h-full w-full object-contain p-1" onError={() => setAttempt((value) => value + 1)}/>
      : <span className="text-[10px] font-black text-[#426b9f]">{name.split(/\s+/).slice(0,2).map(x => x[0]).join("").slice(0,3).toUpperCase()}</span>}
  </span>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeLeagueId, setActiveLeagueId] = useState<string | null>(null);
  const [leagueTab, setLeagueTab] = useState<LeagueTab>("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const activeLeague = leagues.find((league) => league.id === activeLeagueId) ?? null;

  const openLeague = (id: string) => {
    setActiveLeagueId(id);
    setLeagueTab("overview");
    setPage("league");
    setMobileMenu(false);
  };
  const goHome = () => {
    setPage("home");
    setActiveLeagueId(null);
    setMobileMenu(false);
  };

  const platformNav = [
    { id: "home" as Page, label: "Главная", icon: Layers3 },
    { id: "leagues" as Page, label: "Лиги", icon: Trophy },
  ];
  const leagueNav: { id: LeagueTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Обзор", icon: ChartNoAxesCombined },
    { id: "table", label: "Таблица", icon: Table2 },
    { id: "matches", label: "Матчи", icon: CalendarDays },
    { id: "players", label: "Игроки", icon: Users },
    { id: "teams", label: "Команды", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#edf4ff] text-[#1d3557]">
      <header className="sticky top-0 z-40 border-b border-[#d7e4f5] bg-[#edf4ff]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <button onClick={goHome} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b8d2f5] text-[#183153]"><Trophy size={22}/></span>
            <span><b className="block text-xl font-black tracking-tight">Fan<span className="text-[#5b86c5]">Champ</span></b><small className="text-xs text-slate-500">Футбольная платформа</small></span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {platformNav.map((item) => <button key={item.id} onClick={() => item.id === "home" ? goHome() : setPage("leagues")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${page === item.id || (page === "league" && item.id === "leagues") ? "bg-blue-300/15 text-[#5b86c5]" : "text-slate-500 hover:bg-blue-50 hover:text-[#1d3557]"}`}><item.icon size={17}/>{item.label}</button>)}
          </nav>
          <button className="rounded-lg p-2 text-slate-600 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Открыть меню">{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
        {mobileMenu && <div className="grid gap-1 border-t border-[#d7e4f5] p-3 md:hidden">{platformNav.map((item) => <button key={item.id} onClick={() => { item.id === "home" ? goHome() : setPage("leagues"); setMobileMenu(false); }} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm"><item.icon size={18}/>{item.label}</button>)}</div>}
      </header>

      {page === "home" && <PlatformHome onBrowse={() => setPage("leagues")}/>}
      {page === "leagues" && <LeagueDirectory onOpenLeague={openLeague}/>}
      {page === "league" && activeLeague && (
        <LeaguePage league={activeLeague} tab={leagueTab} setTab={setLeagueTab} onBack={() => setPage("leagues")} nav={leagueNav}/>
      )}

      <footer className="border-t border-[#d7e4f5] px-4 py-7 text-center text-xs text-slate-600">
        FanChamp · Единая платформа любительского футбола
      </footer>
    </div>
  );
}

function PlatformHome({ onBrowse }: { onBrowse: () => void }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 lg:px-8">
    <section className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-br from-[#dceaff] via-[#eaf2ff] to-[#f5f8ff] px-7 py-16 text-center md:px-14 md:py-24">
      <div className="absolute -right-12 -top-16 h-80 w-80 rounded-full border-[42px] border-blue-300/5"/>
      <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl"/>
      <div className="relative mx-auto max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#426b9f]"><span className="h-2 w-2 rounded-full bg-blue-300"/>Футбольная экосистема</div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">Fan<span className="text-[#5b86c5]">Champ</span></h1>
        <p className="mt-5 text-sm leading-7 text-slate-600 md:text-lg">Единая платформа независимых футбольных лиг, команд и игроков.</p>
        <button onClick={onBrowse} className="mt-9 rounded-xl bg-[#b8d2f5] px-8 py-4 text-base font-extrabold text-[#183153] transition hover:bg-[#a6c7f2]">Войти в раздел лиг <ChevronRight className="ml-1 inline" size={19}/></button>
      </div>
    </section>
  </main>;
}
function LeagueDirectory({ onOpenLeague }: { onOpenLeague: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = leagues.filter((league) => league.name.toLowerCase().includes(query.toLowerCase()) || league.city.toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
    <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#5b86c5]">Каталог турниров</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Выбери свою лигу</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Каждая лига — отдельное пространство со своими командами, игроками, матчами и статистикой.</p></div>
    <label className="mb-6 flex max-w-md items-center gap-2 rounded-xl border border-[#d7e4f5] bg-white px-3 py-3"><Search size={17} className="text-slate-500"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию или городу..." className="w-full bg-transparent text-sm outline-none"/></label>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((league) => <LeagueCard key={league.id} league={league} onClick={() => onOpenLeague(league.id)}/>)}</div> : <p className="rounded-2xl border border-[#d7e4f5] bg-white p-8 text-sm text-slate-500">По запросу ничего не найдено.</p>}
  </main>;
}

function LeagueCard({ league, onClick }: { league: typeof mplLeague; onClick: () => void }) {
  return <button onClick={onClick} className="group text-left rounded-2xl border border-[#d7e4f5] bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-[#edf5ff]">
    <div className="flex items-start justify-between gap-3"><ImageBadge src={league.logo} name={league.name} size={54}/><span className="rounded-full border border-blue-200 bg-blue-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#426b9f]">Сезон {league.season}</span></div>
    <h3 className="mt-5 text-xl font-black">{league.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{league.description}</p>
    <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><MapPin size={14}/>{league.city}</span><span className="inline-flex items-center gap-1"><Users size={14}/>{league.teams.length} команд</span></div>
    <div className="mt-6 flex items-center justify-between border-t border-[#d7e4f5] pt-4 text-sm font-bold text-[#5b86c5]"><span>Открыть лигу</span><ChevronRight size={18} className="transition group-hover:translate-x-1"/></div>
  </button>;
}

function LeaguePage({ league, tab, setTab, onBack, nav }: { league: typeof mplLeague; tab: LeagueTab; setTab: (tab: LeagueTab) => void; onBack: () => void; nav: {id:LeagueTab;label:string;icon:React.ElementType}[] }) {
  return <main className="mx-auto max-w-7xl px-4 py-7 lg:px-8 lg:py-10">
    <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1d3557]"><ArrowLeft size={16}/>Все лиги</button>
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-br from-[#dceaff] via-[#eaf2ff] to-[#e8f1ff] p-6 md:p-10">
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[32px] border-blue-300/5"/>
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#426b9f]">Лига · сезон {league.season}</div>
        <div className="mb-4 flex items-center gap-4"><ImageBadge src={league.logo} name={league.name} size={76}/><h1 className="text-3xl font-black leading-tight md:text-5xl">{league.name}</h1></div>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">{league.description} · сезон №{league.seasonNumber}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600"><span className="rounded-xl bg-white/65 px-4 py-2"><MapPin className="mr-2 inline" size={16}/>{league.city} · {league.stadium}</span><span className="rounded-xl bg-white/65 px-4 py-2"><Users className="mr-2 inline" size={16}/>{league.teams.length} команд</span></div>
      </div>
    </section>
    <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">{nav.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === item.id ? "bg-[#b8d2f5] text-[#183153]" : "border border-[#d7e4f5] bg-white text-slate-600 hover:bg-blue-100"}`}><item.icon size={16}/>{item.label}</button>)}</nav>
    {tab === "overview" && <LeagueOverview league={league} setTab={setTab}/>}
    {tab === "table" && <StandingsTable league={league}/>}
    {tab === "matches" && <MatchesPanel league={league}/>}
    {tab === "players" && <PlayersPanel league={league}/>}
    {tab === "teams" && <TeamsPanel league={league}/>}
    <section className="mt-8 rounded-2xl border border-[#d7e4f5] bg-[#f5f9ff] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-sm">Источники данных</b><p className="mt-1 text-xs leading-5 text-slate-500">Источник: MyChamp. Снимок публичных данных; дата последнего обновления источника не указана.</p></div><div className="flex flex-wrap gap-3 text-sm font-bold text-[#5b86c5]"><a href={league.source.matches} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Матчи <ExternalLink size={13}/></a><a href={league.source.statistics} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Статистика <ExternalLink size={13}/></a><a href={league.source.standings} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Таблица источника <ExternalLink size={13}/></a><a href={league.source.main} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">MyChamp <ExternalLink size={13}/></a></div></div>
      <p className="mt-3 border-t border-[#e5edf8] pt-3 text-xs leading-5 text-amber-700">{league.dataNote}</p>
    </section>
  </main>;
}

function LeagueOverview({ league, setTab }: { league: typeof mplLeague; setTab: (tab: LeagueTab) => void }) {
  const leaders = mplScorers.slice(0,5);
  const completed = league.matches.filter((m) => m.homeScore !== null && m.awayScore !== null);
  const latestRound = Math.max(...completed.map((m) => m.round));
  const recent = completed.filter((m) => m.round === latestRound).slice(0,4);
  return <div className="mt-7">
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[[String(league.teams.length),"Команд"],[String(league.matches.length),"Матчей в календаре"],[String(mplScorers.length),"Игроков в статистике"],[String(league.teams[0].points),"Очков у лидера"]].map(([value,label]) => <div key={label} className="rounded-2xl border border-[#d7e4f5] bg-white p-5"><div className="text-3xl font-black text-[#5b86c5]">{value}</div><div className="mt-1 text-xs text-slate-500">{label}</div></div>)}</div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Турнирная таблица</h2><button onClick={() => setTab("table")} className="text-sm font-bold text-[#5b86c5]">Вся таблица →</button></div><StandingsRows league={league} rows={league.teams.slice(0,5)}/></section>
      <section className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Бомбардиры</h2><button onClick={() => setTab("players")} className="text-sm font-bold text-[#5b86c5]">Вся статистика →</button></div><div className="space-y-3">{leaders.map((p,i) => <div key={p.name} className="flex items-center gap-3"><span className="w-5 text-xs font-bold text-slate-500">{i+1}</span><div className="min-w-0 flex-1"><b className="block truncate text-sm">{p.name}</b><span className="block truncate text-xs text-slate-500">{p.team}</span></div><b className="text-lg text-[#5b86c5]">{p.goals}</b></div>)}</div></section>
    </div>
    <section className="mt-5 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Результаты {latestRound}-го тура</h2><button onClick={() => setTab("matches")} className="text-sm font-bold text-[#5b86c5]">Все загруженные матчи →</button></div><div className="grid gap-3 md:grid-cols-2">{recent.map((m,i) => <MatchCard key={i} match={m}/>)}</div></section>
  </div>;
}

function StandingsTable({ league }: { league: typeof mplLeague }) {
  return <section className="mt-7 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><h2 className="text-2xl font-black">Турнирная таблица</h2><p className="mb-6 mt-1 text-sm text-slate-500">Все команды сезона · значения и порядок из официальной таблицы лиги</p><StandingsRows league={league} rows={league.teams}/></section>;
}

function StandingsRows({ league, rows }: { league: typeof mplLeague; rows: readonly typeof mplLeague.teams[number][] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-[#d7e4f5] text-[11px] uppercase tracking-wider text-slate-500"><tr>{["М","Команда","И","В","Н","П","ГЗ","ГП","+/-","О"].map((h,i)=><th key={h} className={`px-3 py-3 ${i>1?"text-center":""}`}>{h}</th>)}</tr></thead><tbody>{rows.map((team) => {const rank = league.teams.findIndex((t) => t.name === team.name)+1; return <tr key={team.name} className={`border-b border-[#e5edf8] last:border-0 ${team.name === "Beamish FC" ? "bg-blue-100" : ""}`}><td className="px-3 py-3 font-bold text-slate-500">{rank}</td><td className="px-3 py-3"><span className="flex items-center gap-3 font-bold"><ImageBadge src={teamLogos[team.name]} name={team.name} size={34}/>{team.name}</span></td><td className="px-3 py-3 text-center">{team.played}</td><td className="px-3 py-3 text-center">{team.wins}</td><td className="px-3 py-3 text-center">{team.draws}</td><td className="px-3 py-3 text-center">{team.losses}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsFor}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsAgainst}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsFor-team.goalsAgainst>0?"+":""}{team.goalsFor-team.goalsAgainst}</td><td className="px-3 py-3 text-center font-black text-[#5b86c5]">{team.points}</td></tr>;})}</tbody></table></div>;
}

function MatchesPanel({ league }: { league: typeof mplLeague }) {
  const expectedMatches = Math.round(league.teams.reduce((sum, team) => sum + team.played, 0) / 2);
  const missingMatches = Math.max(0, expectedMatches - league.matches.length);
  const [round, setRound] = useState("all");
  const rounds = Array.from(new Set(league.matches.map((m) => m.round))).sort((a,b)=>a-b);
  const shown = round === "all" ? league.matches : league.matches.filter((m) => String(m.round) === round);
  return <section className="mt-7 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Матчи и результаты</h2><p className="mt-1 text-sm text-slate-500">В календаре {league.matches.length} матчей · с подтверждённым счётом {league.matches.filter((m) => m.homeScore !== null && m.awayScore !== null).length}</p></div><select value={round} onChange={(e)=>setRound(e.target.value)} className="rounded-xl border border-[#d7e4f5] bg-[#f3f7ff] px-3 py-2 text-sm text-slate-600 outline-none"><option value="all">Все загруженные туры</option>{rounds.map((n)=><option key={n} value={String(n)}>{n}-й тур</option>)}</select></div>
    <div className="mt-6 grid gap-3 md:grid-cols-2">{shown.map((match,i)=><MatchCard key={i} match={match}/>)}</div>
    {missingMatches > 0 && <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-4 text-sm text-amber-800"><b>Архив матчей неполный.</b> Не хватает {missingMatches} результатов относительно числа сыгранных игр в таблице. Я не подставляю выдуманные счета; для завершения импорта нужна сверка с дополнительным источником.</div>}
    <p className="mt-3 text-xs text-slate-500">Показаны только результаты, подтверждённые в текущем наборе данных.</p>
  </section>;
}

function MatchCard({ match }: { match: typeof mplLeague.matches[number] }) {
  return <div className="rounded-xl border border-[#d7e4f5] bg-[#f8fbff] p-4"><div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500"><span>{match.date}</span><span>{match.round}-й тур</span></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm"><span className="flex items-center gap-2"><ImageBadge src={teamLogos[match.home]} name={match.home} size={30}/><b className="leading-5">{match.home}</b></span><span className="rounded-lg bg-blue-50 px-3 py-2 text-base font-black tabular-nums text-[#5b86c5]">{match.homeScore === null || match.awayScore === null ? "— : —" : `${match.homeScore} : ${match.awayScore}`}</span><span className="flex items-center justify-end gap-2"><b className="text-right leading-5">{match.away}</b><ImageBadge src={teamLogos[match.away]} name={match.away} size={30}/></span></div></div>;
}

function PlayersPanel({ league }: { league: typeof mplLeague }) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const filtered = useMemo(() => mplScorers.filter((p) => (p.name.toLowerCase().includes(query.toLowerCase()) || p.team.toLowerCase().includes(query.toLowerCase())) && (team === "all" || p.team === team)), [query, team]);
  return <section className="mt-7 space-y-5">
    <div className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Статистика игроков</h2><p className="mt-1 text-sm text-slate-500">Бомбардиры и ассистенты по данным MyChamp</p></div><span className="rounded-full bg-blue-300/10 px-3 py-1 text-xs font-bold text-[#5b86c5]">{mplScorers.length} игроков</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_240px]"><label className="flex items-center gap-2 rounded-xl border border-[#d7e4f5] bg-white/65 px-3 py-2"><Search size={16} className="text-slate-500"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Поиск игрока или команды..." className="w-full bg-transparent text-sm outline-none"/></label><select value={team} onChange={(e)=>setTeam(e.target.value)} className="rounded-xl border border-[#d7e4f5] bg-[#f3f7ff] px-3 py-2 text-sm outline-none"><option value="all">Все команды</option>{league.teams.map((t)=><option key={t.name} value={t.name}>{t.name}</option>)}</select></div>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-sm"><thead className="border-b border-[#d7e4f5] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Игрок</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">Г</th><th className="px-3 py-3 text-center">П</th><th className="px-3 py-3 text-center">Г+П</th><th className="px-3 py-3 text-center">И</th></tr></thead><tbody>{filtered.map((p,i)=><tr key={p.name} className="border-b border-[#e5edf8] last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-500">{p.team}</td><td className="px-3 py-3 text-center font-black text-[#5b86c5]">{p.goals}</td><td className="px-3 py-3 text-center">{p.assists}</td><td className="px-3 py-3 text-center font-bold">{p.goals+p.assists}</td><td className="px-3 py-3 text-center">{p.appearances}</td></tr>)}</tbody></table>{filtered.length===0&&<p className="p-5 text-sm text-slate-500">Игроки не найдены.</p>}</div>
    </div>
    <div className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><h3 className="flex items-center gap-2 text-xl font-extrabold"><Goal className="text-[#5b86c5]"/>Вратари</h3><p className="mb-5 mt-1 text-sm text-slate-500">Пропущенные мячи и среднее количество за матч</p><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-[#d7e4f5] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Вратарь</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">ПГ</th><th className="px-3 py-3 text-center">И</th><th className="px-3 py-3 text-center">Ср. ПГ</th></tr></thead><tbody>{mplGoalkeepers.map((p,i)=><tr key={p.name} className="border-b border-[#e5edf8] last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-500">{p.team}</td><td className="px-3 py-3 text-center">{p.goalsConceded}</td><td className="px-3 py-3 text-center">{p.matches}</td><td className="px-3 py-3 text-center font-bold text-[#5b86c5]">{p.average.toFixed(2)}</td></tr>)}</tbody></table></div></div>
<div className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><h3 className="flex items-center gap-2 text-xl font-extrabold"><Shield className="text-[#5b86c5]"/>Дисциплинарная статистика</h3><p className="mb-5 mt-1 text-sm text-slate-500">Жёлтые и красные карточки</p><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-[#d7e4f5] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Игрок</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">ЖК</th><th className="px-3 py-3 text-center">КК</th><th className="px-3 py-3 text-center">И</th></tr></thead><tbody>{mplCards.map((p,i)=><tr key={p.name+p.team} className="border-b border-[#e5edf8] last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-500">{p.team}</td><td className="px-3 py-3 text-center text-amber-300">{p.yellow}</td><td className="px-3 py-3 text-center text-red-300">{p.red}</td><td className="px-3 py-3 text-center">{p.matches}</td></tr>)}</tbody></table></div></div>
  </section>;
}

function TeamsPanel({ league }: { league: typeof mplLeague }) {
  const [query, setQuery] = useState("");
  const filtered = league.teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-7 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><h2 className="text-2xl font-black">Команды лиги</h2><p className="mb-5 mt-1 text-sm text-slate-500">Все участники сезона {league.season}</p><label className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-[#d7e4f5] bg-white/65 px-3 py-2"><Search size={17} className="text-slate-500"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Найти команду..." className="w-full bg-transparent text-sm outline-none"/></label><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((t)=><div key={t.name} className="rounded-xl border border-[#d7e4f5] bg-[#f8fbff] p-4"><div className="flex items-center gap-3"><ImageBadge src={teamLogos[t.name]} name={t.name} size={46}/><b className="text-sm">{t.name}</b></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{t.played} игр · {t.wins}В {t.draws}Н {t.losses}П</span><b className="text-base text-[#5b86c5]">{t.points} очк.</b></div><div className="mt-2 text-xs text-slate-500">Мячи: {t.goalsFor}:{t.goalsAgainst}</div></div>)}</div></section>;
}
