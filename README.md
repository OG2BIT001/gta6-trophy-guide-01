[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/OG2BIT001/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/OG2BIT001/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI**
(1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden). It is a static web app:
open it in a desktop browser and it works with the network off. No account, no sync,
no build step.

## What it does

- **Checklist for the whole official list** — every trophy with its exact official name,
  official description and grade, ticked off as you earn it. Progress is saved in your
  browser (localStorage), with a big earned counter and a progress bar in the header.
- **A guide to every trophy in our own words** — what to do, where and how, and when it
  can be missed, shown in the detail pane beside the list. Each guide names its sources.
- **Search and filters** — by text, grade, kind (story, strangers, activities,
  collectibles, crime, secrets, completion), earned status, or missable-only.
- **Progress counters** for the trophies PlayStation tracks a count for (250 stunts,
  42 shooting-range golds, 100 WAiNK scans, $250,000 laundered, and so on).
- **Spoiler setting** — with "Hide spoilers" on, hidden trophies show as *Hidden trophy*
  with no name, description or guide until you tick them as earned.
- **Platinum roadmap** — the 55 trophies ordered into eight stages (story first, then
  strands, activities, collectibles, crime, money, secrets, and the 100% sweep), built
  from the official descriptions, with per-stage progress.
- **Missables view** — exactly one trophy on the list can be permanently missed
  (Positive Mental Attitude, tied to a Chapter 1 event); the view explains why, and why
  chapter-boundary saves are still worth keeping in a game with no mission replay.
- **Export / import** — download your progress as a JSON file and import it back on any
  machine or browser.

## How to run it

- **Just the guide:** open `app/index.html` in a desktop browser, or point any static
  file server at the `app/` folder. Everything it loads lives under `app/`.
- **With the bundled server (Node 22):** `node serve.ts`, then open
  http://localhost:8080 (`node serve.ts --port 9000` for another port).
- **The entry program:** `main.ts` hands the guide in for the bounty — it copies `app/`
  and `screenshots/` to the output directory and writes `dossier.json` with the kit's
  vendored library. Outside the grader: `MAKEFUN_OUTPUT_DIR=out node main.ts`.

## Sources

Trophy names, descriptions and grades are the official PlayStation list, as published
and listed by [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) (the two
agree on every name, description and grade; checked 2026-11-21). The guides are written
for this app in our own words and draw on published guides — chiefly the games.gg and
gamemapa trophy lists and roadmaps and the Push Square guide — cited beside each trophy
in `app/data/trophies.json` and in the app's detail pane. Where a secret trophy's method
was still unconfirmed in launch week, the guide says so instead of inventing steps.
This is a fan-made tool: it uses no Rockstar Games logo, artwork or game screenshots.

## The bounty

This repository is an entry to the make.fun bounty
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) — "Build the best
GTA 6 trophy guide". `vendor/makefun-frontend.ts` is the kit's library, included
unchanged as the bounty requires.

## License

MIT — see `LICENSE`.
