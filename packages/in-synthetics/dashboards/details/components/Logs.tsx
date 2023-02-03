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
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import { logLevelColumn, timestampColumn } from 'in-synthetics/utils/logsColumnUtils';
import { dummyTestResultLogs, TestResultLog } from 'in-synthetics/utils/constants';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';

import locals from './Logs.mless';

interface LogsProps {
  testId: string;
  resultId: string;
  timestamp: number;
  isBrowserTestType: boolean;
}

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs({ testId, resultId, timestamp, isBrowserTestType }: LogsProps) {
  const { data, progress }: TestResultLog =
    useObservable<any, [number]>(
      () =>
        getTestResultDetailData({
          testId: testId,
          testResultId: resultId,
          type: 'LOGS'
        }),
      [0]
    ) || dummyTestResultLogs;

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.logs')}>
      {data != undefined && data != null ? (
        <LogDetails logFiles={data?.logFiles} timestamp={timestamp} isBrowserTestType={isBrowserTestType} />
      ) : (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.message', { component: 'Logs' })}
        />
      )}
    </Card>
  );
}

interface LogDetailsProps {
  logFiles: { [index: string]: any };
  timestamp: number;
  isBrowserTestType: boolean;
}

function LogDetails({ logFiles, timestamp, isBrowserTestType }: LogDetailsProps) {
  return (
    <Ul space="disabled">
      <Li key={timestamp} className={locals.selectedRow}>
        <ColumnizedContent
          columnDefinitions={columnDefinitions}
          name={t('in-synthetics:dashboard.detailsPage.consoleLogs')}
          logs={logFiles['console.log']}
          timestamp={timestamp}
        />
      </Li>
      {isBrowserTestType && (
        <Li key={timestamp} className={locals.selectedRow}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            name={t('in-synthetics:dashboard.detailsPage.browserLogs')}
            logs={logFiles['browser.json']}
            timestamp={timestamp}
          />
        </Li>
      )}
    </Ul>
  );
}
