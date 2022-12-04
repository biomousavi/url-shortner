import { Route } from "itty-router"

export type MethodType = 'GET' | 'POST' 

export interface Request {
  method: MethodType 
  url: string
  optional?: string
}


export interface Methods {
  get: Route
  post: Route
}