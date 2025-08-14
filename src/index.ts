/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const regex2 =
  /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/

export default {
	async fetch(): Promise<Response> {
		const html = await fetch('https://crumblcookies.com').then((res) =>
			res.text(),
		)
		const json = html.match(regex2)?.[1] ?? "{}";
		const data = JSON.parse(json)
		const fullCookiesData = data.props.pageProps.products.cookies
		const cookiesData = fullCookiesData
		.filter(
			({ name }: { name: string }) =>
				name !== 'Milk Chocolate Chip' &&
					name !== 'Chilled Sugar' &&
					name !== '❄️ Sugar' &&
					name !== 'Sugar' &&
					name !== 'Classic Sugar',
		)
		.map((
			{ name, description, newAerialImage }: { name: string, description: string, newAerialImage: string }
		) => ({
			name,
			description,
			image: newAerialImage,
		}))

		return new Response(JSON.stringify(cookiesData), {
			headers: { 'content-type': 'application/json;charset=UTF-8' },
		})
	},
};
