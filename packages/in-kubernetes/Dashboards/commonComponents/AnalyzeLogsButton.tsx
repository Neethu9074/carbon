/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression, TimeConfig } from '@instana/types';
import { IconButton } from '@instana/components';

import { ANALYZE_LOGGING_JUMP_TO_LOGS } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig }: KpiCardProps) {
  const logsHref = useLinkToLogs({
    tagFilterExpression: tagFilterExpression,
    timeConfig: timeConfig
  });
  const { trackCta } = useSegmentTracking();

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
