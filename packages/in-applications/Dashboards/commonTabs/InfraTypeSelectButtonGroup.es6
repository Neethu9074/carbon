import React from 'react';

import { isInfrastructureProcessTagEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './InfraTypeSelectButtonGroup.mless';

export default function InfraTypeSelectButtonGroup({ selectedType, setType }) {
  return (
    <div className={locals.buttonGroup}>
      {isInfrastructureProcessTagEnabled && (
        <InfraTypeSelectButton type="PROCESS" label="Process" selectedType={selectedType} setType={setType} />
      )}
      {!isInfrastructureProcessTagEnabled && (
        <Tooltip themeStyle="light" align="bottomMiddle" content={'coming soon'}>
          <Button kind="secondary" disabled>
            Process
          </Button>
        </Tooltip>
      )}
      <InfraTypeSelectButton type="DOCKER" label="Container" selectedType={selectedType} setType={setType} />
      <InfraTypeSelectButton type="HOST" label="Host" selectedType={selectedType} setType={setType} />
    </div>
  );
}

function InfraTypeSelectButton({ type, label, selectedType, setType }) {
  return (
    <Button
      kind="secondary"
      className={evaluateClassNames({
        [locals.selected]: type === selectedType
      })}
      onClick={() => setType(type)}
    >
      {label}
    </Button>
  );
}
