import React from 'react';

import {setMode} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import {modes} from 'in-forge/plugins/instanaAgent/modes';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';

import './Mode.less';

const block = 'in-agent-mode-selector';

export default React.createClass({
  displayName: 'Mode',

  getInitialState() {
    return {
      mode: null
    };
  },

  getCurrentlySelectedMode() {
    if (this.state.mode) {
      return this.state.mode;
    }
    return this.props.snapshot.getIn(['data', 'mode']);
  },

  render() {
    const currentMode = this.props.snapshot.getIn(['data', 'mode']);

    return (
      <Dialog header='Change Agent Mode'
              onClose={close}
              contentClassName={block}>
        <p>
          Change the monitoring detail level of this agent. Currently, this agent is running in the{' '}
          <strong>{modes[currentMode]}</strong> mode. Mode changes become active within a few seconds.
        </p>

        <FormGroup>
          <Label htmlFor='agent-mode'>
            Mode
          </Label>

          <Select id='agent-mode'
                 value={this.getCurrentlySelectedMode()}
                 onChange={e => this.setState({mode: parseInt(e.target.value, 10)})}
                 autoFocus>
            <option value='0'>{modes[0]}</option>
            <option value='1'>{modes[1]}</option>
            <option value='2'>{modes[2]}</option>
          </Select>
        </FormGroup>

        <div>
          <Button kind='success'
                  onClick={this.switchMode}>
            Change Mode
          </Button>
        </div>
      </Dialog>
    );
  },

  switchMode() {
    setMode(this.props.snapshot, this.getCurrentlySelectedMode());
    close();
  }
});
