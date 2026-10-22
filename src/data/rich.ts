export const photographs: Record<string, { label: string; alt: string; file: string }> = {
  'hero-beach': { label: 'Ci vediamo al mare', alt: 'Spiaggia ampia di sabbia dorata, ombrelloni a righe e mare dell’Alto Adriatico.', file: 'summer-hero' },
  'private-beach': { label: 'A piedi nudi', alt: 'Due amici camminano a piedi nudi nell’acqua bassa lungo la spiaggia.', file: 'summer-beach' },
  'suite-baia': { label: 'Camera Mare', alt: 'Camera luminosa con tessuti azzurri e gialli, balcone e vista sul mare.', file: 'summer-room-mare' },
  'suite-giardino': { label: 'Camera Pineta', alt: 'Camera accogliente in legno chiaro con balcone affacciato sui pini.', file: 'summer-room-pineta' },
  'suite-panorama': { label: 'Family Room', alt: 'Camera per la famiglia con letto matrimoniale e alcova con due letti singoli.', file: 'summer-room-family' },
  spa: { label: 'A bordo piscina', alt: 'Piscina azzurra con ombrelloni a righe e un hotel dai colori caldi.', file: 'summer-pool' },
  fitness: { label: 'Un giro in pineta', alt: 'Due ospiti in bicicletta lungo un percorso ombreggiato dai pini.', file: 'summer-bike' },
  dining: { label: 'L’ora del brindisi', alt: 'Due amici brindano con un aperitivo su una terrazza vicino alla spiaggia.', file: 'summer-table' },
  food: { label: 'Buongiorno, vacanza', alt: 'Cappuccino, cornetto, frutta e succo su una tavola estiva a righe.', file: 'summer-breakfast' },
  care: { label: 'Risvegli lenti', alt: 'Colazione in terrazza con cappuccino, cornetto e luce del mattino.', file: 'summer-breakfast' },
};

export const roomStories: Record<string, { image: string; tag: string; lead: string; story: string; detailTitle: string; detail: string; features: string[] }> = {
 'suite-baia': { image: 'suite-baia', tag: 'Per chi cerca l’orizzonte', lead: 'Apri gli occhi. C’è il mare.', story: 'Le tende si muovono piano, la luce entra e la prima cosa da fare è uscire sul balcone. Camera Mare è il tuo punto di partenza per una giornata a piedi nudi.', detailTitle: 'La vacanza, anche in camera.', detail: 'Colori chiari, un letto comodo e uno spazio all’aperto per leggere o aspettare il tramonto. Il piacere sta nelle cose semplici, fatte bene.', features: ['Letto matrimoniale', 'Balcone arredato', 'Aria condizionata', 'Bagno con doccia', 'Wi-Fi e spazio per i tuoi oggetti', 'Tessuti freschi e luce naturale'] },
 'suite-giardino': { image: 'suite-giardino', tag: 'Per chi ama la quiete', lead: 'Il verde fuori. La calma dentro.', story: 'Dopo il mare, il profumo dei pini. Una camera dai toni naturali, con un balcone tranquillo e tutto lo spazio che serve per staccare.', detailTitle: 'Un piccolo cambio di ritmo.', detail: 'Legno chiaro, tessuti morbidi e ombra leggera. Camera Pineta è il posto per la siesta, qualche pagina di un libro e un risveglio senza allarmi.', features: ['Letto matrimoniale', 'Balcone sul verde', 'Aria condizionata', 'Bagno con doccia', 'Angolo lettura', 'Arredi in legno chiaro'] },
 'suite-panorama': { image: 'suite-panorama', tag: 'Per i ricordi in compagnia', lead: 'La felicità ha spazio per tutti.', story: 'Valigie aperte, costumi stesi e una giornata da inventare insieme. Family Room lascia a ognuno il suo angolo, con letto matrimoniale e una zona dedicata ai più piccoli.', detailTitle: 'Insieme, con il proprio spazio.', detail: 'Una sistemazione pratica e luminosa per alternare grandi giornate al mare e piccoli momenti di riposo. Il comfort di avere le cose a portata di mano.', features: ['Letto matrimoniale', 'Zona con due letti singoli', 'Spazi per valigie e giochi', 'Aria condizionata', 'Bagno con doccia', 'Arredi funzionali e accoglienti'] },
};

