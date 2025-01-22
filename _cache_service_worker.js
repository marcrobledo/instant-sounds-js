/*
	Cache Service Worker template by mrc 2019
	mostly based in:
	https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
	https://github.com/chriscoyier/Simple-Offline-Site/blob/master/js/service-worker.js
	https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e	
	
	Note for GitHub Pages:
	there can be an unexpected behaviour (cache not updating) when site is accessed from
	https://user.github.io/repo/ (without index.html) in some browsers (Firefox)
	use absolute paths if hosted in GitHub Pages in order to avoid it
	also invoke sw with an absolute path:
	navigator.serviceWorker.register('/repo/_cache_service_worker.js', {scope: '/repo/'})
*/

var PRECACHE_ID='instant-sounds-js';
var PRECACHE_VERSION='v1';
var PRECACHE_URLS=[
	'index.html','./',
	'manifest.json',
	'instant-sounds.js',
	'instant-sounds.soundpack.js',
	'instant-sounds.css',
	'assets/favicon.png',
	'assets/buttons.png',
	'assets/sprites.png',
	'assets/RobotoCondensed.woff2',

	/* audios */
	'soundpack_example/mk_shao_kahn/round_1.mp3',
	'soundpack_example/mk_shao_kahn/round_2.mp3',
	'soundpack_example/mk_shao_kahn/round_3.mp3',
	'soundpack_example/mk_shao_kahn/round_4.mp3',
	'soundpack_example/mk_shao_kahn/fight.mp3',
	'soundpack_example/mk_shao_kahn/finish_him.mp3',
	'soundpack_example/mk_shao_kahn/finish_her.mp3',
	'soundpack_example/mk_shao_kahn/flawless_victory.mp3',
	'soundpack_example/mk_shao_kahn/fatality.mp3',
	'soundpack_example/mk_shao_kahn/laugh_1.mp3',
	'soundpack_example/mk_shao_kahn/laugh_2.mp3',
	'soundpack_example/mk_shao_kahn/laugh_3.mp3',
	'soundpack_example/mk_shao_kahn/laugh_4.mp3',
	'soundpack_example/mk_shao_kahn/excellent.mp3',
	'soundpack_example/mk_shao_kahn/outstanding.mp3',
	'soundpack_example/mk_shao_kahn/superb.mp3',
	'soundpack_example/mk_shao_kahn/well_done.mp3',
	'soundpack_example/resident_evil_4_ganados/agarrenlo.mp3',
	'soundpack_example/resident_evil_4_ganados/ahi_esta.mp3',
	'soundpack_example/resident_evil_4_ganados/ahi_esta_2.mp3',
	'soundpack_example/resident_evil_4_ganados/ahi_esta_3.mp3',
	'soundpack_example/resident_evil_4_ganados/a_por_el.mp3',
	'soundpack_example/resident_evil_4_ganados/a_por_el_2.mp3',
	'soundpack_example/resident_evil_4_ganados/basta_hijo_de_puta.mp3',
	'soundpack_example/resident_evil_4_ganados/basta_hijo_de_puta_2.mp3',
	'soundpack_example/resident_evil_4_ganados/cabron.mp3',
	'soundpack_example/resident_evil_4_ganados/cerebro.mp3',
	'soundpack_example/resident_evil_4_ganados/cogedlo.mp3',
	'soundpack_example/resident_evil_4_ganados/cogedlo_2.mp3',
	'soundpack_example/resident_evil_4_ganados/cogedlo_3.mp3',
	'soundpack_example/resident_evil_4_ganados/detras_de_ti_imbecil.mp3',
	'soundpack_example/resident_evil_4_ganados/detras_de_ti_imbecil_2.mp3',
	'soundpack_example/resident_evil_4_ganados/detras_de_ti_imbecil_3.mp3',
	'soundpack_example/resident_evil_4_ganados/eh_aca.mp3',
	'soundpack_example/resident_evil_4_ganados/empieza_a_rezar.mp3',
	'soundpack_example/resident_evil_4_ganados/matalo.mp3',
	'soundpack_example/resident_evil_4_ganados/mierda.mp3',
	'soundpack_example/resident_evil_4_ganados/mierda_2.mp3',
	'soundpack_example/resident_evil_4_ganados/miralo_esta_herido.mp3',
	'soundpack_example/resident_evil_4_ganados/morir_es_vivir.mp3',
	'soundpack_example/resident_evil_4_ganados/muerte.mp3',
	'soundpack_example/resident_evil_4_ganados/os_voy_a_romper_a_pedazos.mp3',
	'soundpack_example/resident_evil_4_ganados/puedes_correr_pero_no_puedes_escondi.mp3',
	'soundpack_example/resident_evil_4_ganados/quiero_matar.mp3',
	'soundpack_example/resident_evil_4_ganados/quiero_su_cabeza.mp3',
	'soundpack_example/resident_evil_4_ganados/so_cerdo.mp3',
	'soundpack_example/resident_evil_4_ganados/te_voy_a_hacer_picadillo.mp3',
	'soundpack_example/resident_evil_4_ganados/te_voy_a_matar.mp3',
	'soundpack_example/resident_evil_4_ganados/te_voy_a_matar_2.mp3',
	'soundpack_example/resident_evil_4_ganados/un_forastero.mp3',
	'soundpack_example/resident_evil_4_ganados/ya_es_hora_de_asplastar.mp3',
	'soundpack_example/sega/sega.mp3',
	'soundpack_example/sega/sonic_bubble.mp3',
	'soundpack_example/sega/sonic_ring.mp3',
	'soundpack_example/sega/axel.mp3'
];



// install event (fired when sw is first installed): opens a new cache
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open('precache-'+PRECACHE_ID+'-'+PRECACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting())
	);
});


// activate event (fired when sw is has been successfully installed): cleans up old outdated caches
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => (cacheName.startsWith('precache-'+PRECACHE_ID+'-') && !cacheName.endsWith('-'+PRECACHE_VERSION)));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				console.log('delete '+cacheToDelete);
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});


// fetch event (fired when requesting a resource): returns cached resource when possible
self.addEventListener('fetch', evt => {
	if(evt.request.url.startsWith(self.location.origin)){ //skip cross-origin requests
		evt.respondWith(
			caches.match(evt.request).then(cachedResource => {
				if (cachedResource) {
					return cachedResource;
				}else{
					return fetch(evt.request);
				}
			})
		);
	}
});
