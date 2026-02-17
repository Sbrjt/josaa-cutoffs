/* global workbox */

// this service worker is used for caching assets so improve load time

importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
)

// workbox.setConfig({ debug: true })

const {
	routing: { registerRoute, setCatchHandler },
	strategies: { CacheFirst, NetworkFirst, StaleWhileRevalidate },
	cacheableResponse: { CacheableResponse, CacheableResponsePlugin },
	expiration: { ExpirationPlugin, CacheExpiration },
	precaching: { matchPrecache, precacheAndRoute },
} = workbox

// Cache all site resources (html, scripts, stylesheet, etc.) using stale-while-revalidate
registerRoute(
	({ url }) => url.pathname.includes('josaa-cutoffs'),
	new StaleWhileRevalidate({
		cacheName: 'stale-while-revalidate',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
		],
	}),
)

// Cache external CDNs and third-party libraries using cache-first
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
	}),
)
