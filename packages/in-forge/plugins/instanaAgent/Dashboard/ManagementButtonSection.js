import React from 'react';

import { resetAgent, resetSensors, updateAgent, rebootAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import LogLevel from 'in-forge/plugins/instanaAgent/Dashboard/LogLevel';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/Mode';
import { isInstanaEngineer } from 'in-stores/user';
import { role } from 'in-stores/user';

import locals from './ManagementButtonSection.mless';

export default function ManagementButtonSection({ snapshot }) {
  return (
    <div className={locals.wrapper}>
      {role.canConfigureAgentRunMode ? (
        <ImageButton iconType="gear" onClick={() => setActiveDialog(<Mode snapshot={snapshot} />)}>
          Change Agent Mode
        </ImageButton>
      ) : null}

      <ImageButton iconType="gear" onClick={() => setActiveDialog(<LogLevel snapshot={snapshot} />)}>
        Change Log Level
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => updateAgent(snapshot)}>
        Update Agent
      </ImageButton>
      {isInstanaEngineer ? (
        // Resetting the sensors is a feature that we almost never use, restrict it to instana engineer
        <ImageButton iconType="refresh" onClick={() => resetSensors(snapshot)}>
          Reset Sensors
        </ImageButton>
      ) : null}

      <ImageButton iconType="refresh" onClick={() => resetAgent(snapshot)}>
        Reset Agent
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => rebootAgent(snapshot)}>
        Reboot Agent
      </ImageButton>
    </div>
  );
}
