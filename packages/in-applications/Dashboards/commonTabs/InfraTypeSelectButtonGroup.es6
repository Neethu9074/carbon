import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';

import locals from './InfraTypeSelectButtonGroup.mless';

export default function InfraTypeSelectButtonGroup({ selectedType, setType }) {
  return (
    <div className={locals.buttonGroup}>
      <InfraTypeSelectButton type="PROCESS" label="Process" selectedType={selectedType} setType={setType} />
      <InfraTypeSelectButton type="DOCKER" label="Container" selectedType={selectedType} setType={setType} />
      <InfraTypeSelectButton type="HOST" label="Host" selectedType={selectedType} setType={setType} />
    </div>
  );
}

function InfraTypeSelectButton({ type, label, selectedType, setType }) {
  return (
    <Button
      kind="secondary"
      size="normal"
      className={evaluateClassNames({
        [locals.infraTypeSelectButton]: true,
        [locals.selected]: type === selectedType
      })}
      onClick={() => setType(type)}
    >
      {label}
    </Button>
  );
}
