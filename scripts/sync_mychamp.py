#!/usr/bin/env python3
"""Refresh Moscow Punk Rock League data from public MyChamp pages.

Uses only Python's standard library so it can run in GitHub Actions without
extra dependencies. If MyChamp changes its markup, the job fails safely and
does not overwrite the last known-good data.
"""
from __future__ import annotations

import json
import re
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urljoin
from urllib.request import Request, urlopen

BASE = "https://mychamp.ru"
CHAMPIONSHIP_ID = 202
DEFAULT_SEASON_ID = "7856"
OUT = "Проект для сайта лиг 2026/src/data/mpl-2026-2027.ts"
MONTHS = (
    "января февраля марта апреля мая июня июля августа сентября октября ноября декабря "
    "January February March April May June July August September October November December"
).split()


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.anchors = []
        self.images = []
        self.tables = []
        self.text_parts = []
        self._anchor = None
        self._table_depth = 0
        self._table = None
        self._row = None
        self._cell = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self._anchor = {"href": attrs.get("href", ""), "text": [], "images": []}
        elif tag == "img":
            src = attrs.get("src", "")
            if src:
                self.images.append(src)
                if self._anchor is not None:
                    self._anchor["images"].append(src)
        elif tag == "table":
            self._table_depth += 1
            if self._table_depth == 1:
                self._table = []
        elif tag == "tr" and self._table_depth == 1:
            self._row = []
        elif tag in ("td", "th") and self._table_depth == 1 and self._row is not None:
            self._cell = []

    def handle_endtag(self, tag):
        if tag == "a" and self._anchor is not None:
            self._anchor["text"] = clean(" ".join(self._anchor["text"]))
            self.anchors.append(self._anchor)
            self._anchor = None
        elif tag in ("td", "th") and self._cell is not None and self._row is not None:
            self._row.append(clean(" ".join(self._cell)))
            self._cell = None
        elif tag == "tr" and self._row is not None and self._table is not None:
            if self._row:
                self._table.append(self._row)
            self._row = None
        elif tag == "table" and self._table_depth:
            self._table_depth -= 1
            if self._table_depth == 0 and self._table is not None:
                self.tables.append(self._table)
                self._table = None

    def handle_data(self, data):
        value = clean(data)
        if not value:
            return
        self.text_parts.append(value)
        if self._anchor is not None:
            self._anchor["text"].append(value)
        if self._cell is not None:
            self._cell.append(value)

    @property
    def text(self):
        return clean(" ".join(self.text_parts))


def get_page(url: str) -> tuple[str, PageParser]:
    req = Request(url, headers={
        "User-Agent": "FanChampDataSync/1.0 (+https://github.com/Sir-Yoja/site--dla-liga)",
        "Accept-Language": "ru,en;q=0.8",
    })
    with urlopen(req, timeout=35) as response:
        html = response.read().decode("utf-8", errors="replace")
        final_url = response.geturl()
    parser = PageParser()
    parser.feed(html)
    return final_url, parser


def number(value: str, default=0):
    match = re.search(r"-?\d+(?:[.,]\d+)?", value or "")
    if not match:
        return default
    raw = match.group(0).replace(",", ".")
    return float(raw) if "." in raw else int(raw)


def find_season_id(parser: PageParser) -> str:
    for anchor in parser.anchors:
        href = anchor.get("href", "")
        match = re.search(r"[?&]season=(\d+)", href)
        if match:
            return match.group(1)
    return DEFAULT_SEASON_ID


def extract_logos(parser: PageParser):
    by_href = {}
    for anchor in parser.anchors:
        href = anchor.get("href", "")
        if "/clubs/" in href and anchor.get("images"):
            by_href[href] = urljoin(BASE, anchor["images"][0])
    result = {}
    for anchor in parser.anchors:
        href = anchor.get("href", "")
        name = anchor.get("text", "")
        if "/clubs/" in href and name and href in by_href:
            result[name] = by_href[href]
    league_logo = ""
    for src in parser.images:
        if f"/system/championships/{CHAMPIONSHIP_ID}/" in src:
            league_logo = urljoin(BASE, src)
            break
    return result, league_logo


