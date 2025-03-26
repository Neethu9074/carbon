/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';

import { CarbonButton as Button, CarbonStack as Stack, Tooltip } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { DownloadOptionsDropdown } from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/DownloadOptionsDropdown';
// @ts-expect-error needs ts migration
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { traceDownloadUrl } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import { RenderIcon } from 'in-applications/analyze/components/SaveFilters/RenderIcon';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { analyzePath } from 'in-applications/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import { connection } from 'in-connection/connection';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { seconds } from 'in-services/time/time';
import { TraceSummary } from 'in-types';
import { role } from 'in-stores/user';

// No need for a subscription, as this is not getting a response
const retainTrace = (traceId: string) => connection.send('traceViewed', { traceId });

interface TraceDetailViewButtonLineProps {
  traceId: string;
  traceSummary?: TraceSummary;
}

export function TraceDetailViewButtonLine({ traceId, traceSummary }: TraceDetailViewButtonLineProps) {
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();
  const { trackAnalyzeCallsOfTraceClicked, trackDownloadTraceClicked } = useApplicationTracker();
  const [traceSaved, setTraceSaved] = useState(
    traceSummary?.traceRetentionState === 'PERSISTING' || traceSummary?.traceRetentionState === 'PERSISTED'
  );

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

  const traceIdInUrl = traceSummary?.id ?? traceId;

  const retainTraceAndDisableStoring = (traceId: string) => {
    retainTrace(traceId);
    setTraceSaved(true);
  };

  // if a non-large trace is viewed for at least 15s store it long term
  useEffect(() => {
    let traceViewedTimeoutId: NodeJS.Timeout;
    if (traceSummary?.traceRetentionState === 'EPHEMERAL') {
      traceViewedTimeoutId = setTimeout(() => retainTraceAndDisableStoring(traceId), seconds.toMillis(15));
    }
    return () => {
      clearTimeout(traceViewedTimeoutId);
    };
  }, [traceId, traceSummary?.traceRetentionState]);

  let adjustedTimeConfig = timeConfig;
  if (traceSummary) {
    // adjust the selected time range to cover the whole trace
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      traceSummary.startTime,
      getChartGranularity
    );
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      traceSummary.startTime + traceSummary.duration,
      getChartGranularity
    );
  }

  const locationAnalyzeCallsOfThisTrace = useMemo(() => {
    updateLocationToAnalyze(location, {
      dataSource: 'calls',
      formModel: applyTraceIdFilter(traceIdInUrl),
      facets: null,
      timeConfig: adjustedTimeConfig,
      hiddenCalls: { includeInternal: true, includeSynthetic: true },
      resetUndefinedParams: false
    });
    return location;
  }, [adjustedTimeConfig, location, traceIdInUrl]);

  if (!role?.canViewLogs || !role?.canViewTraceDetails) {
    return null;
  }

  function handleOnClickAnalyzeCall() {
    if (adjustedTimeConfig !== timeConfig) {
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: t('in-applications:traceDetail.tabs.summary.adjustedTimeConfigForTrace')
        },
        'adjustedTimeConfig'
      );
    }
    trackAnalyzeCallsOfTraceClicked();
  }

  return (
    <Stack gap={2} orientation="horizontal">
      {isTroubleshootingModeEnabled || isInternalVisible ? (
        <DownloadOptionsDropdown traceId={traceIdInUrl} traceSummary={traceSummary} />
      ) : (
        <Button
          icon="lib_actions_download"
          kind="primary"
          size="sm"
          target="_blank"
          href={traceDownloadUrl(traceIdInUrl, traceSummary)}
          onClick={() => trackDownloadTraceClicked({ rawTrace: false })}
        >
          {t('in-applications:linkDownload')}
        </Button>
      )}
      <Button
        kind="secondary"
        size="sm"
        href={createHref({ ...locationAnalyzeCallsOfThisTrace, pathname: analyzePath })}
        onClick={handleOnClickAnalyzeCall}
        renderIcon={() => <RenderIcon size="xs" type="lib_analyze" />}
      >
        {t('in-applications:analyze.analyzeCallsOfThisTrace')}
      </Button>
      {traceSummary?.traceRetentionState !== 'LARGE_TRACE' && (
        <Tooltip
          content={
            traceSaved
              ? t('in-applications:analyze.storeTrace.traceSavedTooltip')
              : t('in-applications:analyze.storeTrace.traceNotSavedTooltip')
          }
          align="rightMiddle"
        >
          <Button
            disabled={traceSaved}
            kind="tertiary"
            size="sm"
            onClick={() => retainTraceAndDisableStoring(traceIdInUrl)}
            renderIcon={() => <RenderIcon size="xs" type="lib_save" />}
          >
            {t('in-applications:analyze.storeTrace.label')}
          </Button>
        </Tooltip>
      )}
    </Stack>
  );
}

function applyTraceIdFilter(traceId: string) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];
  return traceIdFilterExpression;
}
