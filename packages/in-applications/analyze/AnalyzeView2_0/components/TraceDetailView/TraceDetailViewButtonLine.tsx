/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';

import { CarbonButton as Button, CarbonStack as Stack, Tooltip } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TraceSummary } from '@instana/types';
import { Dropdown } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import { DownloadOptionsDropdown } from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/DownloadOptionsDropdown';
// @ts-expect-error needs ts migration
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { CONJUNCTION, FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { OPERATOR_AND } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { traceDownloadUrl } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { analyzeSubtracesEnabled } from 'in-services/featureFlags';
import { RenderIcon } from 'in-components/SaveFilters/RenderIcon';
import { analyzePath } from 'in-applications/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { connection } from 'in-connection/connection';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { DetailId } from 'in-applications/types';
import { seconds } from 'in-services/time/time';
import { Nullish } from 'in-types';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailViewButtonLine.mless';

// No need for a subscription, as this is not getting a response
const retainTrace = (traceId: string) => connection.send('traceViewed', { traceId });

interface TraceDetailViewButtonLineProps {
  detailId: DetailId;
  traceSummary?: TraceSummary;
  setDetailId: (detailId: DetailId) => void;
}
interface SubtraceConfig {
  id?: string;
  label?: string;
}
export function TraceDetailViewButtonLine({ detailId, setDetailId, traceSummary }: TraceDetailViewButtonLineProps) {
  const [role] = useCurrentUserRole();
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();
  const { trackAnalyzeCallsOfTraceClicked, trackDownloadTraceClicked } = useApplicationTracker();
  const [traceSaved, setTraceSaved] = useState(
    traceSummary?.traceRetentionState === 'PERSISTING' || traceSummary?.traceRetentionState === 'PERSISTED'
  );
  const { traceId, subtraceConfigId } = detailId;

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

  const traceIdInUrl = traceSummary?.id ?? traceId;

  // TODO: need to change after backend updates type
  const subtraceConfigsInTrace: SubtraceConfig[] =
    traceSummary?.subtracesInTrace?.map(subtraceConfig => ({
      label: subtraceConfig.subtraceName,
      id: subtraceConfig.subtraceId
    })) ?? [];
  const selectedSubtraceConfig = subtraceConfigsInTrace?.find(subtraceConfig => subtraceConfig.id === subtraceConfigId);

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
      formModel: applyFilter(traceIdInUrl, subtraceConfigId),
      facets: null,
      timeConfig: adjustedTimeConfig,
      hiddenCalls: { includeInternal: true, includeSynthetic: true },
      resetUndefinedParams: false
    });
    return location;
  }, [adjustedTimeConfig, location, subtraceConfigId, traceIdInUrl]);

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
      {analyzeSubtracesEnabled && selectedSubtraceConfig && (
        <Dropdown
          aria-label={'Subtrace configurations'}
          className={locals.subtraceDropdown}
          onChange={e => setDetailId({ ...detailId, subtraceConfigId: e.selectedItem?.id })}
          items={subtraceConfigsInTrace}
          label=""
          id="subtraceConfig"
          titleText={''}
          selectedItem={selectedSubtraceConfig}
        />
      )}
    </Stack>
  );
}

function applyFilter(traceIdInUrl: string, subtraceConfigIdInUrl: string | Nullish) {
  const filterExpression: FormModelElement[] = [tagFilter('trace.id', EQUALS, traceIdInUrl)];
  if (analyzeSubtracesEnabled && subtraceConfigIdInUrl) {
    filterExpression.push(
      {
        type: CONJUNCTION,
        logicalOperator: OPERATOR_AND
      },
      // In the context of calls, currently we use subtrace.id but it actually represents the subtrace.config.id
      // This is because we define the tag once in the context of calls and once in the context of subtraces,
      // but we can't have multiple tag definitions with the same name.
      // TODO: replace with subtrace name when available
      tagFilter('subtrace.id', EQUALS, subtraceConfigIdInUrl)
    );
  }
  return filterExpression;
}
