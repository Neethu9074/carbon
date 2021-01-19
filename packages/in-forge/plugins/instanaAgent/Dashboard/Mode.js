/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { setMode } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Button from 'in-new-components/Button';

import locals from './Mode.mless';

export default class extends React.Component {
  static displayName = 'Mode';

  state = {
    mode: null
  };

  getCurrentlySelectedMode = () => {
    if (this.state.mode != null) {
      return this.state.mode;
    }
    return this.props.snapshot.getIn(['data', 'mode']);
  };

  render() {
    const currentMode = this.props.snapshot.getIn(['data', 'mode']);

    return (
      <Dialog title="Change Agent Mode" onClose={close} className={locals.dialog}>
        <p>
          Change the monitoring detail level of this agent. Currently, this agent is running in the{' '}
          <strong>{modes[currentMode]}</strong> mode. Mode changes become active within a few seconds.
        </p>

        <FormGroup>
          <Label htmlFor="agent-mode">Mode</Label>

          <Select
            id="agent-mode"
            value={this.getCurrentlySelectedMode()}
            onChange={e => this.setState({ mode: parseInt(e.target.value, 10) })}
            autoFocus
          >
            <option value="0">{modes[0]}</option>
            <option value="1">{modes[1]}</option>
            <option value="2">{modes[2]}</option>
          </Select>
        </FormGroup>

        <div>
          <Button kind="create" onClick={this.switchMode}>
            Change Mode
          </Button>
        </div>
      </Dialog>
    );
  }

  switchMode = () => {
    setMode(this.props.snapshot, this.getCurrentlySelectedMode());
    close();
  };
}
