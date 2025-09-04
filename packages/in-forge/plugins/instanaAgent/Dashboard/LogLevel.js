/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Select, Button } from '@instana/components';

import { setLogLevel } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import { Trans, t } from 'in-i18n';

import locals from './LogLevel.mless';

const LogLevel = props => {
  const [role] = useCurrentUserRole();
  const [level, setLevel] = useState(null);

  const getCurrentlySelectedLevel = () => {
    if (level != null) {
      return level;
    }
    return props.snapshot.getIn(['data', 'loglevel']);
  };

  const switchLogLevel = () => {
    setLogLevel(props.snapshot, getCurrentlySelectedLevel());
    close();
  };

  const currentLevel = props.snapshot.getIn(['data', 'loglevel']);

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
          value={getCurrentlySelectedLevel()}
          onChange={e => setLevel(e.target.value)}
          autoFocus
        >
          <option value="INFO">{t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'INFO' })}</option>
          <option value="DEBUG">{t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'DEBUG' })}</option>
          {role.canSetAgentTraceLogLevel ? (
            <option value="TRACE">{t('in-forge:plugins.instanaAgent.dashboard.logLevel', { context: 'TRACE' })}</option>
          ) : null}
          ;
        </Select>
      </FormGroup>

      <div>
        <Button kind="create" onClick={switchLogLevel}>
          {t('in-forge:plugins.instanaAgent.dashboard.changeLogLevel')}
        </Button>
      </div>
    </Dialog>
  );
};

LogLevel.displayName = t('in-forge:plugins.instanaAgent.dashboard.logLevel');

export default LogLevel;
