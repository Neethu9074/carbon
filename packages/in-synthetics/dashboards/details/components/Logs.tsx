/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card, ColumnizedContent, Li, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import LogMessageColumn from 'in-synthetics/dashboards/details/components/LogMessageColumn';
import { logLevelColumn, timestampColumn } from 'in-synthetics/utils/logsColumnUtils';
import { dummyTestResultLogs, TestResultLog } from 'in-synthetics/utils/constants';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import getTestResultLogs from 'in-synthetics/subscriptions/getTestResultLogs';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';

import locals from './Logs.mless';

interface LogsProps {
  testId: string;
  resultId: string;
  timestamp: number;
}

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs({ testId, resultId, timestamp }: LogsProps) {
  const { data, progress, errors }: TestResultLog =
    useObservable<any, [number]>(
      () =>
        getTestResultLogs({
          testId: testId,
          testResultId: resultId
        }),
      [0]
    ) || dummyTestResultLogs;

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.logs')}>
      <LogDetails logs={data?.logs} timestamp={timestamp} />
    </Card>
  );
}

interface LogDetailsProps {
  logs?: string;
  timestamp: number;
}

function LogDetails({ logs, timestamp }: LogDetailsProps) {
  return (
    <Ul space="disabled">
      <Li key={timestamp} className={locals.selectedRow}>
        <ColumnizedContent columnDefinitions={columnDefinitions} logs={logs} timestamp={timestamp} />
      </Li>
    </Ul>
  );
}
