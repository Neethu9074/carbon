import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

export default function HealthIndicatorButtonPresenter({
  openIssues,
  maxSeverity,
  onClick,
  refSetter,
  showCheckAsNeutral = false
}) {
  let kind;
  let icon;
  if (maxSeverity === 0 && showCheckAsNeutral) {
    kind = 'create';
    icon = 'lib_check';
  } else {
    kind = getButtonKindBySeverity(maxSeverity);
    icon = 'lib_help_error_warning';
  }

  return (
    <Button kind={kind} icon={icon} onClick={onClick} refSetter={refSetter}>
      {openIssues}
    </Button>
  );
}