def extract_standings(parser: PageParser):
    for table in parser.tables:
        for i, row in enumerate(table):
            head = " ".join(row).lower()
            if ("team" in head or "команда" in head) and ("pts" in head or "о" in row) and ("gs" in head or "гз" in head):
                rows = []
                for item in table[i + 1:]:
                    if len(item) < 10:
                        continue
                    if not re.fullmatch(r"\d+", item[0].strip()):
                        continue
                    rows.append({
                        "position": number(item[0]),
                        "name": item[1],
                        "points": number(item[2]),
                        "played": number(item[3]),
                        "wins": number(item[4]),
                        "draws": number(item[5]),
                        "losses": number(item[6]),
                        "goalsFor": number(item[7]),
                        "goalsAgainst": number(item[8]),
                        "goalDifference": number(item[9]),
                    })
                if len(rows) >= 10:
                    return rows
    return []


def date_from_text(text: str, round_no: int) -> str:
    patterns = [
        r"(\d{1,2}\s+(?:" + "|".join(MONTHS) + r")(?:\s+\d{4})?)",
        r"(\d{1,2}\.\d{2}\.\d{4})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            value = match.group(1)
            if re.search(r"\d{4}", value):
                return value
            return value + " 2026"
    return f"Тур {round_no}"


def extract_matches(parser: PageParser, round_no: int):
    anchors = parser.anchors
    matches = []
    for i, anchor in enumerate(anchors):
        href = anchor.get("href", "")
        if not re.search(r"/games/\d+/(?:events|statistic)", href):
            continue
        score_text = anchor.get("text", "")
        score = re.search(r"(\d+)\s*[:：-]\s*(\d+)", score_text)
        if not score:
            continue
        home = None
        away = None
        for before in reversed(anchors[:i]):
            if "/clubs/" in before.get("href", "") and before.get("text"):
                home = before["text"]
                break
        for after in anchors[i + 1:]:
            if "/clubs/" in after.get("href", "") and after.get("text"):
                away = after["text"]
                break
        if not home or not away or home == away:
            continue
        matches.append({
            "round": round_no,
            "date": date_from_text(parser.text, round_no),
            "home": home,
            "away": away,
            "homeScore": number(score.group(1)),
            "awayScore": number(score.group(2)),
            "url": urljoin(BASE, href),
        })
    unique = {}
    for match in matches:
        unique[(match["home"], match["away"], match["homeScore"], match["awayScore"])] = match
    return list(unique.values())


def extract_stats(parser: PageParser):
    scorers, keepers, cards = {}, {}, {}
    for table in parser.tables:
        header_index = None
        kind = None
        for i, row in enumerate(table):
            head = " ".join(row).lower().replace(" ", "")
            if ("player" in head or "игрок" in head) and ("g+a" in head or "г+п" in head):
                header_index, kind = i, "scorers"
                break
            if ("goalkeeper" in head or "вратарь" in head) and ("avg" in head or "ср" in head):
                header_index, kind = i, "keepers"
                break
            if ("player" in head or "игрок" in head) and ("yc" in head or "жк" in head):
                header_index, kind = i, "cards"
                break
        if header_index is None:
            continue
        for row in table[header_index + 1:]:
            if len(row) < 6 or not re.fullmatch(r"\d+", row[0].strip()):
                continue
            name, team = row[1], row[2]
            if not name or not team:
                continue
            key = (name, team)
            if kind == "scorers" and len(row) >= 7:
                scorers[key] = {
                    "name": name, "team": team,
                    "goals": number(row[3]), "assists": number(row[4]),
                    "appearances": number(row[6]),
                }
            elif kind == "keepers" and len(row) >= 6:
                keepers[key] = {
                    "name": name, "team": team,
                    "average": number(row[3]),
                    "goalsConceded": number(row[4]),
                    "matches": number(row[5]),
                }
            elif kind == "cards" and len(row) >= 6:
                cards[key] = {
                    "name": name, "team": team,
                    "yellow": number(row[3]), "red": number(row[4]),
                    "matches": number(row[5]),
                }
    return list(scorers.values()), list(keepers.values()), list(cards.values())


def main():
    profile_url = f"{BASE}/ru/championships/{CHAMPIONSHIP_ID}"
    table_url = f"{BASE}/en/championships/{CHAMPIONSHIP_ID}/show_table"
    stats_url = f"{BASE}/en/championships/{CHAMPIONSHIP_ID}/statistic"

    _, profile = get_page(profile_url)
    season_id = find_season_id(profile)
    _, table_page = get_page(table_url)
    standings = extract_standings(table_page)
    logos, league_logo = extract_logos(table_page)
    if not league_logo:
        logos2, league_logo = extract_logos(profile)
        logos.update(logos2)
    if len(standings) != 14:
        raise RuntimeError(f"Expected 14 teams in MyChamp standings, parsed {len(standings)}")

    matches = []
    for round_no in range(1, 15):
        url = f"{BASE}/en/championships/{CHAMPIONSHIP_ID}/games?round={round_no}&season={season_id}"
        try:
            _, page = get_page(url)
            round_matches = extract_matches(page, round_no)
            matches.extend(round_matches)
        except Exception as exc:
            print(f"Round {round_no}: skipped ({exc})")
        time.sleep(0.25)

    _, stats_page = get_page(stats_url)
    scorers, keepers, cards = extract_stats(stats_page)
    if not matches:
        raise RuntimeError("No match results parsed; refusing to replace existing data")
    if not scorers:
        raise RuntimeError("No scorer statistics parsed; refusing to replace existing data")

    teams = []
    for row in standings:
        name = row["name"]
        teams.append({**row, "logo": logos.get(name, "")})

    data = {
        "id": "moscow-punk-rock-league",
        "name": "Moscow Punk Rock League",
        "shortName": "MPL",
        "description": "Независимая панк-рок футбольная лига Москвы",
        "city": "Москва",
        "stadium": "Стадион «Труд Москва»",
        "season": "2026 / 2027",
        "seasonLabel": "август 2026 — июль 2027",
        "seasonNumber": 16,
        "logo": league_logo,
        "teams": teams,
        "matches": matches,
        "scorers": scorers,
        "goalkeepers": keepers,
        "cards": cards,
        "source": {
            "main": profile_url,
            "matches": f"{BASE}/championships/{CHAMPIONSHIP_ID}/games",
            "statistics": stats_url,
            "standings": table_url,
            "tickets": f"{BASE}/championships/{CHAMPIONSHIP_ID}/tickets",
        },
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "seasonId": season_id,
        "dataNote": "Данные автоматически обновляются из публичных страниц MyChamp. Если источник временно недоступен, сайт сохраняет последний успешный снимок.",
    }

    with open(OUT, "w", encoding="utf-8") as handle:
        handle.write("export const mplLeague = " + json.dumps(data, ensure_ascii=False, indent=2) + " as const;\n")
    print(
        f"Updated {OUT}: {len(teams)} teams, {len(matches)} matches, "
        f"{len(scorers)} scorers, {len(keepers)} goalkeepers, {len(cards)} card records; "
        f"season={season_id}, league_logo={'yes' if league_logo else 'no'}"
    )
    if not all(team["logo"] for team in teams):
        missing = [team["name"] for team in teams if not team["logo"]]
        print("Teams without public logo image: " + ", ".join(missing))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"MyChamp sync failed safely: {error}", file=sys.stderr)
        raise
