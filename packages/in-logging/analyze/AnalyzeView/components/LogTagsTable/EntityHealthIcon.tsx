/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

//@ts-expect-error needs TS migration
import { getColorBySeverity, getHealthInfoAtFocusedMoment } from 'in-stores/events';
// eslint-disable-next-line no-restricted-imports
import { getIconBySeverity } from './utils';
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
  const color = getColorBySeverity(severity, { defaultColor: themes.default.ids.color.option.green['500'] });
  const icon = getIconBySeverity(severity);

  return (
    <div className={locals.healthContainer}>
      <Tooltip align="auto" delay={300} content={tooltipText}>
        <SvgIcon type={icon} size="s" color={color} />
      </Tooltip>
    </div>
  );
}
