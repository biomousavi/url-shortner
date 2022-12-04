export interface Env {
	DB: KVNamespace;
}

import { Router } from 'itty-router'
import { Methods, Request } from './types';

const router = Router<Request, Methods>()




router.get('/', async (request: Request, env: Env, ctx: ExecutionContext) => {

	return new Response('geeeet')
})


function errorHandler() {
	return new Response('Internal Server Error', { status: 500 })
}



export default {
	fetch: (request: Request, env: Env, ctx: ExecutionContext) => router
		.handle(request, env, ctx)
		.then(response => { return response })
		.catch(errorHandler)
}

