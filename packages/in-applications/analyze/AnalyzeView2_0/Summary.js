/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Card, Link, LoadingSkeleton, Message, Stack, Button } from '@instana/components';
import { create, just } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { useLoadCallTree } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadCallTree';
import ColorCodingToggleButtons from 'in-applications/analyze/components/TraceDetails/components/ColorCodingToggleButtons';
import MobileAppMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/MobileAppMonitoringData';
import ServerIcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/ServerIcicleChart';
import WebsiteMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-applications/analyze/components/TraceDetails/tabs/Summary/TraceValidationResult';
import { FAKE_ROOT_CALL_ID } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ServiceEndpointList from 'in-applications/analyze/components/TraceDetails/components/ServiceEndpointList';
import { isLargeTrace, shouldUseLazyLoadedCallTree } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import CallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/CallDetails';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import CallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import LogsInCallsContext from 'in-logging/components/TraceDetails/LogsInCallsContext';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import RestrictedAccessMessage from 'in-components/rbac/RestrictedAccessMessage';
import useLogsInCalls from 'in-logging/components/TraceDetails/useLogsInCalls';
import { countOtelLogs } from 'in-logging/components/TraceDetails/utils';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import Logs from 'in-logging/components/TraceDetails/components/Logs';
import { latency, number } from 'in-services/formatters/number';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { loggingEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { scrollIntoView } from 'in-services/util/dom';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({
  data: trace,
  getColor,
  callId,
  traceId,
  setCallId,
  colorCodeType,
  setColorCodeMechanism
}) {
  const isInternalVisible = useObservable(isInternalVisible$, []) || false;
  const { trackJumpToLogs } = useAnalyzeTracker();
  const {
    trackTraceViewCallTimelineDetailClicked,
    trackTraceViewCallTreeDetailClicked,
    trackTraceViewTraceServiceEndpointListClicked
  } = useApplicationTracker();

  const [showLargeTrace, setShowLargeTrace] = useState(false);
  const largeTrace = isLargeTrace(trace);
  const lazyLoading = shouldUseLazyLoadedCallTree(trace);

  const [selectedCall$] = useState(() => create());
  const [hoveredServiceEndpoint$] = useState(() => create());

  const [
    callTreeResult,
    onRelatedCallsLoaded,
    onParentAndSiblingCallsLoaded,
    expandedCalls,
    onCallExpanded,
    onCallCollapsed
  ] = useLoadCallTree({
    traceId,
    callId,
    lazyLoading
  });

  const nonFakeRootCallId = callTreeResult.data?.id !== FAKE_ROOT_CALL_ID ? callTreeResult.data?.id : undefined;
  const effectiveCallId = callId === 'ROOT' ? nonFakeRootCallId : callId;
  // if a call is selected, we will create a fade out effect by emitting 'null' as a new selected call with 1s delay
  const selectedCallFadeOutEffectTimeoutIdRef = useRef(null);
  useEffect(() => {
    const subscription = selectedCall$.subscribe(call => {
      if (call) {
        selectedCallFadeOutEffectTimeoutIdRef.current = setTimeout(() => {
          selectedCall$.emit(null);
        }, 1000);
      }
    });
    return () => {
      clearTimeout(selectedCallFadeOutEffectTimeoutIdRef.current);
      subscription.dispose();
    };
  }, [selectedCall$]);

  const numLogsToFetch = 5;

  const { logsContextValue } = useLogsInCalls({ traceId, trace, numLogsToFetch });
  const { error: otelErrorCount, warn: otelWarnCount } = countOtelLogs(logsContextValue.items);
  const isFiveLogs = logsContextValue.items.length === 5;

  const totalWarnLogCount = trace.totalWarnLogCount + otelWarnCount;
  const totalErrorLogCount = trace.totalErrorLogCount + otelErrorCount;

  const showLogsCard = loggingEnabled && logsContextValue.items.length > 0;
  const areLogsLoading = logsContextValue.progress?.loading === true;

  const logsHref = useLinkToLogs({
    tagFilterExpression: [getTraceIdTagFilter(traceId)],
    timeConfig: logsContextValue.timeConfigForLogs
  });

  const onCallClicked = call => {
    setCallId(call.id);
    trackTraceViewCallTimelineDetailClicked();
  };

  const hasWebsiteCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'web';
  const hasMobileCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'mobile';
  const missingEumCorrelation = !hasWebsiteCorrelationId && !hasMobileCorrelationId;

  const traceDetails = (
    <ContentWrapper>
      <SideEffectOnPropertyChange callId={!effectiveCallId} sideEffect={refreshWindowSizeDependingState} />
      <Row withoutSideMargin>
        <Col lg={12}>
          <TraceValidationResult issues={trace.issues} />
        </Col>
      </Row>
      <div className={locals.left}>
        {isInternalVisible &&
        trace.callRecordCount &&
        trace.callCountIgnoringBatchSize &&
        trace.callRecordCount !== trace.callCountIgnoringBatchSize ? (
          <Row withoutSideMargin>
            <Col lg={12}>
              <Message
                type="warning"
                title={t('in-applications:traceDetail.tabs.summary.duplicateCalls')}
                description={t('in-applications:traceDetail.tabs.summary.duplicateCallsDesc', {
                  traceCallCountIgnoringBatchSize: trace.callCountIgnoringBatchSize,
                  traceCallRecordCount: trace.callRecordCount
                })}
              />
            </Col>
          </Row>
        ) : null}
        {isInternalVisible && trace.ingestionBatchesCount && trace.ingestionBatchesCount > 1 ? (
          <Row withoutSideMargin>
            <Col lg={12}>
              <Message
                type="warning"
                title={t('in-applications:traceDetail.tabs.summary.batchedIngestion')}
                description={t('in-applications:traceDetail.tabs.summary.traceIngestionBatchCount', {
                  traceIngestionBatchesCount: trace.ingestionBatchesCount
                })}
              />
            </Col>
          </Row>
        ) : null}
        <Row withoutSideMargin>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.subCalls')}
              value={trace.callCount}
              renderValue={number.compact}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.erroneousCalls')}
              color={
                trace.totalErrorCount > 0
                  ? themes.default.ids.color.option.red['500']
                  : themes.default.ids.color.option.neutral['900']
              }
              value={trace.totalErrorCount}
              renderValue={number.compact}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.errorLogs')}
              color={
                totalErrorLogCount > 0
                  ? themes.default.ids.color.option.red['500']
                  : themes.default.ids.color.option.neutral['900']
              }
              value={totalErrorLogCount}
              renderValue={number.compact}
            >
              {areLogsLoading && <LoadingSkeleton className={locals.kpiSkeleton} />}
            </KpiCard>
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.warnLogs')}
              color={
                totalWarnLogCount > 0
                  ? themes.default.ids.color.option.yellow['500']
                  : themes.default.ids.color.option.neutral['900']
              }
              value={totalWarnLogCount}
              renderValue={number.compact}
            >
              {areLogsLoading && <LoadingSkeleton className={locals.kpiSkeleton} />}
            </KpiCard>
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.duration')}
              value={trace.issues && trace.issues.includes('missing_root_span') ? undefined : trace.duration}
              renderValue={latency.detailed}
            />
          </Col>
        </Row>

        {hasWebsiteCorrelationId && (
          <WebsiteMonitoringData traceId={traceId} correlationId={trace.eumCorrelationId} startTime={trace.startTime} />
        )}
        {hasMobileCorrelationId && <MobileAppMonitoringData traceId={traceId} startTime={trace.startTime} />}
        {missingEumCorrelation && (
          <div>
            <WebsiteMonitoringData traceId={traceId} correlationId={traceId} startTime={trace.startTime} />
            <MobileAppMonitoringData traceId={traceId} startTime={trace.startTime} />
          </div>
        )}

        {!largeTrace && (
          <Row singleRowTopMargin withoutSideMargin>
            <Col lg={12}>
              <Card
                title={t('in-applications:traceDetail.tabs.summary.timeline')}
                withoutPadding
                rightHeaderContent={
                  <ColorCodingToggleButtons
                    colorCodeType={colorCodeType}
                    setColorCodeMechanism={setColorCodeMechanism}
                  />
                }
              >
                <div className={locals.icicleChartWrapper}>
                  <ServerIcicleChart
                    traceId={traceId}
                    callTreeResult={callTreeResult}
                    getColor={getColor}
                    onCallClicked={onCallClicked}
                    hoveredServiceEndpoint$={hoveredServiceEndpoint$}
                    openedCallId={effectiveCallId}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {!lazyLoading && largeTrace && !showLargeTrace && (
          <Row withoutSideMargin>
            <Col lg={12}>
              <Card title={t('in-applications:traceDetail.tabs.summary.largeTrace')}>
                <Trans
                  i18nKey="in-applications:traceDetail.tabs.summary.largeTraceLink"
                  components={{
                    linkToDocs: (
                      <Link
                        target="_blank"
                        external
                        href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
                      />
                    )
                  }}
                />
                <Button onClick={() => setShowLargeTrace(true)} className={locals.attemptRendering}>
                  {t('in-applications:traceDetail.tabs.summary.attemptToRenderTrace')}
                </Button>
              </Card>
            </Col>
          </Row>
        )}

        {(lazyLoading || !largeTrace || showLargeTrace) && (
          <Row singleRowTopMargin withoutSideMargin>
            <Col lg={12}>
              <Card
                title={t('in-applications:traceDetail.tabs.summary.calls')}
                rightHeaderContent={
                  <ColorCodingToggleButtons
                    colorCodeType={colorCodeType}
                    setColorCodeMechanism={setColorCodeMechanism}
                  />
                }
              >
                <CallTree
                  callTreeResult={callTreeResult}
                  traceId={traceId}
                  getColor={getColor}
                  selectedCall$={selectedCall$}
                  onSubCallClicked={call => {
                    selectedCall$.emit(call);
                    const domElement = document.getElementById(`call-${call.id}`);
                    if (domElement) {
                      domElement.focus();
                      scrollIntoView(domElement);
                    }
                    trackTraceViewCallTreeDetailClicked();
                  }}
                  onCallClicked={onCallClicked}
                  openedCallId={effectiveCallId}
                  isLargeTrace={lazyLoading ? false : largeTrace}
                  onRelatedCallsLoaded={onRelatedCallsLoaded}
                  onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
                  expandedCalls={expandedCalls}
                  onCallExpanded={onCallExpanded}
                  onCallCollapsed={onCallCollapsed}
                  traceSummary={trace}
                />
              </Card>
            </Col>
          </Row>
        )}

        {showLogsCard && (
          <ErrorBoundary name="log section">
            <Row singleRowTopMargin withoutSideMargin>
              <Col lg={12}>
                {role.canViewLogs ? (
                  <Card
                    title={t('in-analyze:traceDetail.tabs.summary.logs')}
                    header={
                      <Button
                        kind="secondary"
                        icon="lib_analyze"
                        href={logsHref}
                        onClick={() => trackJumpToLogs({ source: 'analyze logs' })}
                      >
                        {t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}
                      </Button>
                    }
                    className={classNames({
                      [locals.logCard]: isFiveLogs
                    })}
                  >
                    {isFiveLogs && (
                      <span className={locals.logsCardDescription}>
                        {t('in-analyze:traceDetail.tabs.summary.logsCardDescription')}
                      </span>
                    )}
                    <Logs setCallId={setCallId} />
                  </Card>
                ) : (
                  <Card title={t('in-analyze:traceDetail.tabs.summary.logs')}>
                    <RestrictedAccessMessage permission={t('in-stores:permissionCanViewLogsLabel')} />
                  </Card>
                )}
              </Col>
            </Row>
          </ErrorBoundary>
        )}
        <Row singleRowTopMargin withoutSideMargin>
          <Col lg={12}>
            <Card title={t('in-applications:traceDetail.tabs.summary.serviceEndpointList')}>
              <ServiceEndpointList
                traceId={traceId}
                getColor={getColor}
                onListItemMouseEnter={service => hoveredServiceEndpoint$.emit(service)}
                onListItemMouseLeave={() => hoveredServiceEndpoint$.emit(null)}
                onClickTracker={e => trackTraceViewTraceServiceEndpointListClicked(e)}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ContentWrapper>
  );

  const callDetails = (
    <ErrorBoundary name="call tree sidebar">
      <CallDetails
        callId={effectiveCallId}
        traceId={traceId}
        correlationId={trace.eumCorrelationId}
        correlationType={trace.eumCorrelationType}
        getColor={getColor}
        onClose={() => setCallId(null)}
        startTime={trace.startTime}
        duration={trace.duration}
        rootCall={callTreeResult.data}
      />
    </ErrorBoundary>
  );

  const leftContent = <HeightRestrictedView render={() => traceDetails} />;
  const rightContent = (
    <HeightRestrictedView render={() => <Stack>{effectiveCallId && callDetails}</Stack>} callId={effectiveCallId} />
  );

  return (
    <LogsInCallsContext.Provider value={logsContextValue}>
      <TwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="65%"
        expandedSide$={effectiveCallId ? just(null) : just('left')}
      />
    </LogsInCallsContext.Provider>
  );
}
