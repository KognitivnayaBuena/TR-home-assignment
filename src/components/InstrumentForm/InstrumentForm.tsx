import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

import Button from '../Button/Button';
import TextField from '../TextField/TextField';
import Tooltip from '../Tooltip/Tooltip';

import { SubscriptionService } from '../../application/subscribe';
import { ValidationErrorReason } from '../../core/isin';
import classes from "./InstrumentForm.module.css";

interface InstrumentFormProps {
  vm: IsinFormVm
}

export class IsinFormVm {
  isin: string = ''
  validationError: string = ''

  constructor(private readonly subService: SubscriptionService) {
    makeAutoObservable(this)
  }

  addInstrument() {
    const validationResult = this.subService.subscribe(this.isin.replace(/\s+/g, ''))

    if (validationResult) {
      switch (validationResult.reason) {
        case ValidationErrorReason.WRONG_LENGTH:
          this.validationError = 'ISIN must be 12 characters long'
          break
        case ValidationErrorReason.ALREADY_SUBSCRIBED:
          this.validationError = 'This ISIN is already in the watchlist'
          break
        case ValidationErrorReason.INVALID_FORMAT:
          this.validationError = 'ISIN must be in the format of AA0000000000. Check out help for more info'
          break
        default: {
          this.validationError = 'Unknown error'
        }
      }
    }
  }

  handleIsinChange(rawValue: string) {
    this.validationError = ""

    let value = rawValue.replace(/[^a-zA-Z0-9]/g, '');
    if (value.length > 2) value = value.slice(0, 2) + ' ' + value.slice(2);
    if (value.length > 12) value = value.slice(0, 12) + ' ' + value.slice(12, 13);

    this.isin = value
  }
}

const InstrumentForm: React.FC<InstrumentFormProps> = observer(({ vm }) => {
  return (
    <div className={classes["instrument-form-wrapper"]}>
      <form className={classes["instrument-form"]} onSubmit={e => {
        e.preventDefault()
        vm.addInstrument()
      }}>
        <div className={classes["input-container"]}>
          <TextField
            type="text"
            value={vm.isin}
            onChange={v => vm.handleIsinChange(v)}
            placeholder="US 037833100 5"
            label={
              <div className={classes["label-container"]}>
                <span>Enter ISIN</span>
                <Tooltip
                  content="An ISIN is a 12-character alphanumeric code. It consists of three parts: A two letter country code, a nine character alpha-numeric national security identifier, and a single check digit"
                >
                  <span className={classes["tooltip-icon"]}>?</span>
                </Tooltip>
              </div>
            }
          />
        </div>

        <Button className={classes["submit-form"]} type="submit">Add to watchlist</Button>

        {vm.validationError && <p className={classes["error-message-isin-validation"]}>{vm.validationError}</p>}
      </form>
    </div>
  );
})

export default InstrumentForm;
