/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  track,
  AGENT_REBOOT_CLICKED,
  AGENT_RESET_CLICKED,
  AGENT_UPDATE_CLICKED,
  AGENT_SENSOR_RESET_INTERNAL_CLICKED
} from 'in-services/tracking/tracking';
import { resetAgent, resetSensors, updateAgent, rebootAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import LogLevel from 'in-forge/plugins/instanaAgent/Dashboard/LogLevel';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/Mode';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ManagementButtonSection.mless';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function ManagementButtonSection({ snapshot, isInternalVisible }) {
    const [role] = useCurrentUserRole();
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
          <ImageButton
            iconType="lib_actions_refresh"
            onClick={() => {
              track(AGENT_UPDATE_CLICKED);
              updateAgent(snapshot);
            }}
          >
            {t('in-forge:plugins.instanaAgent.dashboard.updateAgent')}
          </ImageButton>
        ) : null}

        {isInternalVisible && role.canConfigureAgents ? (
          // Resetting the sensors is a feature that we almost never use, restrict it to instana engineer
          <ImageButton
            iconType="lib_actions_refresh"
            onClick={() => {
              track(AGENT_SENSOR_RESET_INTERNAL_CLICKED);
              resetSensors(snapshot);
            }}
          >
            {t('in-forge:plugins.instanaAgent.dashboard.resetSensors')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton
            iconType="lib_actions_refresh"
            onClick={() => {
              track(AGENT_RESET_CLICKED);
              resetAgent(snapshot);
            }}
          >
            {t('in-forge:plugins.instanaAgent.dashboard.resetAgent')}
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton
            iconType="lib_actions_refresh"
            onClick={() => {
              track(AGENT_REBOOT_CLICKED);
              rebootAgent(snapshot);
            }}
          >
            {t('in-forge:plugins.instanaAgent.dashboard.rebootAgent')}
          </ImageButton>
        ) : null}
      </div>
    );
  }
);
