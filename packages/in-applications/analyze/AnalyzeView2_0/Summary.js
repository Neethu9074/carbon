/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useRef, useState } from 'react';

import { just, create } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import ColorCodingToggleButtons from 'in-applications/analyze/components/TraceDetails/components/ColorCodingToggleButtons';
import MobileAppMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/MobileAppMonitoringData';
import ServerIcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/ServerIcicleChart';
import WebsiteMonitoringData from 'in-applications/analyze/components/TraceDetails/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-applications/analyze/components/TraceDetails/tabs/Summary/TraceValidationResult';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ServiceEndpointList from 'in-applications/analyze/components/TraceDetails/components/ServiceEndpointList';
import CallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/CallDetails';
import LogDetails from 'in-applications/analyze/components/TraceDetails/components/LogDetails/LogDetails';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import CallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import Logs from 'in-applications/analyze/components/TraceDetails/components/Logs';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { loggingEnabledOnTrace } from 'in-services/featureFlags';
import { number, latency } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { callDetailClickedTracker } from 'in-analyze/tracker';
import { isLoading, hasError } from 'in-services/util/result';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import { pendingResult } from 'in-services/fixedObjects';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { scrollIntoView } from 'in-services/util/dom';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { minutes } from 'in-services/time';
import { connection } from 'in-connection';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from './Summary.mless';

const maximumNumberOfCallsForLargeTraceConsideration = 1000;

export default function Summary({
  data: trace,
  getColor,
  callId,
  traceId,
  logId: logIdPair,
  setCallId,
  setLogId,
  colorCodeType,
  setColorCodeMechanism
}) {
  // backward compatibility for old links.
  // TODO: Remove after once released
  if (typeof logIdPair === 'string') {
    logIdPair = { logId: logIdPair, spanId: undefined };
  }

  const isInternalVisible = useObservable(isInternalVisible$, []) || false;
  const callTreeResult = useObservable(() => getTraceActivityTree({ id: traceId }), [traceId]) ?? pendingResult;

  const [showLargeTrace, setShowLargeTrace] = useState(false);
  const isLargeTrace =
    trace != null &&
    // The number of visual items we would have to render dictates whether a trace is large or not.
    // The callCount itself is misleading, because a call can be batched. So a single visual item
    // would represent 500 calls. This is why we are preferrring callCountIgnoringBatchSize
    // over callCount
    (trace.callCountIgnoringBatchSize || trace.callCount) > maximumNumberOfCallsForLargeTraceConsideration;

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
    callDetailClickedTracker();
  };

  const selectLogId = ids => {
    setLogId(ids);
  };

  const clearSelectedLogId = () => {
    setLogId(null);
  };

  const rootCall = callTreeResult.data;

  const hasWebsiteCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'web';
  const hasMobileCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'mobile';
  const missingEumCorrelation = !hasWebsiteCorrelationId && !hasMobileCorrelationId;
  const totalNumberOfLogs = countLogs(callTreeResult);

  const timeWindowExtend = minutes.toMillis(10);
  const timeConfigForLogs = {
    to: trace.startTime + timeWindowExtend,
    windowSize: trace.duration + timeWindowExtend * 2,
    focusedMoment: trace.startTime + timeWindowExtend,
    autoRefresh: false
  };

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
        {rootCall && rootCall.errorCount ? (
          <Row withoutSideMargin>
            <Col lg={12}>
              <Message
                type={trace.totalErrorCount}
                title={t('in-applications:traceDetail.tabs.summary.erroneousTrace')}
              />
            </Col>
          </Row>
        ) : null}
        <Row withoutSideMargin>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.subCalls')}
              value={number.compact(trace.callCount)}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.erroneousCalls')}
              color={trace.totalErrorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
              value={number.compact(trace.totalErrorCount)}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.errorLogs')}
              color={trace.totalErrorLogCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
              value={number.compact(trace.totalErrorLogCount)}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.warnLogs')}
              color={trace.totalWarnLogCount > 0 ? theme.lib.colors.warning : theme.lib.colors.N900Primary}
              value={number.compact(trace.totalWarnLogCount)}
            />
          </Col>
          <Col xs preserveVerticalGutter>
            <KpiCard
              title={t('in-applications:traceDetail.tabs.summary.latency')}
              value={
                trace.issues && trace.issues.includes('missing_root_span') ? 'N/A' : latency.detailed(trace.duration)
              }
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

        {!isLargeTrace && (
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

        <Row singleRowTopMargin withoutSideMargin>
          <Col lg={12}>
            <Card title={t('in-applications:traceDetail.tabs.summary.serviceEndpointList')}>
              <ServiceEndpointList
                traceId={traceId}
                getColor={getColor}
                onListItemMouseEnter={service => hoveredServiceEndpoint$.emit(service)}
                onListItemMouseLeave={() => hoveredServiceEndpoint$.emit(null)}
              />
            </Card>
          </Col>
        </Row>

        {isLargeTrace && !showLargeTrace && (
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

        {(!isLargeTrace || showLargeTrace) && (
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
                    callDetailClickedTracker();
                  }}
                  onCallClicked={onCallClicked}
                  openedCallId={effectiveCallId}
                  isLargeTrace={isLargeTrace}
                  timeConfigForLogs={timeConfigForLogs}
                  selectLogId={selectLogId}
                  totalNumberOfLogs={totalNumberOfLogs}
                />
              </Card>
            </Col>
          </Row>
        )}

        {loggingEnabledOnTrace && totalNumberOfLogs > 0 && (
          <ErrorBoundary name="log section">
            <Row singleRowTopMargin withoutSideMargin>
              <Col lg={12}>
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
              </Col>
            </Row>
          </ErrorBoundary>
        )}
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
