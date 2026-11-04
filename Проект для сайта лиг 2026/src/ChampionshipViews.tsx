import React, { useMemo, useState } from "react";
import { ArrowLeft, Grid3X3, CalendarDays } from "lucide-react";
import { mplLeague } from "./data/mpl-2026-2027";

type League = typeof mplLeague;
type Match = League["matches"][number];
type Props = { league: League; teamLogos: Record<string,string>; onSelectMatch: (match: Match) => void };

const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
export function parseMatchDate(value: string) {
  const parts = value.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
  if (!parts) return new Date(0);
  const month = months.indexOf(parts[2].toLowerCase());
  return new Date(Number(parts[3]), Math.max(0, month), Number(parts[1]));
}
function shortDate(value: string) {
  const date = parseMatchDate(value);
  return date.getTime() ? date.toLocaleDateString("ru-RU", {day:"2-digit",month:"2-digit"}) : value;
}
function Logo({ name, logos, size=30 }: {name:string;logos:Record<string,string>;size?:number}) {
  const [failed,setFailed] = useState(false);
  const src = logos[name];
  return <span style={{width:size,height:size}} className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#d7e4f5] bg-[#f0f6ff]">
    {src && !failed ? <img src={src} alt={name} loading="lazy" className="h-full w-full object-contain p-1" onError={()=>setFailed(true)}/> : <span className="text-[9px] font-black text-[#426b9f]">{name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}</span>}
  </span>;
}
function ScoreCard({match,logos,onSelect}:{match:Match;logos:Record<string,string>;onSelect:(match:Match)=>void}) {
  const completed = match.homeScore !== null && match.awayScore !== null;
  const past = parseMatchDate(match.date).getTime() < new Date().setHours(0,0,0,0);
  const status = completed ? "Завершён" : past ? "Результат не внесён" : "Предстоящий";
  return <button onClick={()=>onSelect(match)} className="w-full rounded-xl border border-[#d7e4f5] bg-[#f8fbff] p-4 text-left transition hover:border-[#83aee8] hover:bg-[#f0f6ff]">
    <div className="mb-3 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500"><span>{match.date} · {match.round}-й тур</span><span className="rounded-full bg-blue-100 px-2 py-1 normal-case tracking-normal text-[#426b9f]">{status}</span></div>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
      <span className="flex items-center gap-2"><Logo name={match.home} logos={logos}/><b className="leading-5">{match.home}</b></span>
      <span className="rounded-lg bg-blue-50 px-3 py-2 text-base font-black tabular-nums text-[#5b86c5]">{completed ? match.homeScore+" : "+match.awayScore : "— : —"}</span>
      <span className="flex items-center justify-end gap-2"><b className="text-right leading-5">{match.away}</b><Logo name={match.away} logos={logos}/></span>
    </div>
    <div className="mt-3 text-right text-xs font-bold text-[#5b86c5]">Карточка матча →</div>
  </button>;
}

export function ChessboardPanel({league,teamLogos,onSelectMatch}:Props) {
  const teams = league.teams;
  const matchMap = useMemo(()=>{
    const map = new Map<string,Match>();
    league.matches.forEach(m=>{map.set(m.home+"|"+m.away,m);map.set(m.away+"|"+m.home,m);});
    return map;
  },[league.matches]);
  return <section className="mt-7 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7">
    <div className="mb-5 flex items-center gap-3"><Grid3X3 className="text-[#5b86c5]"/><div><h2 className="text-2xl font-black">Шахматка чемпионата</h2><p className="mt-1 text-sm text-slate-500">Все личные встречи команд. Нажми на ячейку, чтобы открыть карточку матча.</p></div></div>
    <div className="overflow-x-auto"><table className="min-w-[1050px] border-separate border-spacing-0 text-center text-xs">
      <thead><tr><th className="sticky left-0 z-20 min-w-[190px] border-b border-r border-[#d7e4f5] bg-[#f5f9ff] p-2 text-left">Команда</th>{teams.map((t,i)=><th key={t.name} className="min-w-[62px] border-b border-[#d7e4f5] bg-[#f5f9ff] p-2"><span className="block text-slate-400">{i+1}</span><span className="block max-w-[60px] truncate" title={t.name}>{t.name}</span></th>)}</tr></thead>
      <tbody>{teams.map((team,i)=><tr key={team.name}><th className="sticky left-0 z-10 border-b border-r border-[#e5edf8] bg-white p-2 text-left"><span className="flex items-center gap-2"><Logo name={team.name} logos={teamLogos} size={25}/><span className="max-w-[145px] truncate">{team.name}</span></span></th>
        {teams.map((opponent,j)=>{
          if(i===j)return <td key={opponent.name} className="border-b border-[#e5edf8] bg-slate-50 p-2 text-slate-300">—</td>;
          const match=matchMap.get(team.name+"|"+opponent.name);
          if(!match)return <td key={opponent.name} className="border-b border-[#e5edf8] p-2 text-slate-300">—</td>;
          const home=match.home===team.name;
          const score=match.homeScore===null||match.awayScore===null?null:(home?match.homeScore+":"+match.awayScore:match.awayScore+":"+match.homeScore);
          return <td key={opponent.name} className="border-b border-[#e5edf8] p-1"><button onClick={()=>onSelectMatch(match)} title={team.name+" — "+opponent.name+" · "+match.date} className={"w-full rounded-md px-1 py-2 font-bold transition hover:bg-blue-100 "+(score?"text-[#315f9b]":"text-slate-500")}>{score||shortDate(match.date)}</button></td>;
        })}</tr>)}</tbody>
    </table></div>
    <p className="mt-3 text-xs text-slate-500">Счёт показан с точки зрения команды в строке. Дата означает, что результат ещё не внесён или встреча запланирована.</p>
  </section>;
}

