/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { resetAgent, resetSensors, updateAgent, rebootAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import LogLevel from 'in-forge/plugins/instanaAgent/Dashboard/LogLevel';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/Mode';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ManagementButtonSection.mless';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function ManagementButtonSection({ snapshot, isInternalVisible }) {
    return (
      <div className={locals.wrapper}>
        {role.canConfigureAgentRunMode ? (
          <ImageButton iconType="lib_actions_settings" onClick={() => addActiveDialog(<Mode snapshot={snapshot} />)}>
            {t('in-forge:plugins.instanaAgent.dashboard.changeAgentMode')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton
            iconType="lib_actions_settings"
            onClick={() => addActiveDialog(<LogLevel snapshot={snapshot} />)}
          >
            {t('in-forge:plugins.instanaAgent.dashboard.changeLogLevel')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => updateAgent(snapshot)}>
            {t('in-forge:plugins.instanaAgent.dashboard.updateAgent')}
          </ImageButton>
        ) : null}

        {isInternalVisible && role.canConfigureAgents ? (
          // Resetting the sensors is a feature that we almost never use, restrict it to instana engineer
          <ImageButton iconType="lib_actions_refresh" onClick={() => resetSensors(snapshot)}>
            {t('in-forge:plugins.instanaAgent.dashboard.resetSensors')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => resetAgent(snapshot)}>
            {t('in-forge:plugins.instanaAgent.dashboard.resetAgent')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => rebootAgent(snapshot)}>
            {t('in-forge:plugins.instanaAgent.dashboard.rebootAgent')}
          </ImageButton>
        ) : null}
      </div>
    );
  }
);
