import { just, create } from 'reactive-observables';
import { compose } from 'recompose';
import React from 'react';

import ColorCodingToggleButtons from 'in-analyze/TraceDetail/components/ColorCodingToggleButtons';
import ErroneousTraceIndicator from 'in-analyze/TraceDetail/components/ErroneousTraceIndicator';
import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import WebsiteMonitoringData from 'in-analyze/TraceDetail/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-analyze/TraceDetail/tabs/Summary/TraceValidationResult';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import withPropDependingState from 'in-hoc/withPropDependingState';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { Row, Col } from 'in-new-components/layout/Grid';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, latency } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { callDetailClickedTracker } from 'in-analyze/tracker';
import { traceDetail } from 'in-analyze/navigation/paths';
import { pendingResult } from 'in-services/fixedObjects';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Button from 'in-new-components/Button';
import { connection } from 'in-connection';
import Card from 'in-new-components/Card';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';
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

    this.sendTraceViewedEventAfterDelay(this.props.data);
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
    this.sendTraceViewedEventAfterDelay(this.props.data);
  }

  sendTraceViewedEventAfterDelay(trace) {
    clearTimeout(this.traceViewedTimeoutHandle);
    this.traceViewedTimeoutHandle = setTimeout(() => {
      connection.send('traceViewed', {
        traceId: trace.id
      });
    }, 15000);
  }

  render() {
    const {
      data: trace,
      getColor,
      callId,
      traceId,
      isLargeTrace,
      showLargeTrace,
      setShowLargeTrace,
      callTreeResult
    } = this.props;
    const rootCall = callTreeResult.data;

    const traceDetails = (
      <ContentWrapper>
        <SideEffectOnPropertyChange callId={!callId} sideEffect={refreshWindowSizeDependingState} />
        <TraceValidationResult issues={trace.issues} />
        <div className={locals.left}>
          {rootCall && rootCall.errorCount ? (
            <Row>
              <Col lg={12}>
                <ErroneousTraceIndicator errorCount={trace.totalErrorCount} />
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col xs>
              <KpiCard title="Sub Calls" value={number.compact(trace.callCount)} />
            </Col>
            <Col xs>
              <KpiCard
                title="Erroneous Calls"
                color={trace.totalErrorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalErrorCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title="Error Logs"
                color={trace.totalErrorLogCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalErrorLogCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title="Warn Logs"
                color={trace.totalWarnLogCount > 0 ? theme.lib.colors.warning : theme.lib.colors.N900Primary}
                value={number.compact(trace.totalWarnLogCount)}
              />
            </Col>
            <Col xs>
              <KpiCard
                title="Latency"
                value={
                  trace.issues && trace.issues.includes('missing_root_span') ? 'N/A' : latency.detailed(trace.duration)
                }
              />
            </Col>
          </Row>

          <WebsiteMonitoringData traceId={traceId} startTime={trace.startTime} />

          {!isLargeTrace && (
            <Row>
              <Col lg={12}>
                <Card title="Timeline" withoutPadding header={<ColorCodingToggleButtons {...this.props} />}>
                  <div className={locals.icicleChartWrapper}>
                    <ServerIcicleChart
                      traceId={traceId}
                      getColor={getColor}
                      onCallClicked={this.onCallClicked}
                      hoveredServiceEndpoint$={this.hoveredServiceEndpoint$}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          <ServiceEndpointList
            traceId={traceId}
            getColor={getColor}
            onListItemMouseEnter={this.onListItemMouseEnter}
            onListItemMouseLeave={this.onListItemMouseLeave}
          />

          {isLargeTrace &&
            !showLargeTrace && (
              <Row>
                <Col lg={12}>
                  <Card title="Large Trace">
                    This trace is large and rendering of this trace can result in performance problems within your
                    browser. You can either{' '}
                    <Link
                      target="_blank"
                      external
                      href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
                    >
                      download the trace
                    </Link>{' '}
                    for manual inspection or attempt trace rendering within your browser. We will only render a subset
                    of the components in order to increase performance of this attempt.
                    <Button onClick={() => setShowLargeTrace(true)} className={locals.attemptRendering}>
                      Attempt to render trace
                    </Button>
                  </Card>
                </Col>
              </Row>
            )}

          {(!isLargeTrace || showLargeTrace) && (
            <Row>
              <Col lg={12}>
                <Card title="Calls" header={<ColorCodingToggleButtons {...this.props} />}>
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
        </div>
      </ContentWrapper>
    );

    const callDetails = (
      <ErrorBoundary name="call tree sidebar">
        <CallDetails callId={callId} traceId={traceId} getColor={getColor} onClose={this.clearSelectedCall} />
      </ErrorBoundary>
    );

    const leftContent = <HeightRestrictedView render={() => traceDetails} />;
    const rightContent = (
      <HeightRestrictedView render={() => callDetails} scrollResetProps={['callId']} callId={callId} />
    );

    return (
      <TwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="65%"
        expandedSide$={callId ? just(null) : just('left')}
      />
    );
  }

  onSubCallClicked = call => {
    this.selectedCall$.emit(call);

    const domElement = document.getElementById(`call-${call.id}`);
    if (domElement) {
      domElement.focus();
      scrollIntoViewIfNeeded(domElement);
    }
    callDetailClickedTracker();
  };

  onCallClicked = call => {
    this.props.setCall({ callId: call.id });
    callDetailClickedTracker();
  };

  clearSelectedCall = () => {
    this.props.setCall({ callId: null });
  };

  onListItemMouseEnter = service => {
    this.hoveredServiceEndpoint$.emit(service);
  };

  onListItemMouseLeave = () => {
    this.hoveredServiceEndpoint$.emit(null);
  };
}

export default compose(
  withUrlDependingState({
    getPathSegment: () => traceDetail,
    getMatrixPrefix: () => '',
    boundKeys: [callIdMatrixParameter],
    getInitialState: () => ({ callId: null }),
    reducerName: 'setCall'
  }),
  withPropDependingState({
    getInitialState: getInitialLargeTraceState,
    resets: [
      {
        getResettingProps: () => ['data'],
        onReset: getInitialLargeTraceState
      }
    ],
    reducerName: 'setShowLargeTrace',
    reducer: (prevState, showLargeTrace) => ({
      ...prevState,
      showLargeTrace
    })
  }),
  connect(props => ({
    callTreeResult: getTraceActivityTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(Summary);
