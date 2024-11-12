/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import { DownloadOptionsDropdown } from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/DownloadOptionsDropdown';
// @ts-expect-error needs ts migration
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { traceDownloadUrl } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { getChartGranularity } from 'in-stores/metric/metric';
import { analyzePath } from 'in-websites/navigation/paths';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TraceSummary } from 'in-types';
import { role } from 'in-stores/user';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailView.mless';

interface TraceDetailViewButtonLineProps {
  traceId: string;
  traceSummary?: TraceSummary;
}

export function TraceDetailViewButtonLine({ traceId, traceSummary }: TraceDetailViewButtonLineProps) {
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();
  const { trackAnalyzeCallsOfTraceClicked, trackDownloadTraceClicked } = useApplicationTracker();

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

  const traceIdInUrl = traceSummary?.id ?? traceId;

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
    <>
      {isTroubleshootingModeEnabled || isInternalVisible ? (
        <DownloadOptionsDropdown traceId={traceIdInUrl} traceSummary={traceSummary} />
      ) : (
        <Button
          icon="lib_actions_download"
          kind="primary"
          target="_blank"
          href={traceDownloadUrl(traceIdInUrl, traceSummary)}
          size={carbonButtonEnabled ? 'compact' : 'normal'}
          onClick={() => trackDownloadTraceClicked({ rawTrace: false })}
        >
          {t('in-applications:linkDownload')}
        </Button>
      )}
      <Button
        icon="lib_analyze"
        kind="secondary"
        href={createHref({ ...locationAnalyzeCallsOfThisTrace, pathname: analyzePath })}
        onClick={handleOnClickAnalyzeCall}
        size={carbonButtonEnabled ? 'compact' : 'normal'}
        className={carbonButtonEnabled ? locals.carbonAnalyzeButton : undefined}
      >
        {t('in-applications:analyze.analyzeCallsOfThisTrace')}
      </Button>
    </>
  );
}

function applyTraceIdFilter(traceId: string) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];
  return traceIdFilterExpression;
}
