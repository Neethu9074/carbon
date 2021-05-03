/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { getButtonKindBySeverity } from 'in-stores/events';

export default function HealthIndicatorButtonPresenter({
  openIssues,
  maxSeverity,
  onClick,
  href$,
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
    <Button kind={kind} icon={icon} onClick={onClick} href$={href$} refSetter={refSetter} disabled={!onClick && !href$}>
      {openIssues}
    </Button>
  );
}
