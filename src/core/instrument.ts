import { IsinID } from "./isin"

export type Instrument = {
  isin: IsinID
  price: number
  bid: number
  ask: number
}