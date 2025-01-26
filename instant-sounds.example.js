/* Sound pack example for Instant Sounds JS */

const SOUNDPACK_EXAMPLE={
	defaults:{
		//format:'mp3', //valid formats: mp3 (default), ogg, opus, wav and aac
		//folder:'soundpack_example',
		//style:'white',
		//multiple:true //allow a button to be smashed
	},

	categories:[
		{
			title:'MK Shao Kahn',
			folder:'soundpack_example/mk_shao_kahn', //if defined, it overrides defaults
			style:'red', //if defined, it overrides defaults
			multiple:true, //if defined, it overrides defaults
			sounds:[
				'Round 1',
				'Round 2',
				'Round 3',
				'Round 4',
				'Fight',
				'Finish him',
				'Finish her',
				'Flawless victory',
				'Fatality',
				'Laugh 1',
				'Laugh 2',
				'Laugh 3',
				'Laugh 4',
				'Excellent',
				'Outstanding',
				'Superb',
				'Well done'
			]
		},{
			/* RE4 audio clips from: https://www.youtube.com/watch?v=ii0d6x7mNxo */
			title:'Resident Evil 4 Ganados',
			folder:'soundpack_example/resident_evil_4_ganados',
			style:'orange',
			sounds:[
				'Agárrenlo',
				'Ahí está',
				'Ahí está (2)',
				'Ahí está (3)',
				'A por él',
				'A por él (2)',
				'Basta hijo de puta',
				'Basta hijo de puta (2)',
				'Cabrón',
				'Cerebro',
				'Cogedlo',
				'Cogedlo (2)',
				'Cogedlo (3)',
				'Detrás de tí imbécil',
				'Detrás de tí imbécil (2)',
				'Detrás de tí imbécil (3)',
				'¡Eh, acá!',
				'Empieza a rezar',
				'Mátalo',
				'Mierda',
				'Mierda (2)',
				'Míralo, está herido',
				'Morir es vivir',
				'Muerte',
				'Os voy a romper a pedazos',
				'Puedes correr pero no puedes escondí',
				'Quiero matar',
				'Quiero su cabeza',
				'So cerdo',
				'Te voy a hacer picadillo',
				'Te voy a matar',
				'Te voy a matar (2)',
				'Un forastero',
				'Ya es hora de asplastar'
			]
		},{
			title:'Sega',
			folder:'soundpack_example/sega',
			//icon:'sega',
			style:'blue',
			sounds:[
				'SEGA',
				'Sonic (bubble)',
				'Sonic (ring)',
				'Axel',
			]
		}
	]
};
