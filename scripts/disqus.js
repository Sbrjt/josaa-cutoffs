export async function initDisqus() {
	const doc = document
	const script = doc.createElement('script')
	script.src = 'https://josaa-1.disqus.com/embed.js'
	script.setAttribute('data-timestamp', +new Date())
	;(doc.head || doc.body).appendChild(script)
}
