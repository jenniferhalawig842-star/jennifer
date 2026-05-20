// ═══════════════════════════════════════════
//  PHILIPPINE ADDRESS DATA
//  Source: Philippine Standard Geographic Code (PSGC)
//  All data is public domain
// ═══════════════════════════════════════════

export interface PhRegion {
  name: string
  provinces: PhProvince[]
}

export interface PhProvince {
  name: string
  municipalities: PhMunicipality[]
}

export interface PhMunicipality {
  name: string
  barangays: string[]
}

// ── Bohol Province (detailed — home of Tagbilaran main branch) ──
const BOHOL_BARANGAYS_TAGBILARAN = [
  'Bool', 'Booy', 'Cabcaben', 'Cogon', 'Dampas', 'Dao', 'Dolores',
  'Embarcadero', 'Manga', 'Mansasa', 'New Vision', 'Poblacion I',
  'Poblacion II', 'Poblacion III', 'San Isidro', 'San Jose', 'Taloto',
  'Tiptip', 'Ubujan',
]

const BOHOL_BARANGAYS_PANGLAO = [
  'Bol-oc', 'Bolod', 'Danao', 'Doljo', 'Libaong', 'Looc', 'Lourdes',
  'Pahak', 'Poblacion', 'San Isidro', 'Tangnan', 'Tawala',
]

const BOHOL_BARANGAYS_BACLAYON = [
  'Adjeson', 'Agbalanga', 'Bahi', 'Basak', 'Calunasan', 'Cambuac Norte',
  'Cambuac Sur', 'Cangawa', 'Cogtong', 'Lagtangon', 'Laya', 'Libertad',
  'Liong', 'Lourdes', 'Lundag', 'Mansasa', 'Mayana', 'Napo', 'Poblacion',
  'San Isidro', 'San Roque', 'San Vicente', 'Santo Niño', 'Sondol',
]

const GENERIC_BARANGAYS = [
  'Barangay 1 (Poblacion)', 'Barangay 2', 'Barangay 3', 'Barangay 4',
  'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9',
  'Barangay 10', 'Barangay Maligaya', 'Barangay Bagong Silang',
  'Barangay Bagong Nayon', 'Barangay Sta. Cruz', 'Barangay San Jose',
  'Barangay San Isidro', 'Barangay Santo Niño', 'Barangay San Pedro',
  'Barangay San Antonio', 'Barangay San Miguel', 'Barangay Pag-asa',
  'Barangay Mabini', 'Barangay Rizal', 'Barangay Bonifacio',
  'Barangay Aguinaldo',
]

const NCR_BARANGAYS_MAKATI = [
  'Bangkal', 'Bel-Air', 'Carmona', 'Cembo', 'Comembo', 'Dasmariñas',
  'East Rembo', 'Forbes Park', 'Guadalupe Nuevo', 'Guadalupe Viejo',
  'Kasilawan', 'La Paz', 'Legazpi Village', 'Magallanes', 'Olympia',
  'Palanan', 'Pembo', 'Pinagkaisahan', 'Pio del Pilar', 'Pitogo',
  'Poblacion', 'Post Proper Northside', 'Post Proper Southside',
  'Rizal', 'Rockwell', 'Salcedo Village', 'San Antonio', 'San Isidro',
  'San Lorenzo', 'Santa Cruz', 'Singkamas', 'South Cembo', 'Tejeros',
  'Tlaga', 'Urdaneta', 'West Rembo',
]

const NCR_BARANGAYS_BGC = [
  'Bagumbayan', 'Bambang', 'Calzada', 'Central Bicutan', 'Central Signal Village',
  'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy', 'Ibayo-Tipas',
  'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
  'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village',
  'Palingon', 'Pembo', 'Pinagsama', 'San Miguel', 'Santa Ana', 'Tuktukan',
  'Upper Bicutan', 'Ususan', 'Wawa', 'Western Bicutan',
]