export const serviceStories: Record<string, { kicker: string; lead: string; detailTitle: string; detail: string; secondImage: string; chapters: { title: string; text: string; meta: string }[] }> = {
 spiaggia: { kicker: 'Il mare', lead: 'Le cose belle si fanno a piedi nudi.', detailTitle: 'Sabbia tra le dita. Testa leggera.', detail: 'Una passeggiata sulla battigia, un bagno e il tuo posto sotto l’ombrellone. La giornata trova da sola il ritmo giusto, tra il mare e quella pausa che rimandavi da un po’.', secondImage: 'hero-beach', chapters: [
  { title: 'Il primo tuffo', meta: '08:30 / Si comincia', text: 'L’aria è ancora fresca, l’acqua calma. Il risveglio migliore è una camminata lungo la riva, prima che la spiaggia si riempia di vita.' },
  { title: 'La tua base al sole', meta: '11:00 / Nessuna fretta', text: 'Lettino, ombra, un libro e una bevanda fresca. Ci sono giornate in cui la scelta più difficile è decidere quando fare il prossimo bagno.' },
  { title: 'Ancora cinque minuti', meta: '18:00 / L’ultima luce', text: 'Una partita sulla sabbia, una foto insieme e il sole che si abbassa. Quel momento in cui nessuno ha davvero voglia di rientrare.' },
 ]},
 spa: { kicker: 'Piscina e relax', lead: 'Ogni tanto, basta galleggiare.', detailTitle: 'Modalità relax: attiva.', detail: 'Un’alternativa al mare, un punto di ritrovo, il posto per una pausa nelle ore più calde. La piscina è il piccolo mondo in cui tutti trovano il proprio modo di stare bene.', secondImage: 'spa', chapters: [
  { title: 'Un tuffo senza programmi', meta: 'La piscina', text: 'Acqua azzurra, luce e il piacere di rinfrescarsi. La giornata cambia scenario, ma resta leggera.' },
  { title: 'Il tuo angolo d’ombra', meta: 'Il solarium', text: 'Un lettino comodo, il telo e qualcosa da leggere. Il tempo libero comincia anche così.' },
  { title: 'Ci vediamo a bordo vasca', meta: 'In compagnia', text: 'Una chiacchierata, una bibita fresca e una pausa insieme. Piccoli momenti che diventano parte della vacanza.' },
 ]},
 fitness: { kicker: 'Fuori, a respirare', lead: 'La vacanza ha anche due ruote.', detailTitle: 'Un giro. Mille piccole scoperte.', detail: 'La pineta, il lungomare, una sosta per un gelato. Muoversi diventa un modo semplice di conoscere il posto, senza trasformare ogni giornata in un itinerario.', secondImage: 'private-beach', chapters: [
  { title: 'Tra i pini', meta: 'Al fresco', text: 'Un giro in bici all’ombra, con il rumore delle ruote e il profumo della pineta. Si parte piano, si torna quando si vuole.' },
  { title: 'Il lungomare', meta: 'Verso il blu', text: 'Camminare, fermarsi, scegliere un tavolino o tornare alla spiaggia. Il bello è lasciare un po’ di spazio all’improvvisazione.' },
  { title: 'La deviazione giusta', meta: 'Per curiosità', text: 'Un angolo da fotografare, un gelato da dividere, una nuova strada per tornare. I ricordi spesso nascono fuori programma.' },
 ]},
 ristorante: { kicker: 'Dalla colazione all’aperitivo', lead: 'Le giornate migliori hanno buon gusto.', detailTitle: 'A tavola si sta bene.', detail: 'Un cornetto ancora tiepido al mattino, qualcosa di fresco dopo il mare, un brindisi mentre cambia la luce. Sapori semplici, momenti da condividere.', secondImage: 'food', chapters: [
  { title: 'Buongiorno, vacanza', meta: '08:00 / La colazione', text: 'Caffè, frutta, pane e dolci. Una tavola allegra e il piacere di fare colazione con calma, prima di scegliere la direzione del giorno.' },
  { title: 'Una pausa leggera', meta: '13:00 / Dopo il mare', text: 'Piatti freschi, ingredienti di stagione e il gusto di mangiare senza fretta. Poi c’è ancora tutto il pomeriggio.' },
  { title: 'Il brindisi che ci voleva', meta: '19:00 / Golden hour', text: 'Un aperitivo, qualcosa da condividere e le persone giuste. L’estate sta anche in una conversazione che continua.' },
 ]},
};

export const experiences = [
 { id:'risveglio',title:'A piedi nudi',category:'Mare',moment:'Il primo bagno',image:'private-beach',interest:'spiaggia',text:'Una passeggiata nell’acqua bassa. E il mondo può aspettare.',detail:'La battigia al mattino, il rumore delle onde, la spiaggia ancora tranquilla. Un piccolo rito da ripetere ogni giorno.' },
 { id:'pineta',title:'Un giro, senza fretta',category:'In bici',moment:'Tra i pini',image:'fitness',interest:'fitness',text:'Due ruote, un po’ d’ombra e una sosta per il gelato.',detail:'Un percorso da decidere sul momento. Il piacere di muoversi all’aperto, tra il lungomare e il verde della pineta.' },
 { id:'aperitivo',title:'L’ora di stare insieme',category:'Sapori',moment:'Golden hour',image:'dining',interest:'ristorante',text:'Un brindisi, due risate e la luce più bella della giornata.',detail:'Ci si ritrova dopo il mare per raccontarsi la giornata. L’aperitivo diventa il ponte tra l’ultimo bagno e la serata.' },
 { id:'piscina',title:'Modalità relax',category:'Piscina',moment:'Tutto il pomeriggio',image:'spa',interest:'spa',text:'Un tuffo. Una pausa. Magari un altro tuffo.',detail:'La piscina è il posto per cambiare ritmo senza andare lontano. Un lettino, una zona d’ombra e il tempo libero che cercavi.' },
 { id:'colazione',title:'Ancora un caffè',category:'Colazione',moment:'Il risveglio lento',image:'food',interest:'ristorante',text:'La sveglia può aspettare. La colazione, meglio gustarsela.',detail:'Frutta, qualcosa di dolce e il tuo caffè preferito. Il primo appuntamento della giornata è con la calma.' },
 { id:'famiglia',title:'Ricordi di famiglia',category:'Insieme',moment:'Ogni giorno',image:'suite-panorama',interest:'spiaggia',text:'Le cose che restano: un gioco, un bagno, una foto tutti insieme.',detail:'Spazi comodi e giornate semplici da organizzare. Per stare insieme con più tempo e meno programmi.' },
];
