# MEMENTO — Le ore del mare · Vercel V01

Esportazione della demo hospitality mare di Memento Design Studio, preparata il 22 ottobre 2026.

## Deploy su Vercel

1. Estrai lo ZIP. La cartella del progetto deve contenere direttamente `package.json` e `vercel.json`.
2. Carica i contenuti in un repository Git e importalo in Vercel come nuovo progetto.
3. Mantieni la Root Directory sulla cartella che contiene questi due file. Se il repository contiene solo questo progetto, usa `.`.
4. Avvia il deploy. La configurazione è già inclusa.

| Impostazione | Valore |
| --- | --- |
| Framework | Vite |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Variabili obbligatorie per la demo | Nessuna |

In alternativa, dalla cartella estratta puoi usare la CLI Vercel già installata e autenticata: `vercel` crea un deploy di anteprima. Il pacchetto non è associato ad alcun progetto o account Vercel.

Il build genera HTML statico distinto per tutte le 12 pagine e una pagina 404. Camere e servizi hanno già il proprio file HTML, quindi il refresh diretto non richiede un rewrite globale verso la home. `cleanUrls` e `trailingSlash` sono impostati in `vercel.json`.

## Prova locale

Usa Node.js 24 ed esegui, dalla cartella del progetto:

```bash
npm ci
npm run dev
```

Apri l’indirizzo mostrato dal terminale. Per controllare la versione da pubblicare:

```bash
npm test
npm run build
npm run verify
npm run preview
```

La cartella `dist/` inclusa nello ZIP contiene anche la build già pronta. Vercel la rigenera dai sorgenti. Per aprirla in locale usa il server di anteprima: non aprire `index.html` con doppio clic.

## Contenuto del pacchetto

- `src/`: componenti, pagine, movimento, contenuti e percorso di soggiorno.
- `public/`: fotografie WebP utilizzate, marchio, font locali e relative licenze.
- `scripts/`: prerender e verifiche del sito statico.
- `tests/`: validazione del soggiorno e adapter per la ricezione delle richieste.
- `dist/`: build statica verificata.
- `docs/`: specifica di design, revisioni e limiti delle verifiche precedenti.
- `source-media/`: tracciamento delle immagini concept.
- `EXPORT_QA.json`: esito dei controlli di questa esportazione.

Dipendenze fissate nel lockfile. Nessuna dipendenza da Sites per eseguire o pubblicare il sito. File di autenticazione, Git, `node_modules` e collegamenti ad account di hosting non sono inclusi.

## Booking e materiali

La demo conserva le tre interazioni: arrivo con scroll nativo, selettore delle camere e cambio fotografico fra mattino, pomeriggio e ultima luce. Il percorso di soggiorno permette di scegliere date, ospiti e camera, poi copiare o scaricare il riepilogo.

Il booking reale non è configurato. Per attivarlo, modifica `src/booking/config.ts` con l’URL ufficiale autorizzato o con endpoint e destinatario reali. Il contratto del POST e della ricevuta è descritto in `docs/UX_REVIEW.md`. Nessuna disponibilità o conferma di prenotazione viene simulata.

Le fotografie e l’hotel sono concept. Prima dell’uso per una struttura reale vanno sostituiti con materiali e informazioni autorizzati. L’anteprima mantiene `noindex,nofollow` e `robots.txt` che impedisce l’indicizzazione. Rimuovili solo quando contenuti e identità saranno definitivi.

Facoltativamente imposta `SITE_URL` sul dominio finale completo, ad esempio `https://tuo-dominio.it`, per l’immagine di condivisione. In Vercel viene altrimenti usato `VERCEL_URL`; nella build locale il percorso dell’immagine resta relativo al sito.

## Verifiche e provenienza

Versione sorgente: `965ec9de854da744b27bcd4cf5badbc8e272fec4`.
Demo di riferimento: https://memento-mare-editorial.memento-studio.chatgpt.site

Questa esportazione aggiunge la configurazione Vercel, fissa Node 24 e le versioni dei tipi React, rende portabile l’immagine Open Graph ed esclude le immagini precedenti inutilizzate. Il design e le interazioni della demo sono conservati.

I controlli di esportazione comprendono installazione pulita, TypeScript, build, 15 test e audit di pagine, link, immagini e riferimenti ARIA. Non è stato effettuato un deploy su un account Vercel né una nuova verifica visuale in browser. Restano validi i limiti visuali registrati in `docs/EDITORIAL_QA.md`.

Documentazione di riferimento:
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
