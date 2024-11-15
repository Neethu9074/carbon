/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import { Message, SvgIcon, Link, Pill, DashboardButtonProps } from '@instana/components';
import { create, Observable, Subject } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// @ts-expect-error SplitScreenTraceDetailContent needs ts migration
import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
// @ts-expect-error SplitScreenList needs ts migration
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { TraceDetailViewButtonLine } from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailViewButtonLine';
import {
  LARGE_TRACE_THRESHOLD,
  shouldUseLazyLoadedCallTree
} from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
// @ts-expect-error ColorGenerator needs ts migration
import { getColorPool } from 'in-services/util/ColorGenerator';
import { analyzeTagFilterExpression } from 'in-applications/analyze/AnalyzeView2_0/components/analyzeTagFilter';
import { Endpoint, Nullish, Result, Service, TagFilterExpressionElementUnion, TraceSummary } from 'in-types';
import DashboardHeaderContext from 'in-components/DashboardHeader/DashboardHeaderContext';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import getTraceSummary from 'in-applications/subscriptions/getTraceSummary';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components/tabs';
import { useLinkToUngroupedView } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { getColor } from 'in-applications/endpointTypes';
import { chartColors } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours, seconds } from 'in-services/time';
import { DetailId } from 'in-applications/types';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailView.mless';

const maximumNumberOfCallsForLargeTraceConsideration = LARGE_TRACE_THRESHOLD;
const MAX_RETRIES = 3;
const RETRY_DELAY = seconds.toMillis(15);

interface TraceDetailViewProps {
  result: Result<TraceSummary>;
  dataSource: 'calls' | 'traces';
  detailId: DetailId;
  backendQueryModel: TagFilterExpressionElementUnion;
  getHrefToDetailId: (detailId: DetailId, groupValue?: string) => string;
  setDetailId: (detailId: DetailId) => void;
}

export default function TraceDetailView(props: TraceDetailViewProps) {
  const dataSource = props.dataSource;
  const { location } = useNavigation();
  const { trackCollapseOrExpandTraceDetailSidebar } = useApplicationTracker();

  const {
    detailId: { callId, traceId, colorCode, logId },
    getHrefToDetailId,
    backendQueryModel
  } = props;
  const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel, traceId);

  const { result$, retry } = useRetriableObservable({ traceId, retries: MAX_RETRIES, retryDelay: RETRY_DELAY });

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
            contextConfigurations={[{ renderContext: RenderContext, contextIcon: 'lib_analyze_inverted' }]}
            liveModeDisabledTooltip={t('in-applications:tracesLiveModeDisabled')}
            withBorderBottom
            liveModeDisabled
          />
        }
      >
        <SplitScreenList
          {...props}
          ListItemContent={SplitScreenTraceDetailContent}
          getHrefToDetailId={getHrefToDetailId}
          subLabel={isFromSameTrace ? t('in-applications:analyze.filteredInThisTrace') : undefined}
          // putting the tracker into props which is less explicit but this way we keep AP specific code out of in-components area
          tracker={{ trackCollapseOrExpandTraceDetailSidebar }}
        >
          <TabView
            key={traceId}
            props={props}
            HeaderComponent={Header}
            location={location}
            tabs={tabs}
            result$={result$}
            renderLoading={() => <LoadingDashboard traceId={traceId} retry={retry} />}
            renderErrors={() => <RetryErrorMessage traceId={traceId} />}
            withProps={({ result }) => {
              return {
                data: result.data,
                traceId,
                callId,
                logId,
                setCallId: (id: string) => props.setDetailId({ ...props.detailId, callId: id, logId: null }),
                setLogId: (id: string) => props.setDetailId({ ...props.detailId, callId: null, logId: id }),
                colorCodeType: colorCode ?? 'byEndpointType',
                setColorCodeMechanism: (colorCode: string) => props.setDetailId({ ...props.detailId, colorCode }),
                getColor: (args: { service: Service; endpoint: Endpoint; traceId: string }) => {
                  const getColorBy = colorCode === 'byServiceAndEndpoint' ? getColorByEndpoint : getColorByEndpointType;
                  return getColorBy({
                    ...args,
                    traceId
                  });
                }
              };
            }}
            withoutBreadcrumb
          />
        </SplitScreenList>
      </Sticky>
    </>
  );
}

// TODO: this type and the hook should be moved to in-applications/hooks.
// Also, the hook should be more reusable.
type RetriableResult = {
  result$: Subject<Result<TraceSummary>>;
  retry: number;
};

