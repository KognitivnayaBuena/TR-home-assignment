import { makeAutoObservable } from "mobx";
import { Instrument } from "../core/instrument";
import { IsinID } from "../core/isin";

export interface SubscritionsStorage {
  readonly instruments: Instrument[]

  add(id: IsinID, instrument: Instrument): void;
  remove(id: IsinID): void;
  containsIsin(id: IsinID): boolean;
}

export class SubscritionsStore implements SubscritionsStorage {
  private instrumentsMap: Map<string, Instrument> = new Map()

  constructor() {
    makeAutoObservable(this)
  }

  get instruments(): Instrument[] {
    return Array.from(this.instrumentsMap.values())
  }

  add(id: string, instrument: Instrument): void {
    this.instrumentsMap.set(id, instrument)
  }

  remove(id: string): void {
    this.instrumentsMap.delete(id)
  }

  containsIsin(id: string): boolean {
    return this.instrumentsMap.has(id)
  }
}
