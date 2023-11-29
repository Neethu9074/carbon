/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LogItem, LogLevel } from '@instana/types';

import LogDetails from 'in-components/Logging/TraceDetails/components/LogDetails/LogDetails';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import ExpandableGroup from 'in-components/ExpandableGroup';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { t } from 'in-i18n';

type LogIdPair = { spanId: string; logId: string };
interface LogsCardProps {
  selectedLogIds: LogIdPair[];
  items: LogItem[];
  expandedLogId: string;
}

const LogsCard = (props: LogsCardProps) => {
  const { selectedLogIds, items, expandedLogId } = props;
  if (selectedLogIds.length === 0) return null;

  const cardTitle = `${t('in-analyze:traceDetail.tabs.summary.logs')} (${getCardTitle(selectedLogIds, items)})`;

  return (
    <ErrorBoundary name="log tree sidebar">
      <ExpandableGroup key={expandedLogId} defaultExpanded={!!expandedLogId} title={cardTitle}>
        {selectedLogIds.map(logIdPair => (
          <LogDetails {...props} key={logIdPair.logId || logIdPair.spanId} selectedLogIdPair={logIdPair} />
        ))}
      </ExpandableGroup>
    </ErrorBoundary>
  );
};

const getCardTitle = (selectedLogIds: LogIdPair[], items: LogItem[]) => {
  const selectedLogItemIds = selectedLogIds.map(({ logId }) => logId);
  const selectedLogs = items.filter(item => selectedLogItemIds.includes(item.itemId));
  const logLevelCounts: Record<Lowercase<LogLevel>, number> = { error: 0, warn: 0 };
  selectedLogs.forEach(log => logLevelCounts[getLogLevel(log.tags)?.toLowerCase() as Lowercase<LogLevel>]++);

  const { getWarnString, getErrorString } = {
    getWarnString: (count: number) => t('in-logging:warn', { count }),
    getErrorString: (count: number) => t('in-logging:error', { count })
  };

  return Object.entries(logLevelCounts)
    .flatMap(([level, count]) => (count > 0 ? [level === 'error' ? getErrorString(count) : getWarnString(count)] : []))
    .join(', ');
};

export default LogsCard;
