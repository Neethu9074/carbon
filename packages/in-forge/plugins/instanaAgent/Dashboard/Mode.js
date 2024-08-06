/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Select, Button } from '@instana/components';

import { setMode } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import { Trans, t } from 'in-i18n';

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
      <Dialog
        title={t('in-forge:plugins.instanaAgent.dashboard.changeAgentMode')}
        onClose={close}
        className={locals.dialog}
      >
        <p>
          <Trans
            i18nKey="in-forge:plugins.instanaAgent.dashboard.changeTheMonitoringDetailLevelOfThisAgent"
            values={{ currentMode: modes[currentMode] }}
          />
        </p>

        <FormGroup>
          <Label htmlFor="agent-mode">{t('in-forge:plugins.instanaAgent.dashboard.mode')}</Label>

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
            {t('in-forge:plugins.instanaAgent.dashboard.changeMode')}
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
