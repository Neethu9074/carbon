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
            Change Agent Mode
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton
            iconType="lib_actions_settings"
            onClick={() => addActiveDialog(<LogLevel snapshot={snapshot} />)}
          >
            Change Log Level
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => updateAgent(snapshot)}>
            Update Agent
          </ImageButton>
        ) : null}

        {isInternalVisible && role.canConfigureAgents ? (
          // Resetting the sensors is a feature that we almost never use, restrict it to instana engineer
          <ImageButton iconType="lib_actions_refresh" onClick={() => resetSensors(snapshot)}>
            Reset Sensors
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => resetAgent(snapshot)}>
            Reset Agent
          </ImageButton>
        ) : null}

        {role.canConfigureAgents ? (
          <ImageButton iconType="lib_actions_refresh" onClick={() => rebootAgent(snapshot)}>
            Reboot Agent
          </ImageButton>
        ) : null}
      </div>
    );
  }
);