function useRetriableObservable({
  traceId,
  retries,
  retryDelay
}: {
  traceId: string;
  retries: number;
  retryDelay: number;
}): RetriableResult {
  const [result$, setResult$] = useState(create<Result<TraceSummary>>);
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
      clearTimeout(timeoutId);
    }
    result$.emit(traceSummary);
  }, [retry, result$, traceSummary, timeConfig.to, retries, retryDelay]);

  return { result$, retry };
}

function isAlmostNow(timestamp: number | Nullish): boolean {
  return !timestamp || timestamp > Date.now() - seconds.toMillis(60);
}

function getTraceSummaryRetriable([traceId, retry]: [traceId: string, retry: number]): Observable<
  Result<TraceSummary>
> {
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

function getColorByEndpoint({ service, endpoint, traceId }: { service: Service; endpoint: Endpoint; traceId: string }) {
  return getColorPool(traceId, chartColors.strokeColors100).getColorHex(
    `${service && service.id}__${endpoint && endpoint.id}`
  );
}

function getColorByEndpointType({ endpoint }: { endpoint: Endpoint }) {
  return getColor(endpoint ? endpoint.type : 'UNDEFINED');
}

function Header(props: DashboardButtonProps & { result: Result<TraceSummary> }) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-applications:labelTrace')}
      icon="lib_application_trace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={RenderTimeSelection}
      hideUrlShortener
    />
  );
}

function LoadingDashboard({ traceId, retry }: { traceId: string; retry: number }) {
  if (retry === 0) {
    return <DefaultLoadingDashboard fullInlineWidth />;
  }

  let customLoadingTitle = t('in-applications:traceDetail.components.loadingDashboard.defaultTitle');
  if (retry > 1) {
    customLoadingTitle = t('in-applications:traceDetail.components.loadingDashboard.retryTitle', { retry });
  }

  const customLoadingMessage = {
    title: customLoadingTitle,
    description: t('in-applications:traceDetail.components.loadingDashboard.loadingMessage', { traceId })
  };

  return <DefaultLoadingDashboard customLoadingMessage={customLoadingMessage} fullInlineWidth />;
}

function RetryErrorMessage({ traceId }: { traceId: string }) {
  return (
    <LeftRightPadding>
      <Message
        type="warning"
        title={t('in-applications:traceDetail.components.retryErrorMessage.title', { traceId })}
        bold
        withIcon
        className={locals.errorMessage}
        fullInlineWidth
      >
        <div className={locals.errorReasons}>
          <span>{t('in-applications:traceDetail.components.retryErrorMessage.reasonHeader')}</span>
          <ul>
            <li>{t('in-applications:traceDetail.components.retryErrorMessage.traceDropped')}</li>
            <li>{t('in-applications:traceDetail.components.retryErrorMessage.noInstanaTrace')}</li>
            <li>{t('in-applications:traceDetail.components.retryErrorMessage.outsideRetention')}</li>
          </ul>
        </div>
      </Message>
    </LeftRightPadding>
  );
}

function renderButtonLine(props: { traceId: string; result: Result<TraceSummary> }) {
  const { traceId, result } = props;
  return <TraceDetailViewButtonLine traceId={traceId} traceSummary={result?.data} />;
}

function RenderContext() {
  const { trackTraceViewNavigateBackToUa } = useApplicationTracker();
  const linkToUngroupedView = useLinkToUngroupedView();

  return (
    <DashboardHeaderContext
      href={linkToUngroupedView}
      onClick={() => trackTraceViewNavigateBackToUa()}
      label={t('in-applications:labelAnalytic')}
    />
  );
}

function renderMetaInformation({ traceId, result }: { traceId: string; result: Result<TraceSummary> }) {
  return <MetaInformation traceId={traceId} result={result} />;
}

function MetaInformation({ traceId, result }: { traceId: string; result: Result<TraceSummary> }) {
  const displayedTraceId = result?.data?.id ?? traceId;
  const lazyLoadedCallTree = shouldUseLazyLoadedCallTree(result?.data);
  const { trackTraceViewTrackIfLargeTrace } = useApplicationTracker();

  useEffect(() => {
    if (lazyLoadedCallTree) {
      trackTraceViewTrackIfLargeTrace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    </div>
  );
}

function RenderTimeSelection() {
  const { trackTraceViewClosed } = useApplicationTracker();
  const linkToUngroupedView = useLinkToUngroupedView();
  return (
    <Link href={linkToUngroupedView} onClick={() => trackTraceViewClosed()}>
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
