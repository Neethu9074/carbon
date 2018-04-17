import React from 'react';

import {
  start,
  stop,
  resetAgent,
  resetSensors,
  updateAgent,
  rebootAgent
} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import LogLevel from 'in-forge/plugins/instanaAgent/Dashboard/new/components/LogLevel';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/new/components/Mode';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import { role } from 'in-stores/user';

import './ButtonSection.less';

const block = 'in-agent-button-section';

export default function ButtonSection({ snapshot }) {
  const metricsAvailable = snapshot.getIn(['data', 'metrics']);

  return (
    <div className={block}>
      {role.canConfigureAgentRunMode ? (
        <ImageButton iconType="gear" onClick={() => changeMode(snapshot)}>
          Change Agent Mode
        </ImageButton>
      ) : null}

      <ImageButton iconType="gear" onClick={() => changeLogLevel(snapshot)}>
        Change Log Level
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => updateAgent(snapshot)}>
        Update Agent
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => resetSensors(snapshot)}>
        Reset Sensors
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => resetAgent(snapshot)}>
        Reset Agent
      </ImageButton>

      <ImageButton
        iconType={metricsAvailable ? 'zone' : 'chevron_right'}
        onClick={() => (metricsAvailable ? stop(snapshot) : start(snapshot, false))}
      >
        {metricsAvailable ? 'Stop' : 'Start'} Self Monitoring
      </ImageButton>

      <ImageButton iconType="refresh" onClick={() => rebootAgent(snapshot)}>
        Reboot Agent
      </ImageButton>
    </div>
  );
}

function ImageButton({ className, children, iconType, onClick }) {
  return (
    <Button className={`${block}__button` + (className ? ` ${className}` : '')} onClick={onClick} size="lg">
      <div className={`${block}__icon-wrapper`}>
        <SvgIcon type={iconType} width={14} height={14} color="#9fffff" />
      </div>
      {children}
    </Button>
  );
}

function changeMode(snapshot) {
  setActiveDialog(<Mode snapshot={snapshot} />);
}

function changeLogLevel(snapshot) {
  setActiveDialog(<LogLevel snapshot={snapshot} />);
}