export function CalendarPanel({league,teamLogos,onSelectMatch}:Props) {
  const [mode,setMode]=useState<"round"|"date">("round");
  const sorted=useMemo(()=>league.matches.slice().sort((a,b)=>parseMatchDate(a.date).getTime()-parseMatchDate(b.date).getTime()||a.round-b.round),[league.matches]);
  const groups = useMemo(()=>{
    const map=new Map<string,Match[]>();
    sorted.forEach(m=>{const key=mode==="round" ? String(m.round) : m.date;map.set(key,[...(map.get(key)||[]),m]);});
    return Array.from(map.entries()).map(([key,matches])=>({title:mode==="round"?key+"-й тур · "+(matches[0]?.date||""):key,matches}));
  },[sorted,mode]);
  return <section className="mt-7 space-y-5">
    <div className="rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div className="flex items-center gap-3"><CalendarDays className="text-[#5b86c5]"/><div><h2 className="text-2xl font-black">Календарь чемпионата</h2><p className="mt-1 text-sm text-slate-500">{league.matches.length} матчей · {new Set(league.matches.map(m=>m.round)).size} туров</p></div></div><div className="flex gap-2"><button onClick={()=>setMode("round")} className={"rounded-lg px-3 py-2 text-sm font-bold "+(mode==="round"?"bg-[#b8d2f5] text-[#183153]":"border border-[#d7e4f5]")}>По турам</button><button onClick={()=>setMode("date")} className={"rounded-lg px-3 py-2 text-sm font-bold "+(mode==="date"?"bg-[#b8d2f5] text-[#183153]":"border border-[#d7e4f5]")}>По датам</button></div></div></div>
    {groups.map(group=><section key={group.title} className="rounded-2xl border border-[#d7e4f5] bg-white p-5"><h3 className="mb-4 text-lg font-black">{group.title}</h3><div className="grid gap-3 md:grid-cols-2">{group.matches.map(m=><ScoreCard key={m.round+"-"+m.home+"-"+m.away} match={m} logos={teamLogos} onSelect={onSelectMatch}/>)}</div></section>)}
  </section>;
}

export function MatchDetails({league,match,teamLogos,onBack}:{league:League;match:Match;teamLogos:Record<string,string>;onBack:()=>void}) {
  const completed=match.homeScore!==null&&match.awayScore!==null;
  const past=parseMatchDate(match.date).getTime()<new Date().setHours(0,0,0,0);
  return <section className="mt-7 rounded-2xl border border-[#d7e4f5] bg-white p-5 md:p-8">
    <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#5b86c5]"><ArrowLeft size={16}/>Назад к разделу</button>
    <div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-[#5b86c5]">{match.round}-й тур · {match.date}</p><h2 className="mt-2 text-2xl font-black md:text-3xl">Карточка матча</h2></div>
    <div className="mx-auto mt-7 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8"><div className="flex flex-col items-center gap-3 text-center"><Logo name={match.home} logos={teamLogos} size={72}/><b className="text-sm md:text-lg">{match.home}</b></div><div className="rounded-2xl bg-[#edf4ff] px-4 py-3 text-2xl font-black tabular-nums text-[#426b9f] md:px-7 md:text-4xl">{completed?match.homeScore+" : "+match.awayScore:"— : —"}</div><div className="flex flex-col items-center gap-3 text-center"><Logo name={match.away} logos={teamLogos} size={72}/><b className="text-sm md:text-lg">{match.away}</b></div></div>
    <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[#f5f9ff] p-4 text-center"><div className="text-xs text-slate-500">Дата</div><b className="mt-1 block">{match.date}</b></div><div className="rounded-xl bg-[#f5f9ff] p-4 text-center"><div className="text-xs text-slate-500">Стадион</div><b className="mt-1 block">{league.stadium}</b></div><div className="rounded-xl bg-[#f5f9ff] p-4 text-center"><div className="text-xs text-slate-500">Статус</div><b className="mt-1 block">{completed?"Завершён":past?"Результат не внесён":"Предстоящий"}</b></div></div>
    <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-dashed border-[#cbdcf1] p-4 text-sm text-slate-500"><b className="text-[#1d3557]">Протокол матча</b><p className="mt-1">Составы, авторы голов, передачи, карточки и судейская информация появятся после подключения подробного протокола и статистики матча.</p></div>
  </section>;
}
