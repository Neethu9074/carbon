/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { LogItem, LogMessageItem, LogTag } from '@instana/types';
import { SpanExcerpt } from '@instana/types/typeDefinitions';
import { Stack } from '@instana/components';

// @ts-expect-error not yet migrated to typescript
import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import {
  isParameterTag,
  mapToSiderbarTagListObject,
  parseStackTrace
} from 'in-components/Logging/TraceDetails/components/LogDetails/utils';
import AnalyzeLogsButton from 'in-components/Logging/TraceDetails/components/LogDetails/components/AnalyzeLogsButton';
import LogStackTrace from 'in-components/Logging/TraceDetails/components/LogDetails/LogStackTrace';
import { getLogLevelColor } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { useLogsInCallsContext } from 'in-components/Logging/TraceDetails/LogsInCallsContext';
import { filterTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { isLogItem } from 'in-logging/analyze/AnalyzeView/utils';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { SPAN_STACK_TRACE } from 'in-logging/queryBuilder';
import { loggingEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import logIndicatorLocals from 'in-applications/analyze/components/TraceDetails/components/LogIndicator.mless';
import locals from 'in-components/Logging/TraceDetails/components/LogDetails/LogDetails.mless';

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
        <ExpandableGroup title="Message" defaultExpanded>
          {t('in-analyze:logDetails.restrictedAccessExpl')}
        </ExpandableGroup>

        <ExpandableGroup title={t('in-analyze:logDetails.titleTags')}>
          {t('in-analyze:logDetails.restrictedAccessExpl')}
        </ExpandableGroup>
      </Stack>
    </aside>
  );
}

function LogDetails(props: LogDetailsSwitchProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { callLog, loggingLog } = props;

  const { selectedLog } = useLogsInCallsContext();

  const useLoggingData = loggingEnabled && loggingLog;

  const logLevel = useLoggingData
    ? getLogLevel(loggingLog.tags)
    : callLog.data.log?.level || (callLog.errorCount > 0 ? 'ERROR' : 'WARN');

  const logLevelColor = getLogLevelColor(logLevel);

  const logMessage = (useLoggingData ? loggingLog?.message : callLog.data.log?.message) ?? '';

  const isExpandedLog = isLogItem(selectedLog)
    ? loggingLog?.itemId === selectedLog.itemId
    : selectedLog?.label.replace('WARN:', '').replace('ERROR:', '') === logMessage;

  useEffect(() => {
    setIsExpanded(isExpandedLog);
  }, [isExpandedLog]);

  const ref = useCallback(
    node => {
      if (node !== null && isExpanded) {
        setTimeout(() => node.scrollIntoView(true, { block: 'start' }), 200);
      }
    },
    [isExpanded]
  );

  const title = (
    <div className={locals.title}>
      <aside>
        <div
          className={logIndicatorLocals.logIndicator}
          style={{
            borderTopColor: logLevelColor
          }}
        />
      </aside>
      <header>
        <span className={locals.titleLevel}>{logLevel}</span>
        {useLoggingData ? <LogMessage tags={loggingLog?.tags} message={logMessage} /> : <span>{logMessage}</span>}
      </header>
    </div>
  );

  const handleToggle = () => setIsExpanded(expanded => !expanded);

  return (
    <aside ref={ref} className={locals.logDetails}>
      <ExpandableGroup onToggle={handleToggle} expanded={isExpanded} title={title}>
        {useLoggingData ? (
          <ExpandedLogWithLogging {...(props as ExpandedLogWithLoggingProps)} />
        ) : (
          <ExpandedLogWithoutLogging {...props} />
        )}
      </ExpandableGroup>
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
      <ExpandableGroup title="Message" defaultExpanded>
        <LogMessage {...loggingLog} />
      </ExpandableGroup>

      <ExpandableGroup title={t('in-analyze:logDetails.titleTags')}>
        <SidebarTagList tags={tags} />
      </ExpandableGroup>

      {parameterTags.length > 0 && (
        <ExpandableGroup title={t('in-analyze:logDetails.titleParameters')}>
          <SidebarTagList tags={parameterTags} />
        </ExpandableGroup>
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
      <ExpandableGroup title="Message" defaultExpanded>
        <LogMessage tags={[]} message={message} />
      </ExpandableGroup>

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
