# BLUESTONE FEST 2027 – web

Návrh webu pro 3. ročník festivalu (sobota 10. 7. 2027, Kamenice u Prahy, park Dvorská niva).
Čistý statický web (HTML + CSS + JS), bez buildu. Hostuje se na GitHub Pages.

## Co kde upravit
Vše podstatné je nahoře v `main.js` v objektu `CONFIG`:

| Klíč | Co to je |
| --- | --- |
| `ticketUrl` | odkaz na prodej v **Boom Events** – po vyplnění vedou všechna tlačítka „Koupit“ tam |
| `instagram`, `facebook` | odkazy na sociální sítě (prázdné = skryté) |
| `earlyBirdSoldOut` | po vyprodání 200 ks super early bird přepnout na `true` |

Aktuální cenová vlna se zvýrazňuje automaticky podle data (ceník 2027).

## Média 2026
- `assets/video/` – celkové video (720p, ~9 MB) a 4 shorty (720p, 8–9 MB). Originály: OneDrive / HUDBA / Bluestone Fest / Videa 2026; verze nahrané na GitHub: `web-2027-github-videa`
- `assets/foto2026/` – 33 vybraných fotek (plná verze + `-t` náhled). Originály: Foto Bluestone fest 2026
- Nahrává se přes prohlížeč s limitem 10 MB na soubor – proto jsou videa přeenkódovaná pod 10 MB. Pro plnou kvalitu hlavního videa zvážit YouTube embed.

## Zdroje obsahu
- Ceník: `Bluestone Fest Cenik 2027.docx`
- Program: `BLUESTONE Festival 2027 Line Up.pdf` (zdroj pravdy pro časy a kapely)
- Fotky a texty o historii: stávající bluestonefest.cz (ročníky 2025–2026)

## Zbývá doplnit
- [ ] odkaz Boom Events (`ticketUrl` v `main.js`), do té doby formulář „Dej mi vědět“ → Google Apps Script (tabulka + e-mail)
- [ ] popisy a odkazy Piel Canela Marseille, Mikuláš Tichý, akustický host
- [ ] fotky headlinerů 2027 (zatím fotky z minulých ročníků)
- [ ] Google Search Console: ověřit doménu a odeslat `sitemap.xml`

## SEO a technika
- písma jsou hostovaná u nás (`fonts.css`, `assets/fonts/`), ikony v `assets/icons/`
- `robots.txt`, `sitemap.xml` (při změně obsahu aktualizovat `lastmod`), `site.webmanifest`, `404.html`
- strukturovaná data (JSON-LD) v hlavičce `index.html`: MusicEvent s ceníkem, WebSite, FAQPage – FAQ se při úpravě otázek musí upravit i v JSON-LD
- `ochrana-osobnich-udaju.html` – GDPR text k formuláři
- při změně CSS/JS zvednout `?v=` v odkazech, jinak prohlížeče drží starou verzi

## Nasazení (GitHub Pages)
Settings → Pages → Deploy from branch → `main` / root.
Doména bluestonefest.cz (soubor `CNAME`), DNS u Active24: A/AAAA na GitHub Pages, www jako CNAME na fzeman73-jpg.github.io. Pošta zůstává u Active24.
