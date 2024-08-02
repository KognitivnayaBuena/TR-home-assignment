import { Instrument } from "../core/instrument";
import { IsinID, ValidationError, ValidationErrorReason, validateIsin } from "../core/isin";
import { ConnectionStatus, SocketConnection } from "./connection";
import { SubscritionsStorage } from "./store";

export interface SubscriptionService {
  subscribe(id: IsinID): ValidationError | void;
  unsubscribe(id: IsinID): void;
}

export class WebSocketSubscriptionService implements SubscriptionService {
  constructor(
    private readonly connection: SocketConnection,
    private readonly subscrtions: SubscritionsStorage
  ) {
    this.connection.onMessage(this.handleMessage.bind(this));
    this.connection.onConnectionStatusChange(this.handleStatusChange.bind(this));
  }

  subscribe(id: IsinID): ValidationError | void {
    const validationError = validateIsin(id)

    if (validationError) {
      return validationError
    }

    if (this.subscrtions.containsIsin(id)) {
      return { reason: ValidationErrorReason.ALREADY_SUBSCRIBED }
    }

    this.connection.send({ subscribe: id });
    this.subscrtions.add(id, { isin: id, price: 0.0, bid: 0.0, ask: 0.0 })
  }

  unsubscribe(id: IsinID): void {
    if (!this.subscrtions.containsIsin(id)) {
      return;
    }

    this.connection.send({ unsubscribe: id });
    this.subscrtions.remove(id);
  }

  private handleMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data) as Instrument

    if (this.subscrtions.containsIsin(data.isin)) {
      this.subscrtions.add(data.isin, data)
    }
  }

  private handleStatusChange(status: ConnectionStatus): void {
    if (status.isConnected) {
      this.subscrtions.instruments.forEach(item =>
        this.connection.send({ subscribe: item.isin })
      )
    }
  }
}