# BLUESTONE FEST 2027 – web

Návrh webu pro 3. ročník festivalu (sobota 10. 7. 2027, Kamenice u Prahy, park Dvorská niva).
Čistý statický web (HTML + CSS + JS), bez buildu. Hostuje se na GitHub Pages.

## Co kde upravit
Vše podstatné je nahoře v `main.js` v objektu `CONFIG`:

| Klíč | Co to je |
| --- | --- |
| `ticketUrl` | odkaz na prodej v **Boom Events** – po vyplnění vedou všechna tlačítka „Koupit“ tam |
| `instagram`, `facebook` | odkazy na sociální sítě (prázdné = skryté) |
| `video` | YouTube ID nebo cesta k MP4 v `assets/video/` – nahradí placeholder v galerii |
| `earlyBirdSoldOut` | po vyprodání 200 ks super early bird přepnout na `true` |

Aktuální cenová vlna se zvýrazňuje automaticky podle data (ceník 2027).

## Zdroje obsahu
- Ceník: `Bluestone Fest Cenik 2027.docx`
- Program: `BLUESTONE Festival 2027 Line Up.pdf` (zdroj pravdy pro časy a kapely)
- Fotky a texty o historii: stávající bluestonefest.cz (ročníky 2025–2026)

## Zbývá doplnit
- [ ] odkaz Boom Events
- [ ] videa z 2026
- [ ] popisy Piel Canela Marseille, Pan Lynx, akustický host
- [ ] fotky headlinerů 2027 (zatím fotky z minulých ročníků)
- [ ] Instagram/Facebook, stránka ochrany osobních údajů
- [ ] nová mapa areálu 2027
- [ ] přepnutí domény bluestonefest.cz (soubor `CNAME` + DNS)

## Nasazení (GitHub Pages)
Settings → Pages → Deploy from branch → `main` / root.
Doména: přidat soubor `CNAME` s textem `bluestonefest.cz` a u registrátora nastavit DNS na GitHub Pages.
