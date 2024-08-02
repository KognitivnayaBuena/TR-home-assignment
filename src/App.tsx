import React, { useEffect, useState } from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

import { ConnectionBar, ConnectionBarVm } from './components/ConnectionBar/ConnectionBar';
import InstrumentForm, { IsinFormVm } from './components/InstrumentForm/InstrumentForm';
import WatchList, { WatchListVm } from './components/WatchList/WatchList';

import { WsConnection } from './application/connection';
import { SubscritionsStore } from './application/store';
import { WebSocketSubscriptionService } from './application/subscribe';

import './App.css';
import './index.css';


export class AppVm {
  private readonly connection = new WsConnection('ws://localhost:8425/')
  private readonly subStore = new SubscritionsStore()
  private readonly subService = new WebSocketSubscriptionService(this.connection, this.subStore)

  readonly isinFormVm = new IsinFormVm(this.subService)
  readonly watchListVm = new WatchListVm(this.subStore, this.subService)
  readonly connectionVm = new ConnectionBarVm(this.connection)

  constructor() {
    makeAutoObservable(this)
  }
}

interface AppProps {
  vm: AppVm
}

const App: React.FC<AppProps> = observer(({ vm }) => {
  return (
    <div className="app-wrapper">
      <ConnectionBar vm={vm.connectionVm} />
      <h1 className="app-title">Watch List</h1>
      <div className="instrument-list">
        <WatchList vm={vm.watchListVm} />
        <InstrumentForm vm={vm.isinFormVm} />
      </div>

    </div>
  );
})

export default App;
