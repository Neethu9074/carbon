/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { TimeConfig, TagFilterExpression } from 'in-types';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
  isHovered$: Observable<boolean>;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig, isHovered$ }: KpiCardProps) {
  const isHovered = useObservable(isHovered$, [isHovered$]);

  return (
    <Button
      kind="subtle"
      icon="lib_analyze"
      href$={getLinkToAnalyze({
        tagFilterExpression: tagFilterExpression,
        timeConfig: timeConfig
      })}
      onClick={() => jumpToLogs({ source: 'analyze logs' })}
    >
      {isHovered ? t('in-analyze:traceDetail.tabs.summary.analyzeLogs') : ''}
    </Button>
  );
}
