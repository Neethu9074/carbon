/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { setLogLevel } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import { isInstanaEngineer } from 'in-stores/user';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Button from 'in-new-components/Button';

import locals from './LogLevel.mless';

export default class extends React.Component {
  static displayName = 'Log Level';

  state = {
    level: null
  };

  getCurrentlySelectedLevel = () => {
    if (this.state.level != null) {
      return this.state.level;
    }
    return this.props.snapshot.getIn(['data', 'loglevel']);
  };

  render() {
    const currentLevel = this.props.snapshot.getIn(['data', 'loglevel']);

    return (
      <Dialog title="Change Agent Log Level" onClose={close} className={locals.dialog}>
        <p>
          Change the logging level of this agent. Currently, this agent is running the log level{' '}
          <strong>{currentLevel}</strong>. Log level changes become active within a few seconds.
        </p>

        <FormGroup>
          <Label htmlFor="agent-loglevel">Log Level</Label>

          <Select
            id="agent-loglevel"
            value={this.getCurrentlySelectedLevel()}
            onChange={e => this.setState({ level: e.target.value })}
            autoFocus
          >
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
            {isInstanaEngineer ? <option value="TRACE">TRACE</option> : null};
          </Select>
        </FormGroup>

        <div>
          <Button kind="create" onClick={this.switchLogLevel}>
            Change Log Level
          </Button>
        </div>
      </Dialog>
    );
  }

  switchLogLevel = () => {
    setLogLevel(this.props.snapshot, this.getCurrentlySelectedLevel());
    close();
  };
}
