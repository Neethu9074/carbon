/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, IconButton } from '@instana/components';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { ANALYZE_LOGGING_JUMP_TO_LOGS } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { TagFilterExpression, TimeConfig } from 'in-types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
  isHovered$: Observable<boolean>;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig, isHovered$ }: KpiCardProps) {
  const isHovered = useObservable(isHovered$, [isHovered$]);
  const logsHref = useLinkToLogs({
    tagFilterExpression: tagFilterExpression,
    timeConfig: timeConfig
  });
  const { trackCta } = useSegmentTracking();

  if (carbonButtonEnabled) {
    return (
      <Tooltip content={t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}>
        <IconButton
          type="lib_analyze"
          href={logsHref}
          kind="subtle"
          onClick={() => trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'analyze logs' })}
        />
      </Tooltip>
    );
  }
  return (
    <Button
      kind="subtle"
      icon="lib_analyze"
      href={logsHref}
      onClick={() => trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'analyze logs' })}
    >
      {isHovered ? t('in-analyze:traceDetail.tabs.summary.analyzeLogs') : ''}
    </Button>
  );
}
