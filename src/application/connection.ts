type Unsubscriber = () => void
type MessageHandler<T> = (event: MessageEvent<T>) => void
export type ConnectionStatus = { isConnected: boolean, reconnectAttempts: number }
export type ConnectionStatusHandler = (status: ConnectionStatus) => void

export interface SocketConnection {
  send<T>(data: T): void;
  onMessage<T>(handler: (event: MessageEvent<T>) => void): Unsubscriber;
  onConnectionStatusChange(handler: ConnectionStatusHandler): Unsubscriber;
}

const MAX_DELAY_MS = 30000

export function calculateReconnectDelayMs(reconnectAttempts: number): number {
  return Math.min(2000 * Math.pow(2, Math.min(reconnectAttempts, 10)), MAX_DELAY_MS)
}

export class WsConnection implements SocketConnection {
  private ws!: WebSocket
  private readonly handlers: Set<MessageHandler<any>> = new Set()
  private readonly statusHandlers: Set<ConnectionStatusHandler> = new Set()

  private reconnectAttempts: number = 0

  constructor(private readonly url: string) {
    this.connect()
  }

  private notifyStatusHandlers(isConnected: boolean) {
    this.statusHandlers.forEach(handler => handler({ isConnected, reconnectAttempts: this.reconnectAttempts }))
  }

  private scheduleReconnect() {
    const delayMs = calculateReconnectDelayMs(this.reconnectAttempts)

    setTimeout(() => {
      this.connect()
    }, delayMs)
    this.reconnectAttempts++
  }

  private connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.notifyStatusHandlers(true)
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      this.handlers.forEach(fn => fn(event))
    }

    this.ws.onerror = () => {
      this.notifyStatusHandlers(false)
    }

    this.ws.onclose = () => {
      this.notifyStatusHandlers(false)
      this.scheduleReconnect()
    }
  }

  send<T>(data: T): void {
    this.ws.send(JSON.stringify(data))
  }

  onMessage<T>(handler: MessageHandler<T>): Unsubscriber {
    this.handlers.add(handler)

    return () => this.handlers.delete(handler)
  }

  onConnectionStatusChange(handler: ConnectionStatusHandler): Unsubscriber {
    this.statusHandlers.add(handler)

    return () => this.statusHandlers.delete(handler)
  }
}