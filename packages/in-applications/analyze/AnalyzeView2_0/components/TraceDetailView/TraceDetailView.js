/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';

import { Message, SvgIcon, Link, Pill, Button, CarbonMenuButton, CarbonMenuItem } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  LARGE_TRACE_THRESHOLD,
  isLazyLoadedCallTreeSupported,
  shouldUseLazyLoadedCallTree
} from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { analyzeTagFilterExpression } from 'in-applications/analyze/AnalyzeView2_0/components/analyzeTagFilter';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import DashboardHeaderContext from 'in-components/DashboardHeader/DashboardHeaderContext';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import getTraceSummary from 'in-applications/subscriptions/getTraceSummary';
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components/tabs';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import DropdownButton from 'in-components/Button/DropdownButton';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { analyzePath } from 'in-applications/navigation/paths';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { hasError, isLoading } from 'in-services/util/result';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { getColor } from 'in-applications/endpointTypes';
import { getChartGranularity } from 'in-stores/metric';
import Overlay from 'in-components/overlays/Overlay';
import { chartColors } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours, seconds } from 'in-services/time';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailView.mless';

const maximumNumberOfCallsForLargeTraceConsideration = LARGE_TRACE_THRESHOLD;
const MAX_RETRIES = 3;
const RETRY_DELAY = seconds.toMillis(15);

export default function TraceDetailView(props) {
  const dataSource = props.dataSource;
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
            withoutBreadcrumb
            withoutPadding
            renderLoading={() => <LoadingDashboard traceId={traceId} retry={retry} />}
            renderErrors={() => <RetryErrorMessage traceId={traceId} />}
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

  return { result$, retry };
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
      renderTimeSelection={RenderTimeSelection}
      hideUrlShortener
    />
  );
}

function LoadingDashboard({ traceId, retry }) {
  if (retry === 0) {
    return <DefaultLoadingDashboard lightMode fullInlineWidth />;
  }

  let customLoadingTitle = t('in-applications:traceDetail.components.loadingDashboard.defaultTitle');
  if (retry > 1) {
    customLoadingTitle = t('in-applications:traceDetail.components.loadingDashboard.retryTitle', { retry });
  }

  const customLoadingMessage = {
    title: customLoadingTitle,
    description: t('in-applications:traceDetail.components.loadingDashboard.loadingMessage', { traceId })
  };

  return <DefaultLoadingDashboard lightMode customLoadingMessage={customLoadingMessage} fullInlineWidth />;
}

function RetryErrorMessage({ traceId }) {
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
  const { trackAnalyzeCallsOfTraceClicked, trackDownloadTraceClicked } = useApplicationTracker();

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

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
    trackAnalyzeCallsOfTraceClicked();
  }

  const traceDownloadUrl = isLazyLoadedCallTreeSupported(result?.data)
    ? `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
        traceIdInUrl
      )}?pretty&retrievalSize=200&offset=0&ingestionTime=${Date.now()}`
    : `/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`;

  const rawTraceDownloadUrl =
    `/api/application-monitoring/analyze/traces/` +
    encodeURIComponent(traceIdInUrl) +
    `/raw?retrievalSize=100&offset=0&ingestionTime=${Date.now()}`;

  const DownloadTraceOptions = ({ close }) => {
    if (carbonButtonEnabled) {
      return (
        <>
          <CarbonMenuItem
            label={t('in-applications:linkDownloadCalls')}
            onClick={() => {
              trackDownloadTraceClicked({ rawTrace: false });
              window.open(traceDownloadUrl, '_blank');
            }}
          />
          <CarbonMenuItem
            onClick={() => {
              trackDownloadTraceClicked({ rawTrace: true });
              window.open(rawTraceDownloadUrl, '_blank');
            }}
            label={t('in-applications:linkDownloadRawTrace')}
          />
        </>
      );
    }
    return (
      <div className={locals.downloadDropdown}>
        <Button
          kind="secondary"
          noAutoMargin
          className={locals.downloadOption}
          onClick={() => {
            trackDownloadTraceClicked({ rawTrace: false });
            close();
            window.open(traceDownloadUrl, '_blank');
          }}
        >
          {t('in-applications:linkDownloadCalls')}
        </Button>
        <Button
          kind="secondary"
          noAutoMargin
          className={locals.downloadOption}
          onClick={() => {
            trackDownloadTraceClicked({ rawTrace: true });
            close();
            window.open(rawTraceDownloadUrl, '_blank');
          }}
        >
          {t('in-applications:linkDownloadRawTrace')}
        </Button>
      </div>
    );
  };

  return (
    <>
      {isTroubleshootingModeEnabled || isInternalVisible ? (
        carbonButtonEnabled ? (
          <CarbonMenuButton size="sm" kind="primary" label={t('in-applications:linkDownload')}>
            <DownloadTraceOptions />
          </CarbonMenuButton>
        ) : (
          <Overlay withoutWrapper content={DownloadTraceOptions} align="bottomMiddle">
            {({ toggle, refSetter }) => (
              <DropdownButton kind="secondary" icon="lib_actions_download" onClick={toggle} refSetter={refSetter}>
                {t('in-applications:linkDownload')}
              </DropdownButton>
            )}
          </Overlay>
        )
      ) : (
        <Button
          icon="lib_actions_download"
          kind="secondary"
          target="_blank"
          href={traceDownloadUrl}
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

function RenderContext({ getHrefToUngroupedView }) {
  const { trackTraceViewNavigateBackToUa } = useApplicationTracker();
  return (
    <DashboardHeaderContext
      href={getHrefToUngroupedView()}
      onClick={() => trackTraceViewNavigateBackToUa()}
      label={t('in-applications:labelAnalytic')}
    />
  );
}

function renderMetaInformation({ traceId, result }) {
  return <MetaInformation traceId={traceId} result={result} />;
}

function MetaInformation({ traceId, result }) {
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

function RenderTimeSelection({ getHrefToUngroupedView }) {
  const { trackTraceViewClosed } = useApplicationTracker();
  return (
    <Link href={getHrefToUngroupedView()} onClick={() => trackTraceViewClosed()}>
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
