/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback } from 'react';

import { Stack, useTheme } from '@instana/components';
import { LogTag, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  isParameterTag,
  mapToSiderbarTagListObject,
  parseStackTrace
} from 'in-components/Logging/TraceDetails/components/LogDetails/utils';
// @ts-ignore
import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
// @ts-ignore
import LoadingCallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/LoadingCallDetails';
// @ts-ignore
import AnalyzeLogsButton from 'in-components/Logging/TraceDetails/components/LogDetails/components/AnalyzeLogsButton';
import { getSpanIdTagFilter, LOG_MESSAGE, logTableTags, SPAN_STACK_TRACE } from 'in-logging/queryBuilder';
import LogStackTrace from 'in-components/Logging/TraceDetails/components/LogDetails/LogStackTrace';
import { filterTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { hasError, isLoading } from 'in-services/util/result';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import logIndicatorLocals from 'in-applications/analyze/components/TraceDetails/components/LogIndicator.mless';
import locals from 'in-components/Logging/TraceDetails/components/LogDetails/LogDetails.mless';

interface LogDetailsSwitchProps {
  callId: string;
  onClose: () => void;
  timeConfigForLogs: TimeConfig;
  totalNumberOfLogs: number;
  selectedLogIdPair: { spanId: string; logId: string };
  expandedLogId?: string;
}

export default function LogDetailsSwitch(props: LogDetailsSwitchProps) {
  return role?.canViewLogs ? <LogDetails {...props} /> : <LogDetailsWithNoAccess />;
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
  const { selectedLogIdPair, onClose, expandedLogId } = props;

  const ref = useCallback(node => {
    if (node !== null && selectedLogIdPair.logId === expandedLogId) {
      node.scrollIntoView({ block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useTheme();

  const logResult =
    useObservable(
      () =>
        getLog({
          itemId: selectedLogIdPair.logId,
          tagFilterExpression: getSpanIdTagFilter(selectedLogIdPair.spanId),
          requestedTags: [...logTableTags, SPAN_STACK_TRACE, LOG_MESSAGE]
        }),
      [selectedLogIdPair.logId, selectedLogIdPair.spanId]
    ) ?? pendingResult;

  if (isLoading(logResult)) {
    return (
      <div className={locals.logDetails}>
        <LoadingCallDetails onClose={onClose} progress={0} />
      </div>
    );
  }
  if (hasError(logResult)) {
    return (
      <div className={locals.logDetails}>
        <ErroneousResultPresenter errors={logResult.errors} />
      </div>
    );
  }

  const log = logResult.data;

  const logLevel = getLogLevel(log.tags);
  const logLevelColor = logLevel === 'ERROR' ? theme.ids.color.option.red['500'] : theme.ids.color.option.yellow['500'];

  const tags = log.tags
    .filter(filterTag)
    .filter((tag: LogTag) => !isParameterTag(tag))
    .map(mapToSiderbarTagListObject);

  const stackTraceTagValue = tags.find((tag: LogTag) => tag.name === SPAN_STACK_TRACE)?.value;

  const stackTrace = stackTraceTagValue ? parseStackTrace(stackTraceTagValue) : null;

  // translate tag param key to not leak the technical rake
  const parameterTags = log.tags.filter(isParameterTag).map(mapToSiderbarTagListObject);

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
        <LogMessage {...log} />
      </header>
    </div>
  );

  return (
    <aside ref={ref} className={locals.logDetails}>
      <ExpandableGroup defaultExpanded={expandedLogId === log.itemId} title={title}>
        <Stack direction="vertical" gap="normal">
          <ExpandableGroup title="Message" defaultExpanded>
            <LogMessage {...log} />
          </ExpandableGroup>

          <ExpandableGroup title={t('in-analyze:logDetails.titleTags')}>
            <SidebarTagList tags={tags} />
          </ExpandableGroup>

          {parameterTags.length > 0 && (
            <ExpandableGroup title={t('in-analyze:logDetails.titleParameters')}>
              <SidebarTagList tags={parameterTags} />
            </ExpandableGroup>
          )}

          <LogStackTrace log={log} stackTrace={stackTrace} />

          <AnalyzeLogsButton log={log} />
        </Stack>
      </ExpandableGroup>
    </aside>
  );
}
