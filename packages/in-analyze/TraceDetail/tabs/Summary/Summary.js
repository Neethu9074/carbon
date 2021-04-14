/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just, create } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import React, { useState } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { callId as callIdMatrixParameter, logId as logIdMatrixParameter } from 'in-analyze/navigation/matrix';
import ColorCodingToggleButtons from 'in-analyze/TraceDetail/components/ColorCodingToggleButtons';
import MobileAppMonitoringData from 'in-analyze/TraceDetail/tabs/Summary/MobileAppMonitoringData';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import WebsiteMonitoringData from 'in-analyze/TraceDetail/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-analyze/TraceDetail/tabs/Summary/TraceValidationResult';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import LogDetails from 'in-analyze/TraceDetail/components/LogDetails/LogDetails';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { loggingEnabledOnTrace } from 'in-services/featureFlags';
import { number, latency } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { callDetailClickedTracker } from 'in-analyze/tracker';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import Logs from 'in-analyze/TraceDetail/components/Logs';
import { traceDetail } from 'in-analyze/navigation/paths';
import { warning } from 'in-new-components/Message/types';
import { Row, Col } from 'in-new-components/layout/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { scrollIntoView } from 'in-services/util/dom';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Button from 'in-new-components/Button';
import { minutes } from 'in-services/time';
import { connection } from 'in-connection';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from './Summary.mless';

const maximumNumberOfCallsForLargeTraceConsideration = 1000;

function getInitialLargeTraceState({ data }) {
  return {
    isLargeTrace:
      data != null &&
      // The number of visual items we would have to render dictates whether a trace is large or not.
      // The callCount itself is misleading, because a call can be batched. So a single visual item
      // would represent 500 calls. This is why we are preferrring callCountIgnoringBatchSize
      // over callCount
      (data.callCountIgnoringBatchSize || data.callCount) > maximumNumberOfCallsForLargeTraceConsideration,
    showLargeTrace: false
  };
}

class Summary extends React.Component {
  selectedCall$ = create();
  openedCall$ = create();
  hoveredServiceEndpoint$ = create();
  selectedCallTimeoutHandle = null;
  traceViewedTimeoutHandle = null;

  state = {
    selectedLog: null
  };

  constructor(props) {
    super(props);
    this.openedCall$.emit(props.callId);
  }

  componentDidMount() {
    this.selectedCallSubscription = this.selectedCall$.subscribe(call => {
      if (call) {
        this.selectedCallTimeoutHandle = setTimeout(() => {
          this.selectedCall$.emit(null);
        }, 1000);
      }
    });

    this.sendTraceViewedEventAfterDelay(this.props.traceId);
  }

  componentWillUnmount() {
    clearTimeout(this.selectedCallTimeoutHandle);

    if (this.selectedCallSubscription) {
      this.selectedCallSubscription.dispose();
      this.selectedCallSubscription = null;
    }

    clearTimeout(this.traceViewedTimeoutHandle);
  }

  componentDidUpdate() {
    this.openedCall$.emit(this.props.callId);
    this.sendTraceViewedEventAfterDelay(this.props.traceId);
  }

  sendTraceViewedEventAfterDelay(traceId) {
    clearTimeout(this.traceViewedTimeoutHandle);
    this.traceViewedTimeoutHandle = setTimeout(() => {
      connection.send('traceViewed', {
        traceId: traceId
      });
    }, 15000);
  }

