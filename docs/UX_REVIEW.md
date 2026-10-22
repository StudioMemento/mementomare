# Le ore del mare — percorso di soggiorno

## Esame dello stato precedente

La versione di partenza usava tre grandi card «che estate ti va», un modulo a tre passaggi, selezione degli interessi, una cartolina e ampi elementi illustrativi. L’utente poteva leggere «prenotazione» senza arrivare a un vero invio: non esistono struttura, recapito o booking engine autorizzati. I microtesti da 8–10 px e i numerosi controlli decorativi rallentavano il compito pratico.

## Modifiche implementate

- Invito al soggiorno orizzontale con date e ospiti già presenti nello stato. Un’unica azione primaria.
- Modulo in due passaggi: date/ospiti/preferenza camera, poi riepilogo. La camera selezionata dall’esploratore passa al modulo tramite il contratto UIContext esistente.
- Controlli date e select nativi, etichette permanenti, messaggi specifici, focus sul primo errore e sul titolo al cambio di passaggio.
- Dialogo nativo: Esc, focus contenuto e restituzione del focus sono gestiti dal Modal condiviso. Il pulsante di chiusura resta fuori dall’area interna che scorre.
- Su telefono il pannello fotografico secondario scompare: il modulo usa tutta la larghezza disponibile senza CTA sovrapposte. A 320 px le date si impilano.
- Nessun campo per nome/email/note personali compare con configurazione vuota. Il piano può essere copiato o scaricato come testo; ogni esito dice esplicitamente che non è stato inviato.
- Se la clipboard è indisponibile o negata, viene mostrata una textarea selezionabile e resta disponibile il download.
- Nessuna dipendenza nuova. Palette, fotografie, Manrope e Cormorant esistenti. Nessuna animazione interna obbligatoria; reduced-motion disabilita anche l’entrata del dialogo.

## Confine dell’integrazione

`src/booking/config.ts` è intenzionalmente vuoto. Supporta due percorsi alternativi:

1. `officialUrl`: URL HTTPS autorizzato del booking ufficiale. Il link ha precedenza sull’endpoint e non appende parametri non documentati; l’interfaccia avvisa che le date vanno confermate nel sistema ufficiale.
2. `requestEndpoint` + `recipientLabel`: endpoint HTTPS o path same-origin autorizzato. Solo in questa modalità compaiono nome, email, nota facoltativa e conferma della richiesta di risposta. `privacyUrl` può collegare l’informativa reale della struttura; non viene generata alcuna informativa legale fittizia.

Il POST ha body JSON `{version:1, requestId, stay, contact}`. Non contiene segreti e non richiede nuove credenziali nel frontend. Il server deve validare nuovamente, inviare o registrare davvero la richiesta, gestire CORS/abusi e deduplicare `requestId`.

Una risposta HTTP 2xx **non basta**. Solo JSON `{receiptId: string, status: "accepted" | "received"}` produce una ricevuta nell’interfaccia. Questi due stati rappresentano esplicitamente una ricezione acquisita dal server, mai una disponibilità verificata o una prenotazione confermata. L’endpoint reale deve rispettare questo contratto dopo avere registrato la richiesta.

Risposte non valide, 4xx/5xx, rate limit, rete assente e timeout di 15 secondi hanno messaggi distinti senza successo simulato. La stessa richiesta mantiene l’identificatore in caso di retry. Chiudere il dialogo abortisce l’attesa client; non implica annullamento di un’eventuale registrazione già avvenuta sul server.

## Verifiche

- Eseguito `npm run typecheck` dopo l’implementazione iniziale: superato.
- Il responsabile QA ha eseguito gli 8 test dell’adapter in `tests/editorial.test.ts`, insieme ai 7 test della validazione esistente: 15 superati. Coprono configurazione mancante, validazione, payload normalizzato, ricevute 2xx non valide, errore HTTP/rete/rate limit e aborto. Le risposte sono stub controllati, non invii reali.
- La verifica nel browser viene eseguita dal coordinatore; questa nota non afferma controlli di viewport, tastiera o invio reale non ancora eseguiti.
- Non è possibile provare una ricezione reale finché manca il destinatario/endpoint autorizzato.

## Unico dato esterno necessario per attivare il percorso reale

Fornire il booking ufficiale oppure un endpoint autorizzato della struttura con il recapito di destinazione. Non basta inventare un indirizzo o mostrare un messaggio di successo.
