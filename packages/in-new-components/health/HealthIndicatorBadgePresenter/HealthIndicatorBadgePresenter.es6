import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

export default function HealthIndicatorBadgePresenter({ openIssues, maxSeverity, href, href$ }) {
  return (
    <Button kind={getButtonKindBySeverity(maxSeverity)} icon="lib_events_inverted" href={href} href$={href$}>
      {openIssues}
    </Button>
  );
}
