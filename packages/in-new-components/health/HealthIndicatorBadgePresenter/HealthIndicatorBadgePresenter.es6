import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

export default function HealthIndicatorBadgePresenter({ openIssues, maxSeverity, onClick, refSetter }) {
  return (
    <Button
      kind={getButtonKindBySeverity(maxSeverity)}
      icon="lib_events_inverted"
      onClick={onClick}
      refSetter={refSetter}
    >
      {openIssues}
    </Button>
  );
}
