/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { Card, ColumnizedContent, Li, Ul } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  BrowserMessage,
  dummyTestResultLogs,
  ConsoleLogColumnProps,
  TestResultLog
} from 'in-synthetics/utils/constants';
import { logLevelColumn, logMessageColum, timestampColumn } from 'in-synthetics/utils/browserLogsColumnDefinitions';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import LogMessageColumn from 'in-synthetics/dashboards/details/components/LogMessageColumn';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import { consoleLogLevelColumn } from 'in-synthetics/utils/consoleLogsColumnDefinitions';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { LOGSFormatType } from 'in-synthetics/utils/getValidFormat';

import locals from 'in-synthetics/dashboards/details/components/Logs.mless';

const browserColumnDefinitions = [logLevelColumn, timestampColumn, logMessageColum];
const consoleColumnDefinitions = [
  consoleLogLevelColumn,
  {
    id: 'consoleLogMessage',
    useMaxHeight: true,
    widthInAbsoluteUnit: true,
    getContent: ({ logs }: ConsoleLogColumnProps) => {
      return <LogMessageColumn logs={logs} />;
    }
  }
];

interface LogsProps {
  testId: string;
  resultId: string;
  isBrowserTestType: boolean;
  metadata: string;
  timestamp: number;
}

export default function Logs({ testId, resultId, isBrowserTestType, metadata, timestamp }: LogsProps) {
  const { data, progress }: TestResultLog =
    useObservable<any, [number]>(() => {
      if (metadata.split(',').includes(LOGSFormatType)) {
        return getTestResultDetailData({
          testId: testId,
          testResultId: resultId,
          type: 'LOGS',
          startTime: timestamp
        });
      } else {
        return just({ ...dummyTestResultLogs, progress: { loading: false } });
      }
    }, [0]) || dummyTestResultLogs;

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.logs')}>
      {data != undefined && data != null && !isEmpty(data) ? (
        <>
          <div>
            <ConsoleLogDetails logFiles={data?.logFiles} timestamp={timestamp} />
          </div>
          {isBrowserTestType && data?.logFiles['browser.json'] && (
            <div>
              <BrowserLogDetails logFiles={data?.logFiles} />
            </div>
          )}
        </>
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

interface ConsoleLogDetailsProps {
  logFiles: { [index: string]: any };
  timestamp: number;
}

function ConsoleLogDetails({ logFiles, timestamp }: ConsoleLogDetailsProps) {
  return (
    <ExpandableLightCard
      framed
      title={t('in-synthetics:dashboard.detailsPage.consoleLogs')}
      darkFrame
      useMaxAvailableHeight
      className={locals.expandableCard}
    >
      <Ul space="disabled">
        <Li key={generateUniqueShortId()} className={locals.selectedRow}>
          <ColumnizedContent
            columnDefinitions={consoleColumnDefinitions}
            name={t('in-synthetics:dashboard.detailsPage.consoleLogsLevel')}
            logs={logFiles['console.log']}
            timestamp={timestamp}
          />
        </Li>
      </Ul>
    </ExpandableLightCard>
  );
}

interface BrowserLogDetailsProps {
  logFiles: { [index: string]: any };
}

function BrowserLogDetails({ logFiles }: BrowserLogDetailsProps) {
  const browserLogs: BrowserMessage[] = JSON.parse(logFiles['browser.json']) || [];

  return (
    <ExpandableLightCard
      title={t('in-synthetics:dashboard.detailsPage.browserLogs')}
      darkFrame
      useMaxAvailableHeight
      className={locals.expandableCard}
    >
      <Ul space="disabled">
        {browserLogs.map((item: BrowserMessage) => {
          return (
            <Li className={locals.listItem} href={undefined} size="compact" key={generateUniqueShortId()}>
              <ColumnizedContent columnDefinitions={browserColumnDefinitions} item={item} timestamp={item.timestamp} />
            </Li>
          );
        })}
      </Ul>
    </ExpandableLightCard>
  );
}
