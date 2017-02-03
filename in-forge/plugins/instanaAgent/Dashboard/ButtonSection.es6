import React from 'react';

import ConfigurationYamlDialog from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationYamlDialog';
import {start, stop, resetAgent, resetSensors} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {agentYamlConfigEnabled} from 'in-services/featureFlags';
import Button from 'in-components/Button';

import './ButtonSection.less';


const block = 'in-agent-button-section';

export default function ButtonSection({snapshot}) {
  const metricsAvailable = snapshot.getIn(['data', 'metrics']);

  return (
    <div className={block}>
      <Button className={`${block}__button`}
              onClick={() => resetSensors(snapshot)}
              size='sm'>
        Reset Sensors
      </Button>

      <Button className={`${block}__button`}
              onClick={() => resetAgent(snapshot)}
              size='sm'>
        Reset Agent
      </Button>

      <Button className={`${block}__button`}
              onClick={() => metricsAvailable ? stop(snapshot) : start(snapshot, false)}
              size='sm'>
        {metricsAvailable ? 'Stop' : 'Start'} Self Monitoring
      </Button>

      {agentYamlConfigEnabled ?
        <Button className={`${block}__button`}
                onClick={() => setActiveDialog(<ConfigurationYamlDialog />)}
                size='sm'>
          Edit Config
        </Button>
      : null}
    </div>
  );
}
