import content from './content.it.json';
export { content };

// These are descriptions of the supplied concept images, not a hotel's verified inventory.
export const roomDetails: Record<string, { tag: string; lead: string; story: string; title: string; detail: string; materialNotes: string[] }> = {
  'suite-baia': {
    tag: 'L’orizzonte in camera', lead: 'La luce entra, lo sguardo esce.',
    story: 'Una composizione luminosa: il letto in primo piano, i tessuti chiari e il balcone che lascia spazio all’orizzonte.',
    title: 'Dentro e fuori, una sola luce.',
    detail: 'Il legno chiaro incontra piccoli accenti di colore. Le tende filtrano la luce e il mare diventa parte dell’inquadratura.',
    materialNotes: ['Legno chiaro', 'Tessuti azzurri e gialli', 'Balcone nell’inquadratura', 'Luce naturale'],
  },
  'suite-giardino': {
    tag: 'Una pausa tra i pini', lead: 'La quiete, vista da dentro.',
    story: 'Il paesaggio cambia: oltre la vetrata compaiono i pini, mentre in camera il legno e i tessuti mantengono il tono morbido.',
    title: 'Il paesaggio fa silenzio.',
    detail: 'Un angolo da leggere con calma, tra superfici naturali e luce filtrata. Un’altra interpretazione del riposo dopo il mare.',
    materialNotes: ['Legno chiaro', 'Tessuti nei toni della sabbia', 'Affaccio sui pini', 'Angolo lettura'],
  },
  'suite-panorama': {
    tag: 'Lo spazio da condividere', lead: 'Insieme, con il proprio angolo.',
    story: 'Il letto e l’alcova disegnano due zone nella stessa stanza. La luce e i colori tengono insieme l’intera composizione.',
    title: 'Una camera, più punti di vista.',
    detail: 'Un ambiente pensato per raccontare la vacanza in famiglia. La disposizione illustrata è una proposta di concept; capienza e dotazioni andranno definite con l’hotel reale.',
    materialNotes: ['Letto e alcova', 'Due letti singoli nell’immagine', 'Colori caldi', 'Arredi in legno chiaro'],
  },
};

