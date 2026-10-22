# Le ore del mare — contenuti e frontend

## Interventi

- Header, menu dialog e footer ricostruiti con lo stesso lessico editoriale; accesso diretto a camere, giornata, informazioni e prenotazione.
- Eliminata la barra di prenotazione mobile fissa in basso. Il pulsante Prenota rimane nel masthead e negli inviti contestuali.
- Menu accessibile tramite pulsante con stato espanso e semantica dialog; chiusura esplicita, collegamenti reali e percorsi già esistenti conservati.
- Creata la sezione `InfoAndContact`, con geografia del concept e spiegazione chiara dell’assenza di un hotel/indirizzo/recapito reale. Nessuna mappa inventata.
- Conservate le route di camere, servizi, galleria, esperienze e contatti. Le preferenze continuano a passare al percorso di soggiorno tramite UIContext.
- Rimossi dai dettagli i claim non verificabili su Wi-Fi, climatizzazione, docce, capacità, trattamento e menu. Le descrizioni si limitano agli elementi visibili nei materiali concept.
- Galleria e FAQ aggiornate; nessuna recensione, premio, tariffa, disponibilità o ricezione di una richiesta è inventata.
- Eliminato il falso ruolo di “reception MEMENTO” dalla pagina contatti.

## Origine dei materiali

Il repository dichiara `isConcept: true` e recapiti null. Le nove fotografie esistenti sono immagini generate. Non rappresentano un hotel verificato. Le località dell’Alto Adriatico sono il contesto indicato dal committente, non un indirizzo della struttura.

Nessun collegamento esterno allo studio è stato inserito: nei contenuti correnti del progetto non era presente una destinazione ufficiale verificabile. La firma Memento Design Studio è testuale.

## Dati da sostituire prima di un uso reale

- Identità e località precisa dell’hotel, recapiti, indicazioni di arrivo.
- Fotografie autorizzate, tipologie reali di camera, capienze e dotazioni.
- Servizi effettivi, orari, eventuali inclusioni e condizioni.
- Booking engine ufficiale oppure endpoint/destinatario autorizzato per le richieste.

## Verifiche

Verifica di contenuto e struttura eseguita sul sorgente. `npx tsc --noEmit` superato. Build, interazioni renderizzate e controlli responsive affidati al coordinatore/QA, senza dichiarare risultati non eseguiti da questo ruolo.
