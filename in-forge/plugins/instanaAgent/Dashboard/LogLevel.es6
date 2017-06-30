import React from 'react';

import { setLogLevel } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';

import './Mode.less';

const block = 'in-agent-log-level-selector';

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
      <Dialog header="Change Agent Log Level" onClose={close} contentClassName={block}>
        <p>
          Change the logging level of this agent. Currently, this agent is running the log level{' '}
          <strong>{currentLevel}</strong>. Log level changes become active within a few seconds.
        </p>

        <FormGroup>
          <Label htmlFor="agent-loglevel">
            Log Level
          </Label>

          <Select
            id="agent-loglevel"
            value={this.getCurrentlySelectedLevel()}
            onChange={e => this.setState({ level: e.target.value })}
            autoFocus
          >
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
          </Select>
        </FormGroup>

        <div>
          <Button kind="success" onClick={this.switchLogLevel}>
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
