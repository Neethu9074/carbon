import React from 'react';

import { resetAgent, resetSensors, updateAgent, rebootAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import SensorsInfo from 'in-forge/plugins/instanaAgent/Dashboard/SensorsInfo';
import LogLevel from 'in-forge/plugins/instanaAgent/Dashboard/LogLevel';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/Mode';
import { isInstanaEngineer } from 'in-stores/user';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';

import locals from './ButtonSection.mless';

export default function ButtonSection({ snapshot }) {
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

      <ImageButton iconType="popup" onClick={() => setActiveDialog(<SensorsInfo snapshot={snapshot} />)}>
        Sensors Info
      </ImageButton>
    </div>
  );
}

function ImageButton({ children, iconType, onClick }) {
  return (
    <Button icon={iconType} kind="secondary" onClick={onClick}>
      {children}
    </Button>
  );
}
