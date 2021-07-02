/**
 * Init dummy data
 * @return {[type]} [description]
 */
function initData () {

	/**
	 * Countries
	 */
	var countries = {
		Russia: new MyWorld.Country({
			id: 1,
			code: 'ru',
			name: 'Russia',
			latitude: 61.52401,
			longitude: 105.318756
		}),
		USA: new MyWorld.Country({
			id: 2,
			code: 'us',
			name: 'USA',
			latitude: 37.09024,
			longitude: -95.712891
		}),
		Japan: new MyWorld.Country({
			id: 3,
			code: 'jp',
			name: 'Japan',
			latitude: 36.204824,
			longitude: 138.252924
		}),
		China: new MyWorld.Country({
			id: 4,
			code: 'ch',
			name: 'China',
			latitude: 35.86166,
			longitude: 104.195397
		}),
		India: new MyWorld.Country({
			id: 5,
			code: 'in',
			name: 'India',
			latitude: 20.593684,
			longitude: 78.96288
		}),
		Austria: new MyWorld.Country({
			id: 6,
			code: 'at',
			name: 'Austria',
			latitude: 47.516231,
			longitude: 14.550072
		}),
		Australia: new MyWorld.Country({
			id: 7,
			code: 'au',
			name: 'Australia',
			latitude: -25.274398,
			longitude: 133.775136
		}),
		NewZealand: new MyWorld.Country({
			id: 8,
			code: 'nz',
			name: 'New Zealand',
			latitude: -40.900557,
			longitude: 174.885971
		}),
		Ukraine: new MyWorld.Country({
			id: 9,
			code: 'ua',
			name: 'Ukraine',
			latitude: 48.379433,
			longitude: 31.16558
		}),
		Chile: new MyWorld.Country({
			id: 10,
			code:  'cl',
			name:  'Chile',
			latitude: -35.675147,
			longitude: -71.542969
		})
	};

	/**
	 * Cities
	 */
	var cities = {
		Vladivostok: countries.Russia.addCity({
			id: 1,
			code: 'vl',
			name: 'Vladivostok',
			latitude: 43.12253732841481,
			longitude: 131.89793676137924
		}),
		Moscow: countries.Russia.addCity({
			id: 2,
			code: 'moscow',
			name: 'Moscow',
			latitude: 55.755826,
			longitude: 37.6173
		}),
		Novosibirsk: countries.Russia.addCity({
			id: 3,
			code: 'novosibirsk',
			name: 'Novosibirsk',
			latitude: 55.0083526,
			longitude: 82.9357327
		}),
		Khabarovsk: countries.Russia.addCity({
			id: 4,
			code: 'khabarovsk',
			name: 'Khabarovsk',
			latitude: 48.5027313,
			longitude: 135.0662599
		}),
		StPetersburg: countries.Russia.addCity({
			id: 5,
			code: 'st-petersburg',
			name: 'St Petersburg',
			latitude: 59.9342802,
			longitude: 30.335098600000038
		}),
		Kurgan: countries.Russia.addCity({
			id: 6,
			code: 'kurgan',
			name: 'Kurgan',
			latitude: 55.4649113,
			longitude: 65.3053512
		})
	};

	/**
	 * Places
	 */
	var places = {
		MummiyTrollCafe: cities.Vladivostok.addPlace({
			id: 1,
			code: 'mumiytrollcafe',
			name: 'Mummiy Troll Cafe',
			description: 'Mummiy Troll Cafe',
			latitude: 43.118643,
			longitude: 131.8803377,
			tags: ['bar', 'lagutenko'],
			type: 'bar',
			address: 'Pogranichnaya st., 6'
		}),
		ZolotoyRog: cities.Vladivostok.addPlace({
			id: 2,
			code: 'zolotoyrog',
			name: 'Zolotoy Rog',
			description: 'Zolotoy Rog',
			latitude: 43.10963063,
			longitude: 131.89842224,
			tags: ['bay', 'bridge'],
			type: 'bag',
			address: ''
		}),
		MountKholodilnik: cities.Vladivostok.addPlace({
			id: 3,
			code: 'mountkholodilnik',
			name: 'Mount Kholodilnik',
			description: 'Mount Kholodilnik',
			latitude: 43.145278,
			longitude: 131.94,
			tags: ['mountain', 'nature'],
			type: 'sport',
			address: ''
		}),
		FuniculardeVladivostok: cities.Vladivostok.addPlace({
			id: 4,
			code: 'funicular',
			name: 'Funicular de Vladivostok',
			description: 'Funicular de Vladivostok',
			latitude: 43.115936,
			longitude: 131.9008781,
			tags: ['funicular', 'transport'],
			type: 'culture',
			address: 'Pushkinskaya st.'
		}),
		RailwayStation: cities.Vladivostok.addPlace({
			id: 5,
			code: 'railwaystation',
			name: 'Railway Station',
			description: 'Railway Station',
			latitude: 43.1112637,
			longitude: 131.8817282,
			tags: ['railway', 'transport'],
			type: 'bag',
			address: 'Aleutskaya st., 2'
		}),
		BotanicGarden: cities.Vladivostok.addPlace({
			id: 6,
			code: 'botanicgarden',
			name: 'Botanic Garden',
			description: 'Botanic Garden',
			latitude: 43.223889,
			longitude: 131.993611,
			tags: ['botanic', 'nature', 'flowers'],
			type: 'cinema',
			address: 'Makovskogo st., 142'
		})
	};

	/**
	 * Events
	 */
	var events = {
		SineeParty: places.MummiyTrollCafe.addEvent({
			id: 1,
			code: 'sineeparty',
			name: 'Sinee Party',
			description: 'Open event',
			datetime: '21 Septemer 2016 19:00',
			price: 300,
			currency: '$',
			tags: ['party']
		}),
		LastRing: places.MummiyTrollCafe.addEvent({
			id: 2,
			code: 'lastring',
			name: 'Last Ring',
			description: 'Last Ring at Vladivostok',
			datetime: '03 jun 2016 00:00',
			price: 0,
			currency: '$',
			tags: ['party']
		}),
		LagutenkoConcert: places.MummiyTrollCafe.addEvent({
			id: 3,
			code: 'lagutenkoconcert',
			name: 'Lagutenko Concert',
			description: 'Lagutenko Concert at Mummiy Troll Cafe',
			datetime: '14 sep 2016 20:30',
			price: 499,
			currency: '$',
			tags: ['concert']
		}),
		TranceHouseDance: places.MummiyTrollCafe.addEvent({
			id: 4,
			code: 'trancehousedance',
			name: 'Trance House Dance',
			description: 'Trance House Dance',
			datetime: '19 dec 2016 23:00',
			price: 390,
			currency: '$',
			tags: ['dance']
		})
	};

	/**
	 * News
	 */
	var news = {
		AirportApproaches: cities.Vladivostok.addNews({
			id: 0,
			code: 'airport',
			name: 'WORLD\'S 10 MOST STUNNING AIRPORT APPROACHES',
			description: '',
			datetime: '22 March 1994 23:44',
			tags: [],
			latitude: 43.3948533,
			longitude: 132.1477422
		}),
		LagutenkoComes: cities.Vladivostok.addNews({
			id: 2,
			code: 'lagutenkocomes',
			name: 'Lagutenko comes!',
			description: 'Lagutenko comes to Vladivostok',
			datetime: '17 jun 2016',
			tags: []
		}),
		LuchEnergiaWinsPremierLeague: cities.Vladivostok.addNews({
			id: 3,
			code: 'luchenergia',
			name: 'Luch-Energia wins Premier-League',
			description: 'Luch-Energia wins Premier-League and will play in Champions League',
			datetime: 'Never',
			latitude: 43.119166,
			longitude: 131.878752,
			tags: []
		}),
		FreeBeer: cities.Vladivostok.addNews({
			id: 4,
			code: 'freebeer',
			name: 'Free beer at StreetBar!',
			description: 'Free beer to every visitor at StreetBar',
			datetime: '19 jun 2016',
			latitude: 43.1153448,
			longitude: 131.9026892,
			tags: []
		})
	};

	/**
	 * Companies
	 */
	var companies = {
		StreetBar: cities.Vladivostok.addCompany({
			id: 1,
			code: 'streetbar',
			name: 'StreetBar',
			description: '',
			latitude: 43.114095028040026,
			longitude: 131.8949068710208,
			tags: ['drinking', 'bar'],
			type: 'bar',
			address: 'Svetlanskaya St, 83'
		}),
		SmallGum: cities.Vladivostok.addCompany({
			id: 2,
			code: 'smallgum',
			name: 'Small Gum',
			description: '',
			latitude: 43.11525415124675,
			longitude: 131.89072262495756,
			tags: ['shopping', 'center'],
			type: 'bag',
			address: 'Svetlanskaya St, 45'
		}),
		Ocean: cities.Vladivostok.addCompany({
			id: 3,
			code: 'ocean',
			name: 'Ocean',
			description: '',
			latitude: 43.116585549458726,
			longitude: 131.87834154814482,
			tags: ['movie', 'cinema'],
			type: 'cinema',
			address: 'Naberezhnaya St., 3'
		}),
		FescoHall: cities.Vladivostok.addCompany({
			id: 4,
			code: 'fescohall',
			name: 'Fesco Hall',
			description: '',
			latitude: 43.10536957176734,
			longitude: 131.87128197401762,
			tags: ['fesco', 'kvn'],
			type: 'sport',
			address: 'Verkhneportovaya st., 38'
		}),
		OperaTheatre: cities.Vladivostok.addCompany({
			id: 5,
			code: 'operatheatre',
			name: 'Opera Theatre',
			description: '',
			latitude: 43.101170883874445,
			longitude: 131.8983867019415,
			tags: ['opera', 'culture'],
			type: 'culture',
			address: 'Fastovskaya st., 20'
		})
	};

	/**
	 * Vacancies
	 */
	var vacancies = {
		StreetBarBarmen: companies.StreetBar.addVacancy({
			id: 1,
			code: 'barmen',
			name: 'Barmen',
			description: 'Barmen at Street Bar',
			salary: 100,
			currency: '$',
			tags: ['alcohol', 'communication', 'bar']
		}),
		SmallGumSeller: companies.SmallGum.addVacancy({
			id: 2,
			code: 'seller',
			name: 'Seller',
			description: 'Seller at Small Gum',
			salary: 300,
			currency: '$',
			tags: ['sales', 'center']
		}),
		OceanOperator: companies.Ocean.addVacancy({
			id: 3,
			code: 'operator',
			name: 'Operator',
			description: 'Operator at Ocean',
			salary: 800,
			currency: '$',
			tags: ['cinema', 'video', 'spielberg']
		}),
		FescoHallActor: companies.FescoHall.addVacancy({
			id: 4,
			code: 'actor',
			name: 'Actor',
			description: 'Actor at Fesco Hall',
			salary: 1400,
			currency: '$',
			tags: ['fesco', 'egersheld', 'clooney']
		}),
		OperaTheatreSinger: companies.OperaTheatre.addVacancy({
			id: 5,
			code: 'singer',
			name: 'Singer',
			description: 'Singer at Opera Theatre',
			salary: 2000,
			currency: '$',
			tags: ['opera', 'churkin', 'sinatra']
		})
	};

	/**
	 * Excursions
	 */
	var excursions = {
		RoadToServerC: cities.Vladivostok.addExcursion({
			id: 1,
			code: 'roadtoserverc',
			name: 'Road to ServerC',
			description: 'Road to ServerC',
			price: 0,
			currency: '$',
			language: 'Russian',
			duration: '1 hr',
			guide: 'Ananev Matvey',
			latitudeOrigin: 43.0962551,
			longitudeOrigin: 131.8651361,
			latitudeDestination: 43.123562,
			longitudeDestination: 131.894808
		}),
		FromGuliverToOpera: cities.Vladivostok.addExcursion({
			id: 2,
			code: 'gulivertoopera',
			name: 'From Guliver to Opera',
			description: 'Guliver to Opera',
			price: 100,
			currency: '$',
			language: 'English',
			duration: '1-2 hrs',
			guide: 'Ananev Matvey',
			latitudeOrigin: 43.18577834,
			longitudeOrigin: 131.91962242,
			latitudeDestination: 43.100722,
			longitudeDestination: 131.898504
		})
	};

	return {
		countries: countries,
		cities: cities,
		places: places,
		events: events,
		news: news,
		companies: companies,
		vacancies: vacancies,
		excursions: excursions
	};

};
