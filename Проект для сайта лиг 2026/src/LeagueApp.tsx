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
const leagueLogo = "https://mychamp.ru/system/championships/202/large.jpg";
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
  const [failed, setFailed] = useState(false);
  return <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[.06]">
    {src && !failed
      ? <img src={src} alt={name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-contain p-1" onError={() => setFailed(true)}/>
      : <span className="text-[10px] font-black text-emerald-200">{name.split(/\s+/).slice(0,2).map(x => x[0]).join("").slice(0,3).toUpperCase()}</span>}
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
    <div className="min-h-screen bg-[#090f0d] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090f0d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <button onClick={goHome} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-[#07110c]"><Trophy size={22}/></span>
            <span><b className="block text-xl font-black tracking-tight">Fan<span className="text-emerald-300">Champ</span></b><small className="text-xs text-slate-400">Футбольная платформа</small></span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {platformNav.map((item) => <button key={item.id} onClick={() => item.id === "home" ? goHome() : setPage("leagues")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${page === item.id || (page === "league" && item.id === "leagues") ? "bg-emerald-400/15 text-emerald-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><item.icon size={17}/>{item.label}</button>)}
          </nav>
          <button className="rounded-lg p-2 text-slate-300 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Открыть меню">{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
        {mobileMenu && <div className="grid gap-1 border-t border-white/10 p-3 md:hidden">{platformNav.map((item) => <button key={item.id} onClick={() => { item.id === "home" ? goHome() : setPage("leagues"); setMobileMenu(false); }} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm"><item.icon size={18}/>{item.label}</button>)}</div>}
      </header>

      {page === "home" && <PlatformHome onBrowse={() => setPage("leagues")}/>}
      {page === "leagues" && <LeagueDirectory onOpenLeague={openLeague}/>}
      {page === "league" && activeLeague && (
        <LeaguePage league={activeLeague} tab={leagueTab} setTab={setLeagueTab} onBack={() => setPage("leagues")} nav={leagueNav}/>
      )}

      <footer className="border-t border-white/10 px-4 py-7 text-center text-xs text-slate-600">
        FanChamp · Единая платформа любительского футбола
      </footer>
    </div>
  );
}

function PlatformHome({ onBrowse }: { onBrowse: () => void }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 lg:px-8">
    <section className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-gradient-to-br from-[#123b2b] via-[#10251f] to-[#111917] px-7 py-16 text-center md:px-14 md:py-24">
      <div className="absolute -right-12 -top-16 h-80 w-80 rounded-full border-[42px] border-emerald-300/5"/>
      <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"/>
      <div className="relative mx-auto max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-400"/>Футбольная экосистема</div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">Fan<span className="text-emerald-300">Champ</span></h1>
        <p className="mt-5 text-sm leading-7 text-slate-300 md:text-lg">Единая платформа независимых футбольных лиг, команд и игроков.</p>
        <button onClick={onBrowse} className="mt-9 rounded-xl bg-emerald-400 px-8 py-4 text-base font-extrabold text-[#07110c] transition hover:bg-emerald-300">Войти в раздел лиг <ChevronRight className="ml-1 inline" size={19}/></button>
      </div>
    </section>
  </main>;
}
function LeagueDirectory({ onOpenLeague }: { onOpenLeague: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = leagues.filter((league) => league.name.toLowerCase().includes(query.toLowerCase()) || league.city.toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
    <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Каталог турниров</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Выбери свою лигу</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Каждая лига — отдельное пространство со своими командами, игроками, матчами и статистикой.</p></div>
    <label className="mb-6 flex max-w-md items-center gap-2 rounded-xl border border-white/10 bg-[#121a18] px-3 py-3"><Search size={17} className="text-slate-500"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию или городу..." className="w-full bg-transparent text-sm outline-none"/></label>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((league) => <LeagueCard key={league.id} league={league} onClick={() => onOpenLeague(league.id)}/>)}</div> : <p className="rounded-2xl border border-white/10 bg-[#121a18] p-8 text-sm text-slate-400">По запросу ничего не найдено.</p>}
  </main>;
}

function LeagueCard({ league, onClick }: { league: typeof mplLeague; onClick: () => void }) {
  return <button onClick={onClick} className="group text-left rounded-2xl border border-white/10 bg-[#121a18] p-5 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-[#15221d]">
    <div className="flex items-start justify-between gap-3"><ImageBadge src={league.logo} name={league.name} size={54}/><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">Сезон {league.season}</span></div>
    <h3 className="mt-5 text-xl font-black">{league.name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{league.description}</p>
    <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400"><span className="inline-flex items-center gap-1"><MapPin size={14}/>{league.city}</span><span className="inline-flex items-center gap-1"><Users size={14}/>{league.teams.length} команд</span></div>
    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-bold text-emerald-300"><span>Открыть лигу</span><ChevronRight size={18} className="transition group-hover:translate-x-1"/></div>
  </button>;
}

function LeaguePage({ league, tab, setTab, onBack, nav }: { league: typeof mplLeague; tab: LeagueTab; setTab: (tab: LeagueTab) => void; onBack: () => void; nav: {id:LeagueTab;label:string;icon:React.ElementType}[] }) {
  return <main className="mx-auto max-w-7xl px-4 py-7 lg:px-8 lg:py-10">
    <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"><ArrowLeft size={16}/>Все лиги</button>
    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-gradient-to-br from-[#123b2b] via-[#10251f] to-[#151b1a] p-6 md:p-10">
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[32px] border-emerald-300/5"/>
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200">Лига · сезон {league.season}</div>
        <div className="mb-4 flex items-center gap-4"><ImageBadge src={league.logo} name={league.name} size={76}/><h1 className="text-3xl font-black leading-tight md:text-5xl">{league.name}</h1></div>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">{league.description} · сезон №{league.seasonNumber}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200"><span className="rounded-xl bg-black/20 px-4 py-2"><MapPin className="mr-2 inline" size={16}/>{league.city} · {league.stadium}</span><span className="rounded-xl bg-black/20 px-4 py-2"><Users className="mr-2 inline" size={16}/>{league.teams.length} команд</span></div>
      </div>
    </section>
    <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">{nav.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === item.id ? "bg-emerald-400 text-[#07110c]" : "border border-white/10 bg-[#121a18] text-slate-300 hover:bg-white/10"}`}><item.icon size={16}/>{item.label}</button>)}</nav>
    {tab === "overview" && <LeagueOverview league={league} setTab={setTab}/>}
    {tab === "table" && <StandingsTable league={league}/>}
    {tab === "matches" && <MatchesPanel league={league}/>}
    {tab === "players" && <PlayersPanel league={league}/>}
    {tab === "teams" && <TeamsPanel league={league}/>}
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#101715] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><b className="text-sm">Источники данных</b><p className="mt-1 text-xs leading-5 text-slate-500">Источник: MyChamp. Снимок публичных данных; дата последнего обновления источника не указана.</p></div><div className="flex flex-wrap gap-3 text-sm font-bold text-emerald-300"><a href={league.source.matches} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Матчи <ExternalLink size={13}/></a><a href={league.source.statistics} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Статистика <ExternalLink size={13}/></a><a href={league.source.standings} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Таблица источника <ExternalLink size={13}/></a><a href={league.source.main} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">MyChamp <ExternalLink size={13}/></a></div></div>
      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-5 text-amber-200/80">{league.dataNote}</p>
    </section>
  </main>;
}

function LeagueOverview({ league, setTab }: { league: typeof mplLeague; setTab: (tab: LeagueTab) => void }) {
  const expectedMatches = Math.round(league.teams.reduce((sum, team) => sum + team.played, 0) / 2);
  const leaders = mplScorers.slice(0,5);
  const latestRound = Math.max(...league.matches.map((m) => m.round));
  const recent = league.matches.filter((m) => m.round === latestRound).slice(0,4);
  return <div className="mt-7">
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[[String(league.teams.length),"Команд"],[`${league.matches.length} / ${expectedMatches}`,"Матчей в архиве / по таблице"],[String(mplScorers.length),"Игроков в статистике"],[String(league.teams[0].points),"Очков у лидера"]].map(([value,label]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#121a18] p-5"><div className="text-3xl font-black text-emerald-300">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div></div>)}</div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Турнирная таблица</h2><button onClick={() => setTab("table")} className="text-sm font-bold text-emerald-300">Вся таблица →</button></div><StandingsRows league={league} rows={league.teams.slice(0,5)}/></section>
      <section className="rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Бомбардиры</h2><button onClick={() => setTab("players")} className="text-sm font-bold text-emerald-300">Вся статистика →</button></div><div className="space-y-3">{leaders.map((p,i) => <div key={p.name} className="flex items-center gap-3"><span className="w-5 text-xs font-bold text-slate-500">{i+1}</span><div className="min-w-0 flex-1"><b className="block truncate text-sm">{p.name}</b><span className="block truncate text-xs text-slate-500">{p.team}</span></div><b className="text-lg text-emerald-300">{p.goals}</b></div>)}</div></section>
    </div>
    <section className="mt-5 rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">Результаты {latestRound}-го тура</h2><button onClick={() => setTab("matches")} className="text-sm font-bold text-emerald-300">Все загруженные матчи →</button></div><div className="grid gap-3 md:grid-cols-2">{recent.map((m,i) => <MatchCard key={i} match={m}/>)}</div></section>
  </div>;
}

function StandingsTable({ league }: { league: typeof mplLeague }) {
  return <section className="mt-7 rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><h2 className="text-2xl font-black">Турнирная таблица</h2><p className="mb-6 mt-1 text-sm text-slate-400">Все команды сезона · значения и порядок из официальной таблицы лиги</p><StandingsRows league={league} rows={league.teams}/></section>;
}

function StandingsRows({ league, rows }: { league: typeof mplLeague; rows: readonly typeof mplLeague.teams[number][] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><tr>{["М","Команда","И","В","Н","П","ГЗ","ГП","+/-","О"].map((h,i)=><th key={h} className={`px-3 py-3 ${i>1?"text-center":""}`}>{h}</th>)}</tr></thead><tbody>{rows.map((team) => {const rank = league.teams.findIndex((t) => t.name === team.name)+1; return <tr key={team.name} className={`border-b border-white/5 last:border-0 ${team.name === "Beamish FC" ? "bg-emerald-400/[.07]" : ""}`}><td className="px-3 py-3 font-bold text-slate-500">{rank}</td><td className="px-3 py-3"><span className="flex items-center gap-3 font-bold"><ImageBadge src={teamLogos[team.name]} name={team.name} size={34}/>{team.name}{team.name==="Beamish FC"&&<span className="ml-2 rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-black text-emerald-300">BEAMISH</span>}</span></td><td className="px-3 py-3 text-center">{team.played}</td><td className="px-3 py-3 text-center">{team.wins}</td><td className="px-3 py-3 text-center">{team.draws}</td><td className="px-3 py-3 text-center">{team.losses}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsFor}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsAgainst}</td><td className="px-3 py-3 text-center tabular-nums">{team.goalsFor-team.goalsAgainst>0?"+":""}{team.goalsFor-team.goalsAgainst}</td><td className="px-3 py-3 text-center font-black text-emerald-300">{team.points}</td></tr>;})}</tbody></table></div>;
}

function MatchesPanel({ league }: { league: typeof mplLeague }) {
  const expectedMatches = Math.round(league.teams.reduce((sum, team) => sum + team.played, 0) / 2);
  const missingMatches = Math.max(0, expectedMatches - league.matches.length);
  const [round, setRound] = useState("all");
  const rounds = Array.from(new Set(league.matches.map((m) => m.round))).sort((a,b)=>a-b);
  const shown = round === "all" ? league.matches : league.matches.filter((m) => String(m.round) === round);
  return <section className="mt-7 rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Матчи и результаты</h2><p className="mt-1 text-sm text-slate-400">Загружено {league.matches.length} из {expectedMatches} матчей, соответствующих числу игр в таблице</p></div><select value={round} onChange={(e)=>setRound(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1210] px-3 py-2 text-sm text-slate-200 outline-none"><option value="all">Все загруженные туры</option>{rounds.map((n)=><option key={n} value={String(n)}>{n}-й тур</option>)}</select></div>
    <div className="mt-6 grid gap-3 md:grid-cols-2">{shown.map((match,i)=><MatchCard key={i} match={match}/>)}</div>
    {missingMatches > 0 && <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-4 text-sm text-amber-100"><b>Архив матчей неполный.</b> Не хватает {missingMatches} результатов относительно числа сыгранных игр в таблице. Я не подставляю выдуманные счета; для завершения импорта нужна сверка с дополнительным источником.</div>}
    <p className="mt-3 text-xs text-slate-500">Показаны только результаты, подтверждённые в текущем наборе данных.</p>
  </section>;
}

function MatchCard({ match }: { match: typeof mplLeague.matches[number] }) {
  return <div className="rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500"><span>{match.date}</span><span>{match.round}-й тур</span></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm"><span className="flex items-center gap-2"><ImageBadge src={teamLogos[match.home]} name={match.home} size={30}/><b className="leading-5">{match.home}</b></span><span className="rounded-lg bg-black/30 px-3 py-2 text-base font-black tabular-nums text-emerald-300">{match.homeScore} : {match.awayScore}</span><span className="flex items-center justify-end gap-2"><b className="text-right leading-5">{match.away}</b><ImageBadge src={teamLogos[match.away]} name={match.away} size={30}/></span></div></div>;
}

function PlayersPanel({ league }: { league: typeof mplLeague }) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const filtered = useMemo(() => mplScorers.filter((p) => (p.name.toLowerCase().includes(query.toLowerCase()) || p.team.toLowerCase().includes(query.toLowerCase())) && (team === "all" || p.team === team)), [query, team]);
  return <section className="mt-7 space-y-5">
    <div className="rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Статистика игроков</h2><p className="mt-1 text-sm text-slate-400">Бомбардиры и ассистенты по данным MyChamp</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">{mplScorers.length} игроков</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_240px]"><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search size={16} className="text-slate-500"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Поиск игрока или команды..." className="w-full bg-transparent text-sm outline-none"/></label><select value={team} onChange={(e)=>setTeam(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1210] px-3 py-2 text-sm outline-none"><option value="all">Все команды</option>{league.teams.map((t)=><option key={t.name} value={t.name}>{t.name}</option>)}</select></div>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Игрок</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">Г</th><th className="px-3 py-3 text-center">П</th><th className="px-3 py-3 text-center">Г+П</th><th className="px-3 py-3 text-center">И</th></tr></thead><tbody>{filtered.map((p,i)=><tr key={p.name} className="border-b border-white/5 last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-400">{p.team}</td><td className="px-3 py-3 text-center font-black text-emerald-300">{p.goals}</td><td className="px-3 py-3 text-center">{p.assists}</td><td className="px-3 py-3 text-center font-bold">{p.goals+p.assists}</td><td className="px-3 py-3 text-center">{p.appearances}</td></tr>)}</tbody></table>{filtered.length===0&&<p className="p-5 text-sm text-slate-400">Игроки не найдены.</p>}</div>
    </div>
    <div className="rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><h3 className="flex items-center gap-2 text-xl font-extrabold"><Goal className="text-emerald-300"/>Вратари</h3><p className="mb-5 mt-1 text-sm text-slate-400">Пропущенные мячи и среднее количество за матч</p><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Вратарь</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">ПГ</th><th className="px-3 py-3 text-center">И</th><th className="px-3 py-3 text-center">Ср. ПГ</th></tr></thead><tbody>{mplGoalkeepers.map((p,i)=><tr key={p.name} className="border-b border-white/5 last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-400">{p.team}</td><td className="px-3 py-3 text-center">{p.goalsConceded}</td><td className="px-3 py-3 text-center">{p.matches}</td><td className="px-3 py-3 text-center font-bold text-emerald-300">{p.average.toFixed(2)}</td></tr>)}</tbody></table></div></div>
<div className="rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><h3 className="flex items-center gap-2 text-xl font-extrabold"><Shield className="text-emerald-300"/>Дисциплинарная статистика</h3><p className="mb-5 mt-1 text-sm text-slate-400">Жёлтые и красные карточки</p><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Игрок</th><th className="px-3 py-3">Команда</th><th className="px-3 py-3 text-center">ЖК</th><th className="px-3 py-3 text-center">КК</th><th className="px-3 py-3 text-center">И</th></tr></thead><tbody>{mplCards.map((p,i)=><tr key={p.name+p.team} className="border-b border-white/5 last:border-0"><td className="px-3 py-3 text-slate-500">{i+1}</td><td className="px-3 py-3 font-bold">{p.name}</td><td className="px-3 py-3 text-slate-400">{p.team}</td><td className="px-3 py-3 text-center text-amber-300">{p.yellow}</td><td className="px-3 py-3 text-center text-red-300">{p.red}</td><td className="px-3 py-3 text-center">{p.matches}</td></tr>)}</tbody></table></div></div>
  </section>;
}

function TeamsPanel({ league }: { league: typeof mplLeague }) {
  const [query, setQuery] = useState("");
  const filtered = league.teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-7 rounded-2xl border border-white/10 bg-[#121a18] p-5 md:p-7"><h2 className="text-2xl font-black">Команды лиги</h2><p className="mb-5 mt-1 text-sm text-slate-400">Все участники сезона {league.season}</p><label className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search size={17} className="text-slate-500"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Найти команду..." className="w-full bg-transparent text-sm outline-none"/></label><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((t)=><div key={t.name} className="rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="flex items-center gap-3"><ImageBadge src={teamLogos[t.name]} name={t.name} size={46}/><b className="text-sm">{t.name}</b></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{t.played} игр · {t.wins}В {t.draws}Н {t.losses}П</span><b className="text-base text-emerald-300">{t.points} очк.</b></div><div className="mt-2 text-xs text-slate-500">Мячи: {t.goalsFor}:{t.goalsAgainst}</div></div>)}</div></section>;
}
