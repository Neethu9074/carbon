import { just, create } from 'reactive-observables';
import { compose } from 'recompose';
import React from 'react';

import ColorCodingToggleButtons from 'in-analyze/TraceDetail/components/ColorCodingToggleButtons';
import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import WebsiteMonitoringData from 'in-analyze/TraceDetail/tabs/Summary/WebsiteMonitoringData';
import TraceValidationResult from 'in-analyze/TraceDetail/tabs/Summary/TraceValidationResult';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import withPropDependingState from 'in-hoc/withPropDependingState';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, millis } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { createTracker } from 'in-services/tracking/mixpanel';
import { traceDetail } from 'in-analyze/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Button from 'in-new-components/Button';
import { connection } from 'in-connection';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './Summary.mless';

const maximumNumberOfCallsForLargeTraceConsideration = 1000;

const clickCallTracker = createTracker('analyze.detail.call.click');

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
    const { data: trace, getColor, callId, traceId, isLargeTrace, showLargeTrace, setShowLargeTrace } = this.props;
    const traceDetails = (
      <ContentWrapper>
        <SideEffectOnPropertyChange callId={!callId} sideEffect={refreshWindowSizeDependingState} />
        <TraceValidationResult issues={trace.issues} />
        <div className={locals.left}>
          <Row>
            {trace.startTime != null && (
              <Col lg={3}>
                <DateTimeKpiCard title="Trace Start Time" time={trace.startTime} />
              </Col>
            )}
            <Col lg={3}>
              <KpiCard title="Sub Calls" value={number.compact(trace.callCount)} />
            </Col>
            <Col lg={3}>
              <KpiCard title="Errors in Calls" value={number.compact(trace.totalErrorCount)} />
            </Col>
            <Col lg={3}>
              <KpiCard title="Latency" value={millis.fixed.compact(trace.duration)} />
            </Col>
          </Row>

          <WebsiteMonitoringData traceId={traceId} startTime={trace.startTime} />

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
                  <ServiceEndpointList
                    traceId={traceId}
                    getColor={getColor}
                    onListItemMouseEnter={this.onListItemMouseEnter}
                    onListItemMouseLeave={this.onListItemMouseLeave}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {(!isLargeTrace || showLargeTrace) && (
            <Row>
              <Col lg={12}>
                <Card title="Calls" header={<ColorCodingToggleButtons {...this.props} />}>
                  <ServerCallTree
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
    const rightContent = <HeightRestrictedView render={() => callDetails} />;

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
    clickCallTracker();
  };

  onCallClicked = call => {
    this.props.setCall({ callId: call.id });
    clickCallTracker();
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
  })
)(Summary);