export const serviceDetails: Record<string, { intro: string; includes: string[]; closing: string; title: string; detail: string; secondImage: string; moments: { title: string; text: string; meta: string }[] }> = {
  spiaggia: {
    intro: 'La battigia mette il resto in prospettiva. Uno spazio aperto, da attraversare senza guardare l’ora.',
    includes: ['Sabbia chiara', 'Ombrelloni a righe', 'Acqua bassa', 'Un orizzonte aperto'],
    closing: 'Ancora qualche passo. Poi ci fermiamo.', title: 'La giornata prende il largo.',
    detail: 'Nelle immagini del concept il mare si incontra a piedi, tra le prime passeggiate e la luce che cambia sulla sabbia.', secondImage: 'hero-beach',
    moments: [
      { title: 'La riva', text: 'Il punto in cui la sabbia incontra l’acqua. Una passeggiata diventa il primo gesto della giornata.', meta: '01 / A piedi nudi' },
      { title: 'L’ombra', text: 'Gli ombrelloni disegnano un ritmo sulla spiaggia, lasciando il paesaggio protagonista.', meta: '02 / Una pausa' },
      { title: 'L’orizzonte', text: 'Nessun itinerario imposto: basta scegliere dove fermare lo sguardo.', meta: '03 / Tempo aperto' },
    ],
  },
  spa: {
    intro: 'L’acqua riflette l’architettura. Il bordo piscina diventa una piccola parentesi tra un momento e l’altro della giornata.',
    includes: ['Piscina nell’immagine', 'Facciata dai toni caldi', 'Lettini', 'Ombrelloni a righe'],
    closing: 'Il pomeriggio può restare qui.', title: 'Una pausa a bordo acqua.',
    detail: 'La fotografia immagina uno spazio raccolto all’aperto: acqua, lettini e ombra, con la struttura sullo sfondo.', secondImage: 'spa',
    moments: [
      { title: 'L’acqua', text: 'La superficie luminosa raccoglie i colori del cielo e dell’edificio.', meta: '01 / Riflessi' },
      { title: 'Il bordo', text: 'Lettini e ombrelloni introducono una scala più intima rispetto alla spiaggia.', meta: '02 / Una sosta' },
      { title: 'La luce', text: 'Il tono caldo della facciata accompagna la scena senza sovrastarla.', meta: '03 / Il pomeriggio' },
    ],
  },
  fitness: {
    intro: 'Una strada tra i pini cambia il ritmo del paesaggio. Si lascia il mare per qualche minuto, con la curiosità di vedere cosa c’è oltre.',
    includes: ['Sentiero tra i pini', 'Biciclette', 'Ombra naturale', 'Paesaggio costiero'],
    closing: 'La deviazione fa parte del giorno.', title: 'Fuori, un po’ più piano.',
    detail: 'Il concept affianca alla spiaggia una fotografia in pineta. Il percorso illustrato non corrisponde a un itinerario geolocalizzato e non indica un servizio di noleggio.', secondImage: 'private-beach',
    moments: [
      { title: 'Tra i pini', text: 'La luce attraversa gli alberi e spezza il sole pieno della costa.', meta: '01 / All’ombra' },
      { title: 'Due ruote', text: 'La bicicletta introduce un modo diverso di guardare il paesaggio, alla velocità di una conversazione.', meta: '02 / In movimento' },
      { title: 'Di nuovo il mare', text: 'La seconda fotografia riporta lo sguardo sulla battigia, chiudendo idealmente la passeggiata.', meta: '03 / Il ritorno' },
    ],
  },
  ristorante: {
    intro: 'Due tavole, due luci. Il primo caffè apre la giornata; un brindisi la accompagna verso sera.',
    includes: ['Caffè e cornetto', 'Frutta a colazione', 'Aperitivo in terrazza', 'Luce di fine giornata'],
    closing: 'Restiamo ancora un po’ a tavola.', title: 'Dalla prima luce al brindisi.',
    detail: 'Le immagini raccontano il gesto di ritrovarsi a tavola. Non costituiscono un menu, un trattamento incluso o un orario di servizio.', secondImage: 'food',
    moments: [
      { title: 'Il primo caffè', text: 'La tavola chiara raccoglie caffè, frutta e qualcosa di dolce.', meta: '01 / Mattino' },
      { title: 'Il tempo a tavola', text: 'La tovaglia a righe e la luce naturale danno continuità alle due scene.', meta: '02 / Con calma' },
      { title: 'Il brindisi', text: 'Le mani entrano nell’inquadratura e il paesaggio lascia spazio alla compagnia.', meta: '03 / Verso sera' },
    ],
  },
};

export const faqs = [
  { question: 'Posso prenotare un soggiorno da questa anteprima?', answer: 'Puoi preparare date, persone e preferenze, poi copiare o scaricare il riepilogo. L’anteprima non è collegata a una struttura reale: non verifica prezzi o disponibilità e non invia richieste. L’invio potrà essere attivato solo con un destinatario ufficiale autorizzato.' },
  { question: 'Le fotografie mostrano un hotel reale?', answer: 'No. Le nove immagini sono state generate per il concept MEMENTO Hotel & Beach. Ambienti, camere e attività illustrano una direzione progettuale e dovranno essere sostituiti con materiali verificati della struttura.' },
  { question: 'Devo scegliere subito una camera?', answer: 'No. Puoi iniziare dalle date e dalle persone, lasciando la camera da scegliere. Le preferenze restano disponibili finché tieni aperta la pagina.' },
  { question: 'Dove si trova MEMENTO Hotel & Beach?', answer: 'È un hotel immaginario ispirato all’ospitalità dell’Alto Adriatico. Non ha un indirizzo, una mappa o recapiti di reception. La località e le informazioni di arrivo saranno quelle dell’hotel che adotterà il progetto.' },
];

export const galleryItems = [
  { id: 'hero-beach', label: '01 / Il primo sguardo', category: 'Mare' },
  { id: 'private-beach', label: '02 / A piedi nudi', category: 'Mare' },
  { id: 'suite-baia', label: '03 / Camera Mare', category: 'Camere' },
  { id: 'spa', label: '04 / Il pomeriggio', category: 'Relax' },
  { id: 'dining', label: '05 / Verso sera', category: 'Sapori' },
  { id: 'suite-giardino', label: '06 / Camera Pineta', category: 'Camere' },
  { id: 'fitness', label: '07 / Tra i pini', category: 'Relax' },
  { id: 'food', label: '08 / Il primo caffè', category: 'Sapori' },
  { id: 'suite-panorama', label: '09 / Family Room', category: 'Camere' },
];
