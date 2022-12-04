import { Request, Route } from "itty-router"

export type MethodType = 'GET' | 'POST'

export interface Methods {
  get: Route
  post: Route
}


export interface TResponse {
  method?: 'sendMessage'
  text?: string
  chat_id?: number
}