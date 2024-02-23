/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
  isHovered$: Observable<boolean>;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig, isHovered$ }: KpiCardProps) {
  const isHovered = useObservable(isHovered$, [isHovered$]);
  const href = useLinkToLogs({ tagFilterExpression, timeConfig });

  return (
    <Button kind="subtle" icon="lib_analyze" href={href} onClick={() => jumpToLogs({ source: 'analyze logs' })}>
      {isHovered ? t('in-analyze:traceDetail.tabs.summary.analyzeLogs') : ''}
    </Button>
  );
}
