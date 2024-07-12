importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js')

// workbox.setConfig({ debug: true })

const {
	routing: { registerRoute, setCatchHandler },
	strategies: { CacheFirst, NetworkFirst, StaleWhileRevalidate },
	cacheableResponse: { CacheableResponse, CacheableResponsePlugin },
	expiration: { ExpirationPlugin, CacheExpiration },
	precaching: { matchPrecache, precacheAndRoute }
} = workbox

// Cache html, script.js
registerRoute(
	({ request, url }) =>
		request.mode === 'navigate' ||
		url.pathname === '/script.js' ||
		url.pathname === '/styles.css' ||
		url.pathname === '/data.db.gz',
	new StaleWhileRevalidate({
		cacheName: 'stale-while-revalidate',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200]
			})
		]
	})
)

// Cache cdns and the rest
registerRoute(
	({ request }) =>
		request.destination === 'script' ||
		request.destination === 'style' ||
		request.destination === 'manifest' ||
		request.destination === 'worker',
	new CacheFirst({
		cacheName: 'static-assets',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxEntries: 32,
				maxAgeSeconds: 24 * 60 * 60 * 7 // 1 week
			})
		]
	})
)
