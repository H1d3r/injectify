import { Injectify } from '../../../definitions/core'
import Listener from './Listener'
import Topics from './Topics'
declare const injectify: typeof Injectify
const pako = require('pako')
const ws: WebSocket = (<any>window).ws || (<any>window).i‍ // <- invisible space
const CircularJSON = require('circular-json')

export default class {
  static send(topic: string, data?: any) {
    /**
     * If the websocket is dead, return
     */
    if (ws.readyState !== ws.OPEN) return
    const json = CircularJSON.stringify(data)
    let transport = `${topic}${json ? ':' + json : ''}`
    if (injectify.info.server.compression) {
      transport = '#' + pako.deflate(transport, { to: 'string' })
    }
    ws.send(transport)
  }

  static ping(callback?: any) {
    this.send('ping', +new Date())
    if (callback) injectify.listen('pong', callback, true)
  }

  static listener = Listener

  static topics = Topics
}