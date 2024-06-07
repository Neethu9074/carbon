/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error needs TS migration
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import HealthDot from 'in-components/health/HealthDot';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function EntityHealthDot({ snapshotId }: { snapshotId: string }) {
  const snapshot = useObservable<Map<string, string | number>, []>(getHealthInfoAtFocusedMoment(snapshotId), []);

  if (!snapshot) return null;

  const severity = snapshot.get('maxSeverity') as number | undefined;
  const numberOfIssues = snapshot.get('numberOfOpenEvents');
  const tooltipText =
    numberOfIssues === 0
      ? t('in-logging:tooltipEntityHealthNoIssues')
      : t('in-logging:tooltipEntityHealthIssues', { numberOfIssues });

  return (
    <Tooltip align="leftMiddle" delay={300} content={tooltipText}>
      <div>
        <HealthDot severity={severity} />
      </div>
    </Tooltip>
  );
}
