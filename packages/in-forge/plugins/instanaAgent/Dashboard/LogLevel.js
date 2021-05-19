/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { setLogLevel } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './LogLevel.mless';

export default class extends React.Component {
  static displayName = t('in-forge:plugins.instanaAgent.dashboard.logLevel');

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
      <Dialog
        title={t('in-forge:plugins.instanaAgent.dashboard.changeAgentLogLevel')}
        onClose={close}
        className={locals.dialog}
      >
        <p>
          <Trans
            i18nKey="in-forge:plugins.instanaAgent.dashboard.changeTheLoggingLevelOfThisAgent"
            values={{ currentLevel: t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: currentLevel }) }}
          />
        </p>

        <FormGroup>
          <Label htmlFor="agent-loglevel">{t('in-forge:plugins.instanaAgent.dashboard.logLevel')}</Label>

          <Select
            id="agent-loglevel"
            value={this.getCurrentlySelectedLevel()}
            onChange={e => this.setState({ level: e.target.value })}
            autoFocus
          >
            <option value="INFO">{t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'INFO' })}</option>
            <option value="DEBUG">{t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'DEBUG' })}</option>
            {role.canSetAgentTraceLogLevel ? (
              <option value="TRACE">
                {t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'TRACE' })}
              </option>
            ) : null}
            ;
          </Select>
        </FormGroup>

        <div>
          <Button kind="create" onClick={this.switchLogLevel}>
            {t('in-forge:plugins.instanaAgent.dashboard.changeLogLevel')}
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