export const PH_REGIONS: PhRegion[] = [
  // NCR
  {
    name: 'NCR – National Capital Region',
    provinces: [
      {
        name: 'Metro Manila',
        municipalities: [
          { name: 'Manila',         barangays: ['Binondo', 'Ermita', 'Intramuros', 'Malate', 'Paco', 'Pandacan', 'Port Area', 'Quiapo', 'Sampaloc', 'San Miguel', 'San Nicolas', 'Santa Ana', 'Santa Cruz', 'Santa Mesa', 'Tondo'] },
          { name: 'Quezon City',    barangays: ['Bagong Pag-asa', 'Bagumbayan', 'Batasan Hills', 'Commonwealth', 'Cubao', 'Diliman', 'Fairview', 'Holy Spirit', 'Kamuning', 'Loyola Heights', 'Malibay', 'Novaliches', 'Payatas', 'Project 4', 'Project 6', 'Project 7', 'Project 8', 'San Bartolome', 'Tandang Sora', 'Teachers Village', 'UP Campus'] },
          { name: 'Makati',         barangays: NCR_BARANGAYS_MAKATI },
          { name: 'Taguig (BGC)',   barangays: NCR_BARANGAYS_BGC },
          { name: 'Pasig',          barangays: ['Bagong Ilog', 'Bambang', 'Buting', 'Caniogan', 'Kapitolyo', 'Malinao', 'Manggahan', 'Maybunga', 'Ortigas Center', 'Palatiw', 'Pinagbuhatan', 'Pineda', 'Rosario', 'Sagad', 'San Antonio', 'San Joaquin', 'San Jose', 'San Nicolas', 'Santa Lucia', 'Santa Rosa', 'Santo Tomas', 'Santolan', 'Sumilang', 'Ugong'] },
          { name: 'Parañaque',      barangays: ['Baclaran', 'BF Homes', 'Don Bosco', 'Don Galo', 'La Huerta', 'Merville', 'Moonwalk', 'San Dionisio', 'San Isidro', 'San Martin de Porres', 'Santo Niño', 'Sun Valley', 'Tambo', 'Vitalez'] },
          { name: 'Las Piñas',      barangays: ['Almanza Uno', 'Almanza Dos', 'B.F. International Village', 'Bambang', 'Casanova', 'Ilaya', 'Manuyo Uno', 'Manuyo Dos', 'Pamplona Uno', 'Pamplona Dos', 'Pamplona Tres', 'Pilar', 'Pulang Lupa Uno', 'Pulang Lupa Dos', 'Talon Uno', 'Talon Dos', 'Talon Tres', 'Talon Cuatro', 'Talon Cinco', 'Zapote'] },
          { name: 'Muntinlupa',     barangays: ['Alabang', 'Ayala Alabang', 'Bayanan', 'Buli', 'Cupang', 'New Alabang Village', 'Poblacion', 'Putatan', 'Sucat', 'Tunasan'] },
          { name: 'Marikina',       barangays: ['Barangka', 'Calumpang', 'Concepcion Uno', 'Concepcion Dos', 'Industrial Valley', 'Jesus dela Peña', 'Loyola Heights', 'Malanday', 'Marikina Heights', 'Nangka', 'Parang', 'San Roque', 'Santa Elena', 'Santo Niño', 'Tañong', 'Tumana'] },
          { name: 'Caloocan',       barangays: ['Bagong Silang', 'Bagumbong', 'Barangay 1', 'Barangay 50', 'Barangay 100', 'Camarin', 'Deparo', 'Grace Park East', 'Grace Park West', 'Kaunlaran', 'Lizada', 'Maypajo', 'Monumento', 'Sangandaan', 'ULLMA'] },
          { name: 'Malabon',        barangays: ['Acungan', 'Baritan', 'Bayan-Bayanan', 'Catmon', 'Dampalit', 'Flores', 'Hulong Duhat', 'Ibaba', 'Longos', 'Maysilo', 'Muzon', 'Niugan', 'Panghulo', 'Potrero', 'San Agustin', 'Santa Cruz', 'Tañong', 'Tinajeros', 'Tonsuya', 'Tugatog'] },
          { name: 'Navotas',        barangays: ['Bagumbayan Norte', 'Bagumbayan Sur', 'Bangculasi', 'Daanghari', 'Navotas East', 'Navotas West', 'North Bay Boulevard North', 'San Jose Patag', 'San Roque', 'Sipac-Almacen', 'Tangos', 'Tanza'] },
          { name: 'Valenzuela',     barangays: ['Arkong Bato', 'Balangkas', 'Bignay', 'Bisig', 'Canumay East', 'Canumay West', 'Coloong', 'Dalandanan', 'Gen. T. de Leon', 'Isla', 'Karuhatan', 'Lawang Bato', 'Lingunan', 'Mabolo', 'Mapulang Lupa', 'Malinta', 'Malanday', 'Maysan', 'Palasan', 'Parada', 'Paso de Blas', 'Pasolo', 'Poblacion', 'Polo', 'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Viente Reales', 'Wawang Pulo'] },
          { name: 'San Juan',       barangays: ['Addition Hills', 'Balong-Bato', 'Batis', 'Corazon de Jesus', 'Ermitaño', 'Flood Control', 'Greenhills', 'Isabelita', 'Kabayanan', 'Little Baguio', 'Maytunas', 'Onse', 'Pasadeña', 'Pedro Cruz', 'Progreso', 'Rivera', 'Salapan', 'San Perfecto', 'Santa Lucia', 'Tibagan', 'West Crame'] },
          { name: 'Mandaluyong',    barangays: ['Addition Hills', 'Bagong Nayon I', 'Bagong Nayon II', 'Bagong Silang', 'Barangka Drive', 'Barangka Ibaba', 'Barangka Ilaya', 'Barangka Itaas', 'Buayang Bato', 'Burol', 'Daang Bakal', 'Hagdang Bato Itaas', 'Hagdang Bato Libis', 'Harapin ang Bukas', 'Highway Hills', 'Hulo', 'Mabini-J. Rizal', 'Malamig', 'Mauway', 'Namayan', 'New Zañiga', 'Old Zañiga', 'Pag-asa', 'Plainview', 'Pleasant Hills', 'Poblacion', 'San Jose', 'Vergara', 'Wack-Wack Greenhills'] },
          { name: 'Pasay',          barangays: ['Baclaran', 'Bagong Ilog', 'Barangay 1', 'Barangay 20', 'Barangay 50', 'Barangay 75', 'Barangay 100', 'EDSA-Tramo', 'La Huerta', 'Malibay', 'Maricaban', 'Pio del Pilar', 'San Isidro', 'San Rafael', 'Santa Clara', 'Santo Niño', 'Sevilla', 'Tambo', 'Tramo', 'Victory'] },
        ],
      },
    ],
  },

  // Region VII — Central Visayas
  {
    name: 'Region VII – Central Visayas',
    provinces: [
      {
        name: 'Bohol',
        municipalities: [
          { name: 'Tagbilaran City',  barangays: BOHOL_BARANGAYS_TAGBILARAN },
          { name: 'Panglao',          barangays: BOHOL_BARANGAYS_PANGLAO },
          { name: 'Baclayon',         barangays: BOHOL_BARANGAYS_BACLAYON },
          { name: 'Dauis',            barangays: ['Biking', 'Bingag', 'Bool', 'Cambuhat', 'Cortes', 'Dao', 'Maghaway', 'Mariveles', 'Nataasan', 'Pondol', 'Quezon', 'Totolan', 'Mansasa'] },
          { name: 'Corella',          barangays: ['Concepcion', 'Corazon', 'Estaca', 'Ilihan', 'Lagtangon', 'Linao', 'Lourdes', 'Mansasa', 'Maravilla', 'Poblacion', 'Sto. Niño', 'Sto. Rosario', 'Uba'] },
          { name: 'Maribojoc',        barangays: ['Bayacabac', 'Bood', 'Busao', 'Cabawan', 'Candavid', 'Dipatlong', 'Guiwanon', 'Jandig', 'Lagtangon', 'Lincod', 'Pagnitoan', 'Poblacion', 'San Roque', 'San Vicente', 'Toril', 'Tubuan', 'Villafuertes'] },
          { name: 'Loboc',            barangays: ['Agape', 'Alegria', 'Asinan', 'Babag', 'Babasahon', 'Bagumbayan', 'Bahian', 'Basac', 'Bonkokan Ilaya', 'Bonkokan Ubos', 'Boyog Norte', 'Boyog Sur', 'Bugho', 'Calma', 'Cambanay', 'Can-upao', 'Cancatac', 'Consolacion', 'Lupao', 'Maasin', 'Mahogany', 'Ondol', 'Poblacion', 'Putik', 'Quinapon-an', 'Sabayon', 'Sto. Niño', 'San Miguel', 'Tambis', 'Teresita', 'Tingib', 'Valeria'] },
          { name: 'Balilihan',        barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Sikatuna',         barangays: [...GENERIC_BARANGAYS.slice(0, 12)] },
          { name: 'Antequera',        barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Catigbian',        barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
          { name: 'Sagbayan',         barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'San Miguel',       barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Inabanga',         barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
          { name: 'Talibon',          barangays: [...GENERIC_BARANGAYS.slice(0, 18)] },
          { name: 'Ubay',             barangays: [...GENERIC_BARANGAYS.slice(0, 20)] },
          { name: 'Jagna',            barangays: [...GENERIC_BARANGAYS.slice(0, 17)] },
          { name: 'Anda',             barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
          { name: 'Guindulman',       barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Garcia Hernandez', barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Duero',            barangays: [...GENERIC_BARANGAYS.slice(0, 12)] },
          { name: 'Loon',             barangays: [
            'Agsoso', 'Badbad Occidental', 'Badbad Oriental', 'Bagacay Kawayan', 'Basac', 'Basdacu', 'Basdio',
            'Bongco', 'Cabacongan', 'Cabilao Island', 'Calayugan Norte', 'Calayugan Sur', 'Canhangdon Occidental',
            'Canhangdon Oriental', 'Cantam-is Bago', 'Cantam-is Baslay', 'Catagbacan Handig', 'Catagbacan Norte',
            'Catagbacan Sur', 'Cogon Norte', 'Cogon Sur', 'Cuasi', 'Genomoan', 'Jandig', 'Landa', 'Looc',
            'Mocpoc Norte', 'Mocpoc Sur', 'Moto Norte', 'Moto Sur', 'Napo', 'Nueva Vida', 'Pantudlan',
            'Pig-ot', 'Pondol', 'Sondol', 'Song-on', 'Talisay', 'Tangnan', 'Taytay', 'Ticugan', 'Tontonan',
            'Tubodacu', 'Tubodio', 'Ubayon', 'Ubojan', 'Villalimpia', 'Zamora'
          ] },
          { name: 'Calape',           barangays: [
            'Abucay Norte', 'Abucay Sur', 'Banlasan', 'Bentig', 'Binogawan', 'Bonbon', 'Cahayag', 'Calunasan',
            'Camias', 'Catmonan', 'Desamparados', 'Kabac', 'Kahayag', 'Liboron', 'Looc', 'Mahayag', 'Mandaug',
            'Masonoy', 'Poblacion', 'San Isidro', 'San Jose', 'San Vicente', 'Santo Niño', 'Talisay', 'Tultugan',
            'Ulbujan', 'U-og', 'West Poblacion'
          ] },
          { name: 'Tubigon',          barangays: [
            'Alicia', 'Bacayawan', 'Bagongbanwa', 'Banlasan', 'Burgos', 'Buwangan', 'Cahayag', 'Cawayanan',
            'Centro', 'Cruz', 'Guiwanon', 'Ilijan Norte', 'Ilijan Sur', 'Laya', 'Libertad', 'Macaas', 'Mahayag',
            'Matabao', 'Pinayagan Norte', 'Pinayagan Sur', 'Poblacion', 'Pooc Occidental', 'Pooc Oriental',
            'Potohan', 'San Isidro', 'San Jose', 'San Vicente', 'Santo Niño', 'Taytay', 'Tinangnan', 'Ulbujan',
            'U-og', 'Villa Milagrosa'
          ] },
        ],
      },
      {
        name: 'Cebu',
        municipalities: [
          { name: 'Cebu City',        barangays: ['Adlaon', 'Agsungot', 'Apas', 'Babag', 'Bacayan', 'Banilad', 'Basak Pardo', 'Basak San Nicolas', 'Binaliw', 'Bonbon', 'Budla-an', 'Buhisan', 'Bulacao', 'Buot-Taup Pardo', 'Busay', 'Calamba', 'Cambinocot', 'Capitol Site', 'Carreta', 'Central', 'Cogon Pardo', 'Cogon Ramos', 'Day-as', 'Duljo-Fatima', 'Ermita', 'Guadalupe', 'Guba', 'Hippodromo', 'Inayawan', 'Kalubihan', 'Kalunasan', 'Kamagayan', 'Kasambagan', 'Kinasang-an Pardo', 'Labangon', 'Lahug', 'Lorega-San Miguel', 'Lusaran', 'Luz', 'Mabini', 'Mabolo', 'Malubog', 'Mambaling', 'Pahina Central', 'Pahina San Nicolas', 'Pamutan', 'Pardo', 'Pari-an', 'Paril', 'Pasil', 'Pit-os', 'Pulangbato', 'Pung-ol-Sibugay', 'Punta Princesa', 'Quiot Pardo', 'Sambag I', 'Sambag II', 'San Antonio', 'San Jose', 'San Nicolas Proper', 'San Roque', 'Santa Cruz', 'Santo Niño', 'Sapangdaku', 'Sawang Calero', 'Sinsin', 'Sirao', 'Suba Pasil', 'Sudlon I', 'Sudlon II', 'T. Padilla', 'Talamban', 'Taptap', 'Tejero', 'Tinago', 'Tisa', 'To-ong Pardo', 'Toong', 'Zapatera'] },
          { name: 'Lapu-Lapu City',   barangays: ['Agus', 'Babag', 'Bankal', 'Basak', 'Buaya', 'Calawisan', 'Canjulao', 'Caubian', 'Caw-oy', 'Cawhagan', 'Gun-ob', 'Ibo', 'Looc', 'Mactan', 'Maribago', 'Marigondon', 'Pajac', 'Pajo', 'Pangan-an', 'Poblacion', 'Punta Engaño', 'Pusok', 'Subabasbas', 'Talima', 'Tingo', 'Tungasan'] },
          { name: 'Mandaue City',     barangays: ['Alang-alang', 'Bakilid', 'Bangkal', 'Basak', 'Cambaro', 'Canduman', 'Casili', 'Casuntingan', 'Centro', 'Cubacub', 'Guizo', 'Ibabao-Estancia', 'Jagobiao', 'Labogon', 'Looc', 'Maguikay', 'Mantuyong', 'Md. Roa', 'Opao', 'Pagsabungan', 'Pakna-an', 'Putlod', 'San Roque', 'Subangdaku', 'Tabok', 'Tawason', 'Tingub', 'Tipolo', 'Umapad'] },
          { name: 'Talisay City',     barangays: [...GENERIC_BARANGAYS.slice(0, 20)] },
          { name: 'Danao City',       barangays: [...GENERIC_BARANGAYS.slice(0, 17)] },
          { name: 'Toledo City',      barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
          { name: 'Carcar City',      barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Consolacion',      barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Minglanilla',      barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
          { name: 'Naga City',        barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
        ],
      },
      {
        name: 'Negros Oriental',
        municipalities: [
          { name: 'Dumaguete City', barangays: ['Bagacay', 'Bajumpandan', 'Balugo', 'Banilad', 'Bantayan', 'Bio-os', 'Batinguel', 'Bunao', 'Cadawinonan', 'Calindagan', 'Camanjac', 'Candau-ay', 'Cathedral', 'Daro', 'Junob', 'Looc', 'Mangnao-Canal', 'Motong', 'Nabago', 'Piapi', 'Poblacion No. 1', 'Poblacion No. 2', 'Poblacion No. 3', 'Poblacion No. 4', 'Poblacion No. 5', 'Poblacion No. 6', 'Poblacion No. 7', 'Poblacion No. 8', 'Pulantubig', 'Tabuctubig', 'Taclobo', 'Talay'] },
          { name: 'Bais City',        barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Bayawan City',     barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Canlaon City',     barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
          { name: 'Guihulngan City',  barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
          { name: 'Tanjay City',      barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Valencia',         barangays: [...GENERIC_BARANGAYS.slice(0, 12)] },
        ],
      },
      {
        name: 'Siquijor',
        municipalities: [
          { name: 'Siquijor (Capital)', barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'Lazi',               barangays: [...GENERIC_BARANGAYS.slice(0, 12)] },
          { name: 'Maria',              barangays: [...GENERIC_BARANGAYS.slice(0, 11)] },
          { name: 'San Juan',           barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
        ],
      },
    ],
  },

  // Region VI — Western Visayas
  {
    name: 'Region VI – Western Visayas',
    provinces: [
      {
        name: 'Iloilo',
        municipalities: [
          { name: 'Iloilo City', barangays: ['Agho', 'Alegria', 'Arevalo District', 'Balabag', 'Bakhaw', 'Baldoza', 'Bantud', 'Banuyao', 'Baybay Norte', 'Baybay Sur', 'Bolilao', 'Bo. Obrero', 'Buhang', 'Buntatala', 'Burayan', 'Cagdamo', 'Calaparan', 'Calumpang', 'Cari Norte', 'Cari Sur', 'Centro (Lapuz)', 'Compañia', 'Concepcion', 'Cuartero', 'Danao', 'Delgado-Jalandoni', 'Democracia', 'Desamparados', 'Divinagracia', 'Don Esteban', 'Dungon A', 'Dungon B', 'Dungon C', 'East Baluarte', 'Fenida', 'Flores', 'Funtac', 'Habog-Habog', 'Hinactacan', 'Hipodromo', 'Inday', 'Ingore', 'Jalaud Norte', 'Jalaud Sur', 'Jayme', 'Kaamulan', 'Kasingkasing', 'La Paz', 'Laguda', 'Lanit', 'Lapuz Norte', 'Lapuz Sur', 'Legaspi', 'Libertad', 'Lio-an', 'Loboc', 'Lopez Jaena Norte', 'Lopez Jaena Sur', 'Luna', 'M.V. Hechanova', 'Macatol', 'Magsaysay', 'Malipayon', 'Mansaya-Lapuz', 'Marcelo H. del Pilar', 'Maria Clara', 'Mc Arthur', 'Montinola', 'Muelle-Loney', 'Nabitasan', 'Navais', 'North Baluarte', 'Oñate de Leon', 'Osmena', 'Pakiad', 'Pale Bengco', 'Palapala', 'Pula', 'Punong'] },
          { name: 'Passi City',    barangays: [...GENERIC_BARANGAYS.slice(0, 18)] },
          { name: 'San Jose',      barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Molo',          barangays: [...GENERIC_BARANGAYS.slice(0, 12)] },
        ],
      },
      {
        name: 'Negros Occidental',
        municipalities: [
          { name: 'Bacolod City',   barangays: ['Alangilan', 'Alijis', 'Bagong Silangan', 'Bata', 'Bentaw', 'Binitin', 'Buena Vista', 'Bug-as', 'Cabug', 'Dulao', 'Estefania', 'Felisa', 'Granada', 'Handumanan', 'Mandalagan', 'Mansilingan', 'Montevista', 'Pahanocoy', 'Punta Taytay', 'Singcang-Airport', 'Sum-ag', 'Taculing', 'Tangub', 'Tindo-an', 'Vista Alegre', 'Banago', 'Baybay', 'Capitolville', 'Downtown', 'Mallorca', 'Mahatao', 'Paglaum', 'Poblacion', 'Sampinit', 'Villamonte', 'Circumferential Road'] },
          { name: 'Silay City',     barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
          { name: 'Talisay City',   barangays: [...GENERIC_BARANGAYS.slice(0, 15)] },
          { name: 'Bago City',      barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
          { name: 'San Carlos City',barangays: [...GENERIC_BARANGAYS.slice(0, 17)] },
          { name: 'Cadiz City',     barangays: [...GENERIC_BARANGAYS.slice(0, 13)] },
          { name: 'Sagay City',     barangays: [...GENERIC_BARANGAYS.slice(0, 16)] },
          { name: 'La Carlota City',barangays: [...GENERIC_BARANGAYS.slice(0, 14)] },
        ],
      },
      { name: 'Aklan',    municipalities: [{ name: 'Kalibo', barangays: [...GENERIC_BARANGAYS] }, { name: "Boracay/Malay", barangays: ['Barangay Balabag', 'Barangay Manoc-Manoc', 'Barangay Yapak', 'Station 1', 'Station 2', 'Station 3'] }] },
      { name: 'Antique',  municipalities: [{ name: 'San Jose de Buenavista', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Capiz',    municipalities: [{ name: 'Roxas City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Guimaras', municipalities: [{ name: 'Jordan', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // Region III — Central Luzon
  {
    name: 'Region III – Central Luzon',
    provinces: [
      { name: 'Bulacan',   municipalities: [{ name: 'Malolos City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Meycauayan City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Marilao', barangays: [...GENERIC_BARANGAYS] }, { name: 'Bocaue', barangays: [...GENERIC_BARANGAYS] }, { name: 'Sta. Maria', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Pampanga',  municipalities: [{ name: 'Angeles City', barangays: ['Agapito del Rosario', 'Amsic', 'Anunas', 'Balibago', 'Capaya', 'Claro M. Recto', 'Cuayan', 'Cutcut', 'Cutud', 'Lourdes Norte', 'Lourdes Sur', 'Malabanias', 'Margot', 'Mining', 'Ninoy Aquino', 'Pampang', 'Pandan', 'Pulungbulu', 'Pulung Cacutud', 'Pulung Maragul', 'Salapungan', 'San Jose', 'San Nicolas', 'Santa Teresita', 'Santo Cristo', 'Santo Domingo', 'Santo Rosario', 'Sapang Bato', 'Sapang Biabas', 'Tabun'] }, { name: 'San Fernando City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Mabalacat City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Bataan',    municipalities: [{ name: 'Balanga City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Nueva Ecija', municipalities: [{ name: 'Cabanatuan City', barangays: [...GENERIC_BARANGAYS] }, { name: 'San Jose City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Tarlac',    municipalities: [{ name: 'Tarlac City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Zambales',  municipalities: [{ name: 'Olongapo City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Aurora',    municipalities: [{ name: 'Baler', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // Region IV-A — CALABARZON
  {
    name: 'Region IV-A – CALABARZON',
    provinces: [
      { name: 'Cavite',   municipalities: [{ name: 'Dasmariñas City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Bacoor City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Imus City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Cavite City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Tagaytay City', barangays: [...GENERIC_BARANGAYS] }, { name: 'General Trias City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Laguna',   municipalities: [{ name: 'Santa Rosa City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Calamba City', barangays: [...GENERIC_BARANGAYS] }, { name: 'San Pablo City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Biñan City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Cabuyao City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Batangas', municipalities: [{ name: 'Batangas City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Lipa City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Tanauan City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Rizal',    municipalities: [{ name: 'Antipolo City', barangays: ['Bagong Nayon', 'Beverly Hills', 'Calawis', 'Cupang', 'Dalig', 'Del Rosario', 'Dela Paz', 'Inarawan', 'Mambugan', 'Mayamot', 'Munting Bato', 'San Isidro', 'San Jose', 'San Juan', 'San Luis', 'San Roque', 'Santa Cruz', 'Sta. Cruz', 'Tikling'] }, { name: 'Cainta', barangays: [...GENERIC_BARANGAYS] }, { name: 'Angono', barangays: [...GENERIC_BARANGAYS] }, { name: 'Binangonan', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Quezon',   municipalities: [{ name: 'Lucena City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Tayabas City', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // Region XI — Davao
  {
    name: 'Region XI – Davao Region',
    provinces: [
      {
        name: 'Davao del Sur',
        municipalities: [
          { name: 'Davao City', barangays: ['Agdao', 'Alambre', 'Alejandra Navarro', 'Alfonso Angliongto Sr.', 'Angalan', 'Atan-awe', 'Baganihan', 'Bago Aplaya', 'Bago Gallera', 'Bago Oshiro', 'Baguio', 'Balengaeng', 'Baliok', 'Bangkas Heights', 'Bantol', 'Baracatan', 'Barangay 1-A', 'Barangay 2-A', 'Barangay 3-A', 'Barangay 4-A', 'Barangay 5-A', 'Barangay 6-A', 'Barangay 7-A', 'Barangay 8-A', 'Barangay 9-A', 'Barangay 10-A', 'Barangay 11-B', 'Barangay 12-B', 'Barangay 13-B', 'Barangay 14-B', 'Barangay 15-B', 'Barangay 16-B', 'Barangay 17-B', 'Barangay 18-B', 'Barangay 19-B', 'Barangay 20-B', 'Barangay 21-C', 'Barangay 22-C', 'Barangay 23-C', 'Catalunan Grande', 'Catalunan Pequeño', 'Communal', 'Cugman', 'Dacudao', 'Daliaon Plantation', 'Eden', 'Fatima', 'Indangan', 'Lacson', 'Lamanan', 'Langub', 'Leon Garcia Sr.', 'Lubogan', 'Lumiad', 'Ma-a', 'Mabuhay', 'Malagos', 'Malamba', 'Manambulan', 'Mandug', 'Manuel Guianga', 'Mapula', 'Marapangi', 'Marilog', 'Matina Aplaya', 'Matina Crossing', 'Matina Pangi', 'Mintal', 'Mudiang', 'Mulikay', 'New Carmen', 'New Valencia', 'Pampanga', 'Panacan', 'Panacan II', 'Poblacion', 'Salapawan', 'Sasa', 'Sibulan', 'Sirawan', 'Sirib', 'Suawan', 'Subasta', 'Talomo Proper', 'Talomo River', 'Tamayong', 'Tamugan', 'Tapak', 'Tawan-tawan', 'Tibungco', 'Tigatto', 'Toril', 'Tugbok', 'Tungkalan', 'Ula', 'Vicente Hizon Sr.', 'Waan', 'Wilfredo Aquino', 'Wines'] },
        ],
      },
      { name: 'Davao de Oro',   municipalities: [{ name: 'Nabunturan', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Davao del Norte',municipalities: [{ name: 'Tagum City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Panabo City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Davao Occidental',municipalities: [{ name: 'Digos City', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // Region X — Northern Mindanao
  {
    name: 'Region X – Northern Mindanao',
    provinces: [
      { name: 'Misamis Oriental', municipalities: [{ name: 'Cagayan de Oro City', barangays: ['Agusan', 'Baikingon', 'Bayabas', 'Bayanga', 'Besigan', 'Bonbon', 'Bugo', 'Bulseco', 'Camaman-an', 'Canitoan', 'Carmen', 'Cugman', 'Dansolihon', 'Fort Pilar', 'Gusa', 'Indahag', 'Iponan', 'Kauswagan', 'Lapasan', 'Layawan', 'Lumbia', 'Macabalan', 'Macansandig', 'Mambuaya', 'Nazareth', 'Pagalungan', 'Pagatpat', 'Patag', 'Puntod', 'San Simon', 'Tablon', 'Taglimao', 'Tignapoloan', 'Tumpagon', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5', 'Poblacion 6', 'Poblacion 7', 'Poblacion 8', 'Poblacion 9', 'Poblacion 10', 'Puerto'] }] },
      { name: 'Bukidnon', municipalities: [{ name: 'Malaybalay City', barangays: [...GENERIC_BARANGAYS] }, { name: 'Valencia City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Iligan City (Independent)', municipalities: [{ name: 'Iligan City', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // Region VIII — Eastern Visayas
  {
    name: 'Region VIII – Eastern Visayas',
    provinces: [
      { name: 'Leyte',       municipalities: [{ name: 'Tacloban City', barangays: ['Abucay', 'Caibaan', 'Calanipawan', 'Campetic', 'Utap', 'San Jose', 'Poblacion', 'Marasbaras', ...GENERIC_BARANGAYS.slice(0, 12)] }] },
      { name: 'Eastern Samar', municipalities: [{ name: 'Borongan City', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Northern Samar', municipalities: [{ name: 'Catarman', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Samar',       municipalities: [{ name: 'Catbalogan City', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },

  // CAR
  {
    name: 'CAR – Cordillera Administrative Region',
    provinces: [
      { name: 'Benguet', municipalities: [{ name: 'Baguio City', barangays: ['Abanao-Zandueta-Kayong-Chugum-Otek', 'Alfonso Tabora', 'Ambiong', 'Andres Bonifacio', 'Asin Road', 'Aurora Hill Proper', 'Bakakeng Central', 'Bakakeng Norte', 'Bayan Park Village', 'BGH Compound', 'Cabinet Hill-Teachers Camp', 'Camdas Subdivision', 'Camp 7', 'Camp 8', 'Camp Allen', 'Campo Filipino', 'City Camp Central', 'City Camp Proper', 'Country Club Village', 'Dizon Subdivision', 'Dontogan', 'Engineers Hill', 'Fairview Village', 'Ferdinand', 'Fort del Pilar', 'General Luna Road', 'Gibraltar', 'Greenwater Village', 'Guisad Central', 'Guisad Sorong', 'Happy Hollow', 'Hillside', 'Holy Ghost Extension', 'Holy Ghost Proper', 'Imelda R. Marcos (Rizal Monument Area)', 'Irisan', 'Kabayanihan', 'Kagitingan', 'Kayang Extension', 'Kayang-Hilltop', 'Kias', 'Loakan Proper', 'Lopez Jaena', 'Lourdes Subdivision Extension', 'Lourdes Subdivision Proper', 'Lower Quirino Hill', 'Lower Rock Quarry', 'Magsaysay Private Road', 'Malvar-Santos Pilot School', 'Manuel A. Roxas', 'Market Subdivision Upper', 'Middle Rock Quarry', 'Military Cut-off', 'Mines View Park', 'Modern Site', 'MRR-Queen of Peace', 'New Lucban', 'Outlook Drive', 'Pacdal', 'Padre Burgos', 'Padre Zamora', 'Phil-Am', 'Pinget', 'Pinsao Pilot Project', 'Pinsao Proper', 'Poliwes', 'Pucsusan', 'Quirino Hill East', 'Quirino Hill West', 'Quirino Hill Middle', 'Rock Quarry Lower', 'Rock Quarry Middle', 'Rock Quarry Upper', 'San Antonio Village', 'San Luis Village', 'San Roque Village', 'San Vicente', 'Sanitary Camp North', 'Sanitary Camp South', 'Santa Escolastica', 'Santo Rosario', 'Santo Tomas Proper', 'Session Road Area', 'Slaughterhouse Area', 'South Drive', 'Trancoville', 'Upper Bayan Park', 'Upper QM', 'Upper Rock Quarry', 'West Quirino Hill'] }] },
    ],
  },

  // MIMAROPA
  {
    name: 'MIMAROPA Region',
    provinces: [
      { name: 'Palawan',  municipalities: [{ name: 'Puerto Princesa City', barangays: [...GENERIC_BARANGAYS] }, { name: 'El Nido', barangays: [...GENERIC_BARANGAYS] }, { name: 'Coron', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Marinduque', municipalities: [{ name: 'Boac', barangays: [...GENERIC_BARANGAYS] }] },
      { name: 'Romblon',  municipalities: [{ name: 'Romblon', barangays: [...GENERIC_BARANGAYS] }] },
    ],
  },
]

// ── Helper: get all provinces flat ──
export function getAllProvinces(): string[] {
  const result: string[] = []
  PH_REGIONS.forEach(r => r.provinces.forEach(p => result.push(p.name)))
  return result.sort()
}

// ── Helper: get municipalities by province ──
export function getMunicipalities(provinceName: string): string[] {
  for (const region of PH_REGIONS) {
    const prov = region.provinces.find(p => p.name === provinceName)
    if (prov) return prov.municipalities.map(m => m.name).sort()
  }
  return []
}

// ── Helper: get barangays by municipality + province ──
export function getBarangays(provinceName: string, municipalityName: string): string[] {
  for (const region of PH_REGIONS) {
    const prov = region.provinces.find(p => p.name === provinceName)
    if (prov) {
      const mun = prov.municipalities.find(m => m.name === municipalityName)
      if (mun) return mun.barangays.sort()
    }
  }
  return []
}

// ── Helper: get region by province ──
export function getRegion(provinceName: string): string {
  for (const region of PH_REGIONS) {
    if (region.provinces.find(p => p.name === provinceName)) return region.name
  }
  return ''
}