  render() {
    const {
      data: trace,
      getColor,
      callId,
      logId,
      traceId,
      isLargeTrace,
      showLargeTrace,
      setShowLargeTrace,
      callTreeResult,
      isInternalVisible
    } = this.props;

    const rootCall = callTreeResult.data;

    const hasWebsiteCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'web';
    const hasMobileCorrelationId = trace.eumCorrelationId != null && trace.eumCorrelationType === 'mobile';
    const missingEumCorrelation = !hasWebsiteCorrelationId && !hasMobileCorrelationId;

    const timeWindowExtend = minutes.toMillis(10);
    const timeConfigForLogs = {
      to: trace.startTime + timeWindowExtend,
      windowSize: trace.duration + timeWindowExtend * 2,
      focusedMoment: trace.startTime + timeWindowExtend,
      autoRefresh: false
    };

    const traceDetails = (
      <ContentWrapper>
        <SideEffectOnPropertyChange callId={!callId} sideEffect={refreshWindowSizeDependingState} />
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
                  type={warning}
                  title={t('in-analyze:traceDetail.tabs.summary.duplicateCalls')}
                  description={t('in-analyze:traceDetail.tabs.summary.duplicateCallsDesc', {
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
                  type={warning}
                  title={t('in-analyze:traceDetail.tabs.summary.batchedIngestion')}
                  description={t('in-analyze:traceDetail.tabs.summary.traceIngestionBatchCount', {
                    traceIngestionBatchesCount: trace.ingestionBatchesCount
                  })}
                />
              </Col>
            </Row>
          ) : null}
          {rootCall && rootCall.errorCount ? (
            <Row withoutSideMargin>
              <Col lg={12}>
                <Message type={trace.totalErrorCount} title={t('in-analyze:traceDetail.tabs.summary.erroneousTrace')} />
              </Col>
            </Row>
          ) : null}
          <Row withoutSideMargin>
            <Col xs>
              <KpiCard
                title={t('in-analyze:traceDetail.tabs.summary.subCalls')}
                value={number.compact(trace.callCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title={t('in-analyze:traceDetail.tabs.summary.erroneousCalls')}
                color={trace.totalErrorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalErrorCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title={t('in-analyze:traceDetail.tabs.summary.errorLogs')}
                color={trace.totalErrorLogCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalErrorLogCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title={t('in-analyze:traceDetail.tabs.summary.warnLogs')}
                color={trace.totalWarnLogCount > 0 ? theme.lib.colors.warning : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalWarnLogCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title={t('in-analyze:traceDetail.tabs.summary.latency')}
                value={
                  trace.issues && trace.issues.includes('missing_root_span') ? 'N/A' : latency.detailed(trace.duration)
                }
              />
            </Col>
          </Row>

          {hasWebsiteCorrelationId && (
            <WebsiteMonitoringData
              traceId={traceId}
              correlationId={trace.eumCorrelationId}
              startTime={trace.startTime}
            />
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
                  title={t('in-analyze:traceDetail.tabs.summary.timeline')}
                  withoutPadding
                  header={<ColorCodingToggleButtons {...this.props} />}
                >
                  <div className={locals.icicleChartWrapper}>
                    <ServerIcicleChart
                      traceId={traceId}
                      getColor={getColor}
                      onCallClicked={this.onCallClicked}
                      hoveredServiceEndpoint$={this.hoveredServiceEndpoint$}
                      openedCall$={this.openedCall$}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          <Row singleRowTopMargin withoutSideMargin>
            <Col lg={12}>
              <Card title={t('in-analyze:traceDetail.tabs.summary.serviceEndpointList')}>
                <ServiceEndpointList
                  traceId={traceId}
                  getColor={getColor}
                  onListItemMouseEnter={this.onListItemMouseEnter}
                  onListItemMouseLeave={this.onListItemMouseLeave}
                />
              </Card>
            </Col>
          </Row>

          {isLargeTrace && !showLargeTrace && (
            <Row withoutSideMargin>
              <Col lg={12}>
                <Card title={t('in-analyze:traceDetail.tabs.summary.largeTrace')}>
                  <Trans
                    i18nKey="in-analyze:traceDetail.tabs.summary.largeTraceLink"
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
                    {t('in-analyze:traceDetail.tabs.summary.attemptToRenderTrace')}
                  </Button>
                </Card>
              </Col>
            </Row>
          )}

          {(!isLargeTrace || showLargeTrace) && (
            <Row singleRowTopMargin withoutSideMargin>
              <Col lg={12}>
                <Card
                  title={t('in-analyze:traceDetail.tabs.summary.calls')}
                  header={<ColorCodingToggleButtons {...this.props} />}
                >
                  <CallTree
                    callTreeResult={callTreeResult}
                    traceId={traceId}
                    getColor={getColor}
                    selectedCall$={this.selectedCall$}
                    onSubCallClicked={this.onSubCallClicked}
                    onCallClicked={this.onCallClicked}
                    openedCall$={this.openedCall$}
                    isLargeTrace={isLargeTrace}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {loggingEnabledOnTrace && (
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
                      >
                        {t('in-analyze:traceDetail.tabs.summary.analyzeLogs')}
                      </Button>
                    }
                  >
                    <Logs
                      traceId={traceId}
                      selectLogId={this.selectLogId}
                      clearSelectedLogId={this.clearSelectedLogId}
                      selectedLogId={logId}
                      timeConfigForLogs={timeConfigForLogs}
                    />
                  </Card>
                </Col>
              </Row>
            </ErrorBoundary>
          )}
        </div>
      </ContentWrapper>
    );

    const leftContent = <HeightRestrictedView render={() => traceDetails} />;
    const rightContent = logId ? (
      <HeightRestrictedView
        render={() => (
          <ErrorBoundary name="log tree sidebar">
            <LogDetails logId={logId} onClose={this.clearSelectedLogId} />
          </ErrorBoundary>
        )}
        scrollResetProps={['callId']}
        callId={callId}
      />
    ) : (
      <HeightRestrictedView
        render={() => (
          <ErrorBoundary name="call tree sidebar">
            <CallDetails
              callId={callId}
              traceId={traceId}
              correlationId={trace.eumCorrelationId}
              correlationType={trace.eumCorrelationType}
              getColor={getColor}
              onClose={this.clearSelectedCall}
              startTime={trace.startTime}
              rootCall={callTreeResult.data}
            />
          </ErrorBoundary>
        )}
        scrollResetProps={['logId']}
        logId={logId}
      />
    );

    return (
      <TwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="65%"
        expandedSide$={callId || logId ? just(null) : just('left')}
      />
    );
  }

  onSubCallClicked = call => {
    this.selectedCall$.emit(call);

    const domElement = document.getElementById(`call-${call.id}`);
    if (domElement) {
      domElement.focus();
      scrollIntoView(domElement);
    }
    callDetailClickedTracker();
  };

  onCallClicked = call => {
    this.props.setCallId(call.id);
    this.clearSelectedLogId();
    callDetailClickedTracker();
  };

  clearSelectedCall = () => {
    this.props.setCallId(null);
  };

  selectLogId = id => {
    this.props.setLogId(id);
    this.clearSelectedCall();
  };

  clearSelectedLogId = () => {
    this.props.setLogId(null);
  };

  onListItemMouseEnter = service => {
    this.hoveredServiceEndpoint$.emit(service);
  };

  onListItemMouseLeave = () => {
    this.hoveredServiceEndpoint$.emit(null);
  };
}

const urlSettingsConfig = {
  bind: [
    {
      path: traceDetail,
      name: callIdMatrixParameter,
      initialState: null
    },
    {
      path: traceDetail,
      name: logIdMatrixParameter,
      initialState: null
    }
  ]
};

export default function SummaryWrapper(props) {
  const [urlState, onChange] = useUrlState(urlSettingsConfig);

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const callTreeResult =
    useObservable(() => getTraceActivityTree({ id: props.traceId }), [props.traceId]) ?? pendingResult;

  const callIdFromUrl = urlState[callIdMatrixParameter];
  const callId = callIdFromUrl === 'ROOT' && callTreeResult.data ? callTreeResult.data.id : callIdFromUrl;

  const [showLargeTrace, setShowLargeTrace] = useState(getInitialLargeTraceState(callTreeResult), [
    callTreeResult.data
  ]);

  return (
    <Summary
      {...props}
      callId={callId}
      logId={urlState[logIdMatrixParameter]}
      setCallId={id => {
        const obj = {};
        obj[callIdMatrixParameter] = id;
        onChange(obj);
      }}
      setLogId={id => {
        const obj = {};
        obj[logIdMatrixParameter] = id;
        onChange(obj);
      }}
      isInternalVisible={isInternalVisible}
      callTreeResult={callTreeResult}
      showLargeTrace={showLargeTrace}
      setShowLargeTrace={setShowLargeTrace}
    />
  );
}
