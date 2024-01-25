/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';

import { Button, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';
import { Link } from '@instana/components';

import {
  LARGE_TRACE_THRESHOLD,
  isLazyLoadedCallTreeSupported,
  shouldUseLazyLoadedCallTree
} from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import {
  analyzeCallsOfTraceClickedTracker,
  downloadTraceClickedTracker,
  traceViewTrackIfLargeTrace
} from 'in-applications/tracker';
import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import getTraceSummary from 'in-applications/subscriptions/getTraceSummary';
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components/tabs';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import { analyzeTagFilterExpression } from './analyzeTagFilter';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { analyzePath } from 'in-applications/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { getColor } from 'in-applications/endpointTypes';
import { pendingResult } from 'in-services/fixedObjects';
import { getChartGranularity } from 'in-stores/metric';
import { chartColors } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours, seconds } from 'in-services/time';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './TraceDetailView.mless';

const maximumNumberOfCallsForLargeTraceConsideration = LARGE_TRACE_THRESHOLD;

export default function TraceDetailView(props) {
  const dataSource = props.dataSource;

  const {
    detailId: { callId, traceId, colorCode, logId },
    getHrefToDetailId,
    backendQueryModel
  } = props;
  const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel, traceId);

  const result$ = useRetriableObservable({ traceId, retries: 3, retryDelay: seconds.toMillis(15) });

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.applications,
          pageRootName: pageNames.analytics
        }}
      />
      <Sticky
        header={
          <DashboardHeader
            {...props}
            title={t('in-applications:labelAnalytic')}
            icon={getIconByType(dataSource, 'application')}
            label={getLabelByType(dataSource)}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            withBorderBottom
            showHistoricDataWarning={false}
            liveModeDisabled
            liveModeDisabledTooltip={t('in-applications:tracesLiveModeDisabled')}
          />
        }
      >
        <SplitScreenList
          {...props}
          ListItemContent={SplitScreenTraceDetailContent}
          getHrefToDetailId={getHrefToDetailId}
          subLabel={isFromSameTrace ? t('in-applications:analyze.filteredInThisTrace') : undefined}
        >
          <TabView
            key={traceId}
            props={props}
            HeaderComponent={Header}
            location={location}
            tabs={tabs}
            result$={result$}
            withoutBreadcrumb
            withoutPadding
            withProps={({ result }) => {
              return {
                data: result.data,
                traceId,
                callId,
                logId,
                setCallId: id => props.setDetailId({ ...props.detailId, callId: id, logId: null }),
                setLogId: id => props.setDetailId({ ...props.detailId, callId: null, logId: id }),
                colorCodeType: colorCode ?? 'byEndpointType',
                setColorCodeMechanism: colorCode => props.setDetailId({ ...props.detailId, colorCode }),
                getColor: args => {
                  const getColorBy = colorCode === 'byServiceAndEndpoint' ? getColorByEndpoint : getColorByEndpointType;
                  return getColorBy({
                    ...args,
                    traceId
                  });
                }
              };
            }}
          />
        </SplitScreenList>
      </Sticky>
    </>
  );
}

function useRetriableObservable({ traceId, retries, retryDelay }) {
  const [result$, setResult$] = useState(create);
  const [retry, setRetry] = useState(0);

  const lastTraceIdRef = useRef(traceId);
  if (traceId !== lastTraceIdRef.current) {
    lastTraceIdRef.current = traceId;
    setResult$(create());
    setRetry(0);
  }

  const timeConfig = useTimeConfig();
  const traceSummary = useObservable(getTraceSummaryRetriable, [traceId, retry]) ?? pendingResult;

  useEffect(() => {
    const traceDataMissing = hasError(traceSummary) || (!isLoading(traceSummary) && traceSummary.data.callCount === 0);
    const shouldRetry = traceDataMissing && isAlmostNow(timeConfig.to) && retry < retries;
    if (shouldRetry) {
      const timeoutId = setTimeout(() => setRetry(prev => prev + 1), retryDelay);
      return () => clearTimeout(timeoutId);
    }
    result$.emit(traceSummary);
  }, [retry, result$, traceSummary, timeConfig.to, retries, retryDelay]);

  return result$;
}

function isAlmostNow(timestamp) {
  return !timestamp || timestamp > Date.now() - seconds.toMillis(60);
}

function getTraceSummaryRetriable([traceId, retry]) {
  return getTraceSummary({
    id: traceId,
    // for retries, we have to modify the payload to bypass caching
    // backend ignores the "filter" field for this query
    ...(retry > 0 && {
      filter: {
        includeInternalCalls: true,
        includeSyntheticCalls: true,
        timeConfig: {
          windowSize: hours.toMillis(retry),
          autoRefresh: false
        },
        useLongTermDataOnly: false
      }
    })
  });
}

