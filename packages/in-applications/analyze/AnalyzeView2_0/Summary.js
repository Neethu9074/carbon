/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useRef, useState } from 'react';

import { Button, Card, Link, Message } from '@instana/components';
import { create, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { useLoadCallTree } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadCallTree';
import ColorCodingToggleButtons from 'in-applications/analyze/components/TraceDetails/components/ColorCodingToggleButtons';
import MobileAppMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/MobileAppMonitoringData';
import ServerIcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/ServerIcicleChart';
import WebsiteMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-applications/analyze/components/TraceDetails/tabs/Summary/TraceValidationResult';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ServiceEndpointList from 'in-applications/analyze/components/TraceDetails/components/ServiceEndpointList';
import { isLargeTrace, shouldUseLazyLoadedCallTree } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import CallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/CallDetails';
import LogDetails from 'in-applications/analyze/components/TraceDetails/components/LogDetails/LogDetails';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import CallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import Logs from 'in-applications/analyze/components/TraceDetails/components/Logs';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import RestrictedAccessMessage from 'in-components/rbac/RestrictedAccessMessage';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { latency, number } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { hasError, isLoading } from 'in-services/util/result';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import { loggingEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { scrollIntoView } from 'in-services/util/dom';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { minutes } from 'in-services/time';
import { connection } from 'in-connection';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';
import theme from 'in-themes';

import locals from './Summary.mless';

export default function Summary({
  data: trace,
  getColor,
  callId,
  traceId,
  logId: logIdPair,
  setCallId,
  setLogId,
  colorCodeType,
  setColorCodeMechanism,
  tracker
}) {
  // backward compatibility for old links.
  // TODO: Remove after once released
  if (typeof logIdPair === 'string') {
    logIdPair = { logId: logIdPair, spanId: undefined };
  }

  const isInternalVisible = useObservable(isInternalVisible$, []) || false;

  const [showLargeTrace, setShowLargeTrace] = useState(false);
  const largeTrace = isLargeTrace(trace);
  const lazyLoading = shouldUseLazyLoadedCallTree(trace);

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

  const effectiveCallId = callId === 'ROOT' && callTreeResult.data ? callTreeResult.data.id : callId;

  const selectedCall$ = create();
  const hoveredServiceEndpoint$ = create();
  const selectedCallTimeoutHandle = useRef(null);
  const traceViewedTimeoutHandle = useRef(null);
  const selectedCallSubscription = useRef(null);

  useEffect(() => {
    selectedCallSubscription.current = selectedCall$.subscribe(call => {
      if (call) {
        selectedCallTimeoutHandle.current = setTimeout(() => {
          selectedCall$.emit(null);
        }, 1000);
      }
    });
    sendTraceViewedEventAfterDelay(traceId);
    return () => {
      clearTimeout(selectedCallTimeoutHandle.current);

      if (selectedCallSubscription.current) {
        selectedCallSubscription.current.dispose();
        selectedCallSubscription.current = null;
      }

      clearTimeout(traceViewedTimeoutHandle.current);
    };
  }, []);

  useEffect(() => {
    sendTraceViewedEventAfterDelay(traceId);
  }, [traceId]);

  const sendTraceViewedEventAfterDelay = traceId => {
    clearTimeout(traceViewedTimeoutHandle.current);
    traceViewedTimeoutHandle.current = setTimeout(() => {
      connection.send('traceViewed', {
        traceId: traceId
      });
    }, 15000);
  };

  const onCallClicked = call => {
    setCallId(call.id);
    tracker.traceViewCallTimelineDetailClickedTracker();
  };

  const selectLogId = ids => {
    setLogId(ids);
  };

  const clearSelectedLogId = () => {
    setLogId(null);
  };

  const hasWebsiteCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'web';
  const hasMobileCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'mobile';
  const missingEumCorrelation = !hasWebsiteCorrelationId && !hasMobileCorrelationId;

  // Determining the log count by traversing the call tree was introduced in https://github.ibm.com/instana/ui-client/pull/6308 with
  // the following comment: "Since the error and warn counts on the trace don't seem to be stable, we calculate the number of logs
  // by hand from the trace tree."
  // TODO: https://instana.kanbanize.com/ctrl_board/66/cards/120908/details/
  const totalNumberOfLogs = lazyLoading
    ? trace.totalErrorLogCount + trace.totalWarnLogCount
    : countLogs(callTreeResult);

  const timeWindowExtend = minutes.toMillis(10);
  const timeConfigForLogs = {
    to: trace.startTime + timeWindowExtend,
    windowSize: trace.duration + timeWindowExtend * 2,
    focusedMoment: trace.startTime + timeWindowExtend,
    autoRefresh: false
  };

  const hasLogs = loggingEnabled && totalNumberOfLogs > 0;

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
              color={trace.totalErrorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
              value={trace.totalErrorCount}
              renderValue={number.compact}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.errorLogs')}
              color={trace.totalErrorLogCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
              value={trace.totalErrorLogCount}
              renderValue={number.compact}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.warnLogs')}
              color={trace.totalWarnLogCount > 0 ? theme.lib.colors.warning : theme.lib.colors.N900Primary}
              value={trace.totalWarnLogCount}
              renderValue={number.compact}
            />
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
                header={
                  <ColorCodingToggleButtons
                    colorCodeType={colorCodeType}
                    setColorCodeMechanism={setColorCodeMechanism}
                  />
                }
              >
                <div className={locals.icicleChartWrapper}>
                  <ServerIcicleChart
                    traceId={traceId}
                    getColor={getColor}
                    onCallClicked={onCallClicked}
                    hoveredServiceEndpoint$={hoveredServiceEndpoint$}
                    openedCallId={effectiveCallId}
                    timeConfigForLogs={timeConfigForLogs}
                    selectLogId={selectLogId}
                    totalNumberOfLogs={totalNumberOfLogs}
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
                header={
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
                    tracker.traceViewCallTreeDetailClickedTracker();
                  }}
                  onCallClicked={onCallClicked}
                  openedCallId={effectiveCallId}
                  isLargeTrace={lazyLoading ? false : largeTrace}
                  timeConfigForLogs={timeConfigForLogs}
                  selectLogId={selectLogId}
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

        {hasLogs && (
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
                        href$={getLinkToAnalyze({
                          tagFilterExpression: [getTraceIdTagFilter(traceId)],
                          timeConfig: timeConfigForLogs
                        })}
                        onClick={() => jumpToLogs({ source: 'analyze logs' })}
                      >
                        {t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}
                      </Button>
                    }
                  >
                    <Logs
                      traceId={traceId}
                      selectLogId={selectLogId}
                      clearSelectedLogId={clearSelectedLogId}
                      selectedLogIdPair={logIdPair}
                      timeConfigForLogs={timeConfigForLogs}
                      totalNumberOfLogs={totalNumberOfLogs}
                    />
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
                onClickTracker={e => {
                  tracker.traceViewTraceServiceEndpointListClickedTracker(e);
                }}
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
        rootCall={callTreeResult.data}
      />
    </ErrorBoundary>
  );

  const logDetails = (
    <ErrorBoundary name="log tree sidebar">
      <LogDetails
        selectedLogIdPair={logIdPair}
        callId={callId}
        onClose={clearSelectedLogId}
        timeConfigForLogs={timeConfigForLogs}
        totalNumberOfLogs={totalNumberOfLogs}
      />
    </ErrorBoundary>
  );

  const leftContent = <HeightRestrictedView render={() => traceDetails} />;
  const rightContent = (
    <HeightRestrictedView
      render={() => (logIdPair ? logDetails : callDetails)}
      scrollResetProps={logIdPair ? ['callId'] : ['logId']}
      callId={effectiveCallId}
      selectedLogIdPair={logIdPair}
    />
  );

  return (
    <TwoColumnView
      leftContent={leftContent}
      rightContent={rightContent}
      leftWidth="65%"
      expandedSide$={effectiveCallId || logIdPair ? just(null) : just('left')}
    />
  );
}

function countLogs(callTreeResult) {
  if (isLoading(callTreeResult) || hasError(callTreeResult)) {
    return 0;
  }
  return countLogsForCall(callTreeResult.data);
}

function countLogsForCall(call, counter = 0) {
  if (call.model === 'LOG') {
    counter++;
  }
  if (call.children) {
    call.children.forEach(subCall => (counter += countLogsForCall(subCall)));
  }
  return counter;
}
