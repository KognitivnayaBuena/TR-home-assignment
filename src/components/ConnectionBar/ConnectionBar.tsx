import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable, runInAction } from 'mobx';

import Alert, { AlertType } from '../Alert/Alert';
import { SocketConnection, calculateReconnectDelayMs } from '../../application/connection';

import classses from "./ConnectionBar.module.css"

export class ConnectionBarVm {
  errorMessage: string = ""
  isOnline: boolean = true

  constructor(
    private readonly connection: SocketConnection
  ) {
    makeAutoObservable(this)

    // this.connection.onConnectionStatusChange(status => {
    //   runInAction(() => {
    //     if (!status.isConnected) {
    //       this.showErrorMessage(status.reconnectAttempts)
    //     } else if (this.errorMessage) {
    //       this.showSuccessMessage()
    //     }
    //   })
    // })

    this.connection.onConnectionStatusChange(status => {
      if (!status.isConnected) {
        this.showErrorMessage(status.reconnectAttempts)
      } else if (this.errorMessage) {
        this.showSuccessMessage()
      }
    })

  }

  private showSuccessMessage() {
    this.isOnline = true
    this.errorMessage = "Connection was restored"

    setTimeout(() => {
      this.errorMessage = ""
    }, 2000)
  }

  private showErrorMessage(attemts: number) {
    this.isOnline = false
    let delaySeconds = calculateReconnectDelayMs(attemts) / 1000

    const intervalId = setInterval(() => {
      this.errorMessage = `Connection was lost. Data can be innacurate. Reconnecting in ${delaySeconds} seconds`

      delaySeconds--
      if (delaySeconds <= 0) {
        clearInterval(intervalId)
      }
    }, 1000)
  }
}

interface ConnectionBarProps {
  vm: ConnectionBarVm;
}

export const ConnectionBar: React.FC<ConnectionBarProps> = observer(({ vm }) => {
  return (
    <div className={`${classses.root} ${vm.errorMessage ? classses.show : ""}`}>
      <Alert type={vm.isOnline ? AlertType.Success : AlertType.Error} message={vm.errorMessage} />
    </div>
  );
})