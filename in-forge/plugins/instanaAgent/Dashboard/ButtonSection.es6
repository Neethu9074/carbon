import React from 'react';

import ConfigurationYamlDialog from 'promise?global!in-forge/plugins/instanaAgent/Dashboard/ConfigurationYamlDialog';
import {start, stop, resetAgent, resetSensors} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import {createAsyncComponent} from 'in-components/routing/createAsyncComponent';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import Mode from 'in-forge/plugins/instanaAgent/Dashboard/Mode';
import {agentYamlConfigEnabled} from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicator';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import {role} from 'in-stores/user';

import './ButtonSection.less';

// load the dialog async because of we want to avoid initial load of maybe unneeded frameworks like js-yaml
export const AsyncConfigurationYamlDialogWrapper = createAsyncComponent(<LoadingIndicator type='dark' />, ConfigurationYamlDialog);

const block = 'in-agent-button-section';

export default function ButtonSection({snapshot}) {
  const metricsAvailable = snapshot.getIn(['data', 'metrics']);

  return (
    <div className={block}>
      {role.canConfigureAgentRunMode ?
        <ImageButton iconType='gear'
                     onClick={() => changeMode(snapshot)}>
          Change Agent Mode
        </ImageButton>
      : null}

      <ImageButton iconType='refresh'
                   onClick={() => resetSensors(snapshot)}>
        Reset Sensors
      </ImageButton>

      <ImageButton iconType='refresh'
                   onClick={() => resetAgent(snapshot)}>
        Reset Agent
      </ImageButton>

      <ImageButton iconType={metricsAvailable ? 'zone' : 'chevron_right'}
                   onClick={() => metricsAvailable ? stop(snapshot) : start(snapshot, false)}>
        {metricsAvailable ? 'Stop' : 'Start'} Self Monitoring
      </ImageButton>

      {agentYamlConfigEnabled ?
        <ImageButton className={`${block}__config-button`}
                     iconType='letter'
                     onClick={() => setActiveDialog(<AsyncConfigurationYamlDialogWrapper snapshot={snapshot} />)}>
          Edit Config
        </ImageButton>
      : null}
    </div>
  );
}

function ImageButton({className, children, iconType, onClick}) {
  return (
    <Button className={`${block}__button` + (className ? ` ${className}` : '')}
            onClick={onClick}
            size='sm'>
      <SvgIcon className={`${block}__icon`}
               type={iconType}
               width={14}
               height={14}
               color='#172429' />
      {children}
    </Button>
  );
}


function changeMode(snapshot) {
  setActiveDialog(<Mode snapshot={snapshot} />);
}
