export interface Env {
	DB: KVNamespace;
	TELEGRAM_BOT_ADMIN_USERNAME: number
	TELEGRAM_BOT_TOKEN: string
	DOMAIN: string
}

import { Router, Request } from 'itty-router'
import { Methods, TResponse } from './types';

const router = Router<Request, Methods>()



// telegram webhook handler
router.post('/:path', async (request: Request, env: Env) => {
	try {

		const { path } = request.params!
		const body = await request.json?.()
		const response: TResponse = { method: 'sendMessage', chat_id: body.message.from?.id }

		// throw Error if path does not exist
		if (path !== env.TELEGRAM_BOT_TOKEN) throw Error('Invalid Token.')

		const [shortName, url] = body.message.text.split(" ");

		// store the shortName and url in KV
		await env.DB.put(shortName, url);


		// skip if the user was not admin
		if (body.message.from?.username !== env.TELEGRAM_BOT_ADMIN_USERNAME)
			response.text = "This feature is only available to the admin"
		else
			response.text = `${env.DOMAIN + '/' + shortName} redirects you to ${url} `



		return new Response(
			JSON.stringify(response),
			{ status: 200, headers: new Headers({ "Content-Type": "application/json" }) }
		)
	} catch (error) {
		const message = (error as Error).message || 'Not Found.'
		return new Response(message, { status: 404 })
	}

})


// Handle redirects
router.get('/:path', async (request: Request, env: Env) => {

	try {

		const { path } = request.params!

		// if path does not exist
		if (!path) throw Error('path is required.')

		// if db does not have the path
		const url = await env.DB.get(path)

		if (!url) throw Error('URL does not exist.')


		// extract path from 
		return Response.redirect(url)


	} catch (error) {
		const message = (error as Error).message || 'Not Found.'
		return new Response(message, { status: 404 })
	}
})



// catch other requests
router.all('*', () => new Response('Not Found.', { status: 404 }))



// Handle unknown errors
function errorHandler() {
	return new Response('Internal Server Error', { status: 500 })
}



export default {
	fetch: (request: Request, env: Env, ctx: ExecutionContext) => router
		.handle(request, env, ctx)
		.then(response => { return response })
		.catch(errorHandler)
}

