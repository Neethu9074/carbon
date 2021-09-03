/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/components';

import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface KpiCardProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}

export default function AnalyzeLogsButton({ tagFilterExpression, timeConfig }: KpiCardProps) {
  return (
    <Button
      kind="secondary"
      icon="lib_analyze"
      href$={getLinkToAnalyze({
        tagFilterExpression: [tagFilterExpression],
        timeConfig: timeConfig
      })}
      onClick={() => jumpToLogs({ source: 'analyze logs' })}
    >
      {t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}
    </Button>
  );
}
