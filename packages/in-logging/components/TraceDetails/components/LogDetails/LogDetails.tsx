/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { SpanExcerpt, TraceActivityTreeNode } from '@instana/types/typeDefinitions';
import { LogItem, LogMessageItem, LogTag } from '@instana/types';
import { Stack, Typography } from '@instana/components';
import { ExpandableGroup } from '@instana/components';

// @ts-expect-error not yet migrated to typescript
import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import {
  isParameterTag,
  mapToSiderbarTagListObject,
  parseStackTrace
} from 'in-logging/components/TraceDetails/components/LogDetails/utils';
import AnalyzeLogsButton from 'in-logging/components/TraceDetails/components/LogDetails/components/AnalyzeLogsButton';
import LogStackTrace from 'in-logging/components/TraceDetails/components/LogDetails/LogStackTrace';
import { getLogLevelColor } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import { filterTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { isLogItem } from 'in-logging/analyze/AnalyzeView/utils';
import { SPAN_STACK_TRACE } from 'in-logging/queryBuilder';
import { loggingEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import logIndicatorLocals from 'in-applications/analyze/components/TraceDetails/components/LogIndicator.mless';
import locals from 'in-logging/components/TraceDetails/components/LogDetails/LogDetails.mless';

export interface LogSpanExcerpt extends Omit<SpanExcerpt, 'data'> {
  data: {
    // Properties on LogMessageItem aren't actually required and can be undefined
    log: Partial<LogMessageItem>;
  };
}
interface LogDetailsSwitchProps {
  callLog: LogSpanExcerpt;
  processSnapshotId?: string;
  callId: string;
  loggingLog?: LogItem;
  justTitle?: boolean;
}

export default function LogDetailsSwitch(props: LogDetailsSwitchProps) {
  return role?.canViewLogs ? (
    <ErrorBoundary name="calls-sidebar-log">
      <LogDetails {...props} />
    </ErrorBoundary>
  ) : (
    <LogDetailsWithNoAccess />
  );
}

function LogDetailsWithNoAccess() {
  return (
    <aside className={locals.logDetails}>
      <Stack direction="vertical" gap="normal">
        <Typography variant="heading-02">{t('in-analyze:logDetails.message')}</Typography>
        {t('in-analyze:logDetails.restrictedAccessExpl')}
        <Typography variant="heading-02">{t('in-analyze:logDetails.titleTags')}</Typography>
        {t('in-analyze:logDetails.restrictedAccessExpl')}
      </Stack>
    </aside>
  );
}

function LogDetails(props: LogDetailsSwitchProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { callLog, loggingLog, justTitle } = props;

  const { selectedLog, items } = useLogsInCallsContext();

  const useLoggingData = Boolean(loggingEnabled && loggingLog);

  const logLevel = getLogLevelFromLog(callLog, loggingLog, useLoggingData);
  const logMessage = getLogMessage(callLog, loggingLog, useLoggingData);
  const logLevelColor = getLogLevelColor(logLevel);
  const tags = (useLoggingData ? loggingLog?.tags : items[0]?.tags) ?? [];

  const isExpandedLog = isLogSelected(selectedLog, loggingLog, logMessage);

  useEffect(() => {
    if (isExpandedLog !== isExpanded) {
      setIsExpanded(isExpandedLog);
    }
  }, [isExpanded, isExpandedLog]);

  const scrollToRef = useCallback(
    node => {
      if (node && isExpanded) {
        node.scrollIntoView({ block: 'start' });
      }
    },
    [isExpanded]
  );

  const handleToggle = () => setIsExpanded(expanded => !expanded);
  const title = (
    <div className={classNames(locals.title, justTitle && locals.justTitle)}>
      <aside>
        <div className={logIndicatorLocals.logIndicator} style={{ borderTopColor: logLevelColor }} />
      </aside>
      <header>
        <span className={locals.titleLevel}>{logLevel}</span>
        <LogMessage tags={tags} message={logMessage} />
      </header>
    </div>
  );

  return (
    <aside ref={scrollToRef} className={classNames(locals.logDetails, justTitle && locals.minusMargin)}>
      {justTitle ? (
        title
      ) : (
        <ExpandableGroup expanded={isExpanded} onToggle={handleToggle} title={title}>
          {useLoggingData ? (
            <ExpandedLogWithLogging {...(props as ExpandedLogWithLoggingProps)} />
          ) : (
            <ExpandedLogWithoutLogging {...props} />
          )}
        </ExpandableGroup>
      )}
    </aside>
  );
}

interface ExpandedLogWithLoggingProps extends LogDetailsSwitchProps {
  loggingLog: LogItem;
}

const ExpandedLogWithLogging = (props: ExpandedLogWithLoggingProps) => {
  const { loggingLog, processSnapshotId } = props;

  const tags = loggingLog.tags
    .filter(filterTag)
    .filter((tag: LogTag) => !isParameterTag(tag))
    .map(mapToSiderbarTagListObject);

  const stackTraceTagValue = tags.find((tag: LogTag) => tag.name === SPAN_STACK_TRACE)?.value;
  const stackTrace =
    stackTraceTagValue && typeof stackTraceTagValue === 'string' ? parseStackTrace(stackTraceTagValue) : undefined;

  // translate tag param key to not leak the technical rake
  const parameterTags = tags.filter(isParameterTag).map(mapToSiderbarTagListObject);

  return (
    <Stack direction="vertical" gap="normal">
      <Typography variant="heading-02">{t('in-analyze:logDetails.message')}</Typography>
      <LogMessage {...loggingLog} />
      <Typography variant="heading-02">{t('in-analyze:logDetails.titleTags')}</Typography>
      <SidebarTagList tags={tags} noMargin />
      {parameterTags.length > 0 && (
        <>
          <Typography variant="heading-02">{t('in-analyze:logDetails.titleParameters')}</Typography>
          <SidebarTagList tags={parameterTags} noMargin />
        </>
      )}

      {stackTrace && stackTrace.length > 0 && (
        <LogStackTrace stackTrace={stackTrace} processSnapshotId={processSnapshotId} />
      )}
      <AnalyzeLogsButton log={loggingLog} />
    </Stack>
  );
};

const ExpandedLogWithoutLogging = (props: LogDetailsSwitchProps) => {
  const { callLog, processSnapshotId } = props;

  const message = callLog.data?.log?.message ?? '';
  const stackTrace = callLog.stackTrace;
  const hasStackTrace = stackTrace.length > 0;

  const content = (
    <>
      <Typography variant="heading-02">{t('in-analyze:logDetails.message')}</Typography>
      <LogMessage tags={[]} message={message} />
      {hasStackTrace && <LogStackTrace stackTrace={stackTrace} processSnapshotId={processSnapshotId} />}
    </>
  );

  const error = (
    <ErroneousResultPresenter
      errors={[{ message: t('in-components:error.erroneousResultPresenterMessage'), code: 'NOT_FOUND' }]}
    />
  );

  return (
    <Stack direction="vertical" gap="normal">
      {callLog.data?.log ? content : error}
    </Stack>
  );
};

function getLogLevelFromLog(
  callLog: LogSpanExcerpt | undefined,
  loggingLog: LogItem | undefined,
  useLoggingData: boolean
) {
  if (useLoggingData) {
    return getLogLevel(loggingLog?.tags ?? []);
  }
  return callLog?.data?.log?.level || (callLog?.errorCount && callLog?.errorCount > 0 ? 'ERROR' : 'WARN');
}

function getLogMessage(callLog: LogSpanExcerpt | undefined, loggingLog: LogItem | undefined, useLoggingData: boolean) {
  return (useLoggingData ? loggingLog?.message : callLog?.data?.log?.message) ?? '';
}

function isLogSelected(
  selectedLog: LogItem | TraceActivityTreeNode | null,
  loggingLog: LogItem | undefined,
  logMessage: string
) {
  if (!selectedLog) return false;
  return isLogItem(selectedLog)
    ? loggingLog?.itemId === selectedLog.itemId
    : selectedLog.label.replace('WARN:', '').replace('ERROR:', '') === logMessage;
}
