import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

export default function HealthIndicatorButtonPresenter({ openIssues, maxSeverity, onClick, refSetter }) {
  return (
    <Button
      kind={getButtonKindBySeverity(maxSeverity)}
      icon="lib_help_error_warning"
      onClick={onClick}
      refSetter={refSetter}
    >
      {openIssues}
    </Button>
  );
}
