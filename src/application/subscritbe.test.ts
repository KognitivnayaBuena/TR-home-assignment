import { describe, it, expect, vi } from 'vitest';
import { ConnectionStatus, ConnectionStatusHandler, SocketConnection } from './connection';
import { SubscritionsStorage } from './store';
import { Instrument } from '../core/instrument';
import { WebSocketSubscriptionService } from './subscribe';

describe('SubscriptionService', () => {
  class MockedConnection implements SocketConnection {
    statusHandlers = new Set<ConnectionStatusHandler>()

    send = vi.fn();
    onMessage = vi.fn((handler: (event: MessageEvent<any>) => void) => () => { });

    onConnectionStatusChange(handler: ConnectionStatusHandler): () => void {
      this.statusHandlers.add(handler)
      return () => { }
    }

    disconnect() {
      this.statusHandlers.forEach(fn => {
        fn({ isConnected: false, reconnectAttempts: 1 })
      })
    }

    connect() {
      this.statusHandlers.forEach(fn => {
        fn({ isConnected: true, reconnectAttempts: 0 })
      })
    }
  }

  class MockedStorage implements SubscritionsStorage {
    instruments: Instrument[] = []
    add(id: string, instrument: Instrument) {
      this.instruments.push(instrument)
    }
    remove(id: string) {
      const index = this.instruments.findIndex(instrument => instrument.isin === id)
      if (index !== -1) {
        this.instruments.splice(index, 1)
      }
    }
    containsIsin(id: string): boolean {
      return this.instruments.find(instrument => instrument.isin === id) !== undefined
    }
  }

  it("should resubscribe all to all items after reconnect", () => {
    const conn = new MockedConnection()
    const service = new WebSocketSubscriptionService(conn, new MockedStorage())
    service.subscribe("US0378331005")
    service.subscribe("US0378331004")
    service.subscribe("US0378331003")

    expect(conn.send).toHaveBeenCalledTimes(3)

    conn.disconnect()
    conn.connect()

    expect(conn.send).toHaveBeenCalledTimes(6)
  })

  it("should validate ISIN before subscribing", () => {
    const service = new WebSocketSubscriptionService(new MockedConnection(), new MockedStorage())
    const result = service.subscribe("BADISIN")
    expect(result).not.toBeUndefined()
  })
})