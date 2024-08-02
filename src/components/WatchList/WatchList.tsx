import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SubscriptionService } from '../../application/subscribe';
import Button from '../Button/Button';
import { SubscritionsStorage } from '../../application/store';
import { Instrument } from '../../core/instrument';

import classes from './WatchList.module.css';

export class WatchListVm {
  constructor(
    private readonly subscritions: SubscritionsStorage,
    private readonly subscritionService: SubscriptionService,
  ) {
    makeAutoObservable(this)
  }

  removeInstrument(instrument: Instrument) {
    this.subscritionService.unsubscribe(instrument.isin)
  }

  get items(): Instrument[] {
    return this.subscritions.instruments
  }
}

interface WatchListProps {
  vm: WatchListVm
}

const WatchList: React.FC<WatchListProps> = observer(({ vm }) => {
  return (
    <div className={classes["watch-list-wrapper"]}>
      <ul className={classes["list"]}>
        {vm.items.length == 0 && (
          <div className={classes["watch-list-empty"]}>
            <p>No items in the watchlist. Add an ISIN of the item you want to follow in the form.</p>
          </div>
        )}
        {vm.items.map((instrument) => (
          <li className={classes["list-item"]} key={instrument.isin}>
            <div className={classes["list-item-main"]}>
              {instrument.isin}

              <span>{instrument.price}</span>
            </div>
            <div className={classes["list-item-secondary"]}>
              <div className={classes["list-item-prices"]}>
                <div>Ask: {instrument.ask}</div>
                <div>Bid: {instrument.bid}</div>
              </div>
              <Button onClick={() => vm.removeInstrument(instrument)}>Stop watching</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default WatchList;
