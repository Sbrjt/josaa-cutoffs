try {
	importScripts(
		'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'
	)
} catch (e) {
	// If the Workbox CDN fails to load, skip service worker caching setup
	console.error('Failed to load Workbox:', e)
}

if (typeof workbox !== 'undefined') {

// workbox.setConfig({ debug: true })

const {
	routing: { registerRoute, setCatchHandler },
	strategies: { CacheFirst, NetworkFirst, StaleWhileRevalidate },
	cacheableResponse: { CacheableResponse, CacheableResponsePlugin },
	expiration: { ExpirationPlugin, CacheExpiration },
	precaching: { matchPrecache, precacheAndRoute },
} = workbox

// Cache html, script.js, data.db etc using stale-while-revalidate
registerRoute(
	({ request, url }) =>
		request.mode === 'navigate' ||
		url.pathname === '/josaa-cutoffs/script.js' ||
		url.pathname === '/josaa-cutoffs/styles.css' ||
		url.pathname === '/josaa-cutoffs/data.db.gz',
	new StaleWhileRevalidate({
		cacheName: 'stale-while-revalidate',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
		],
	})
)

// Cache cdns and the rest using cache-first
registerRoute(
	() => true,
	new CacheFirst({
		cacheName: 'static-assets',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 32,
				maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
			}),
		],
	})
)

}
