/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
//@ts-expect-error needs TS migration
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './EntityHealthIcon.mless';

export default function EntityHealthIcon({ snapshotId }: { snapshotId: string }) {
  const snapshot = useObservable<Map<string, string | number>, []>(getHealthInfoAtFocusedMoment(snapshotId), []);

  if (!snapshot) return null;

  const severity = snapshot.get('maxSeverity') as number;
  const numberOfIssues = snapshot.get('numberOfOpenEvents');
  const tooltipText =
    numberOfIssues === 0
      ? t('in-logging:tooltipEntityHealthNoIssues')
      : t('in-logging:tooltipEntityHealthIssues', { numberOfIssues });

  return (
    <div className={locals.healthContainer}>
      <Tooltip align="bottomLeft" delay={300} content={tooltipText}>
        <HealthIndicatorPresenter
          openIssues={severity}
          maxSeverity={severity}
          iconOnly
          active={false}
          iconOnlySize="s"
        />
      </Tooltip>
    </div>
  );
}
