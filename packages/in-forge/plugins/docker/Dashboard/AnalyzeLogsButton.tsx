/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { IconButton } from '@instana/components';

import { ANALYZE_LOGGING_JUMP_TO_LOGS } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { TagFilterExpression, TimeConfig } from 'in-types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig }: KpiCardProps) {
  const href = useLinkToLogs({ tagFilterExpression, timeConfig });
  const { trackCta } = useSegmentTracking();
  return (
    <Tooltip content={t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}>
      <IconButton
        kind="subtle"
        type="lib_analyze"
        href={href}
        onClick={() => trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'analyze logs' })}
      />
    </Tooltip>
  );
}