function getColorByEndpoint({ service, endpoint, traceId }) {
  return getColorPool(traceId, chartColors.strokeColors100).getColorHex(
    `${service && service.id}__${endpoint && endpoint.id}`
  );
}

function getColorByEndpointType({ endpoint }) {
  return getColor(endpoint ? endpoint.type : 'UNDEFINED');
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-applications:labelTrace')}
      icon="lib_application_trace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function applyTraceIdFilter(formModel, traceId) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];
  return traceIdFilterExpression;
}

function renderButtonLine(props) {
  return <TraceDetailViewButtonLine {...props} />;
}

function TraceDetailViewButtonLine({ traceId, result, formModel }) {
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();

  const traceIdInUrl = result?.data?.id ?? traceId;

  let adjustedTimeConfig = timeConfig;
  if (result?.data) {
    // adjust the selected time range to cover the whole trace
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      result.data.startTime,
      getChartGranularity
    );
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      result.data.startTime + result.data.duration,
      getChartGranularity
    );
  }

  const locationAnalyzeCallsOfThisTrace = useMemo(() => {
    updateLocationToAnalyze(location, {
      dataSource: 'calls',
      formModel: applyTraceIdFilter(formModel, traceIdInUrl),
      facets: null,
      timeConfig: adjustedTimeConfig,
      hiddenCalls: { includeInternal: true, includeSynthetic: true },
      resetUndefinedParams: false
    });
    return location;
  }, [adjustedTimeConfig, formModel, location, traceIdInUrl]);

  if (!role.canViewLogs || !role.canViewTraceDetails) {
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
    analyzeCallsOfTraceClickedTracker({});
  }

  const traceDownloadUrl = isLazyLoadedCallTreeSupported(result?.data)
    ? `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
        traceIdInUrl
      )}?pretty&retrievalSize=200&offset=0&ingestionTime=${Date.now()}`
    : `/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`;

  return (
    <>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={traceDownloadUrl}
        onClick={() => downloadTraceClickedTracker({})}
      >
        {t('in-applications:linkDownload')}
      </Button>
      <Button
        icon="lib_analyze"
        kind="secondary"
        href={createHref({ ...locationAnalyzeCallsOfThisTrace, pathname: analyzePath })}
        onClick={handleOnClickAnalyzeCall}
      >
        {t('in-applications:analyze.analyzeCallsOfThisTrace')}
      </Button>
    </>
  );
}

function renderContext({ getHrefToUngroupedView, tracker }) {
  return (
    <Link
      className={locals.analyticsLink}
      href={getHrefToUngroupedView()}
      onClick={() => tracker.traceViewNavigateBackToUa()}
    >
      {t('in-applications:labelAnalytic')}
    </Link>
  );
}

function renderMetaInformation({ traceId, result }) {
  return <MetaInformation traceId={traceId} result={result} />;
}

function MetaInformation({ traceId, result }) {
  const displayedTraceId = result?.data?.id ?? traceId;
  const lazyLoadedCallTree = shouldUseLazyLoadedCallTree(result?.data);

  useEffect(() => {
    if (lazyLoadedCallTree) {
      traceViewTrackIfLargeTrace({});
    }
  }, [lazyLoadedCallTree]);

  return (
    <div>
      <span className={locals.traceIdLabel}>Trace ID: </span>
      <code className={locals.traceId}>{displayedTraceId}</code>
      {result.data && !result.data.id && (
        <Tooltip content={t('in-applications:analyze.traceIdTooltip')}>
          <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      )}
      {lazyLoadedCallTree && (
        <Tooltip
          content={t('in-applications:traceDetail.tabs.summary.timeLineViewNotAvailable', {
            maximumNumberOfCallsForLargeTraceConsideration: maximumNumberOfCallsForLargeTraceConsideration
          })}
        >
          <Pill className={locals.label}>{t('in-applications:traceDetail.tabs.summary.largeTrace')}</Pill>
        </Tooltip>
      )}
      {lazyLoadedCallTree && (
        <Pill kind="primary" className={locals.betaPill}>
          {t('in-applications:traceDetail.beta')}
        </Pill>
      )}
    </div>
  );
}

function renderTimeSelection({ getHrefToUngroupedView, tracker }) {
  return (
    <Link href={getHrefToUngroupedView()} onClick={() => tracker.traceViewClosedTracker()}>
      <Tooltip content={t('in-applications:analyze.closeTraceDetail')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-applications:analyze.closeTraceDetail')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
