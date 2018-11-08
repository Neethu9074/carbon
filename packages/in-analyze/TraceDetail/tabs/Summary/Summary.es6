import { just, create } from 'reactive-observables';
import React, { Fragment } from 'react';
import { compose } from 'recompose';

import ColorCodingToggleButtons from 'in-analyze/TraceDetail/components/ColorCodingToggleButtons';
import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import { formatDate, formatTime } from 'in-services/formatters/date';
import withPropDependingState from 'in-hoc/withPropDependingState';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, millis } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { traceDetail } from 'in-analyze/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './Summary.mless';

const maximumNumberOfCallsForLargeTraceConsideration = 1000;

function getInitialLargeTraceState({ data }) {
  return {
    isLargeTrace: data != null && data.callCount > maximumNumberOfCallsForLargeTraceConsideration,
    showLargeTrace: false
  };
}

class Summary extends React.Component {
  selectedCall$ = create();
  openedCall$ = create();
  hoveredServiceEndpoint$ = create();
  timeoutHandle = null;

  constructor(props) {
    super(props);
    this.openedCall$.emit(props.callId);
  }

  componentDidMount() {
    this.selectedCallSubscription = this.selectedCall$.subscribe(call => {
      if (call) {
        this.timeoutHandle = setTimeout(() => {
          this.selectedCall$.emit(null);
        }, 1000);
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);

    if (this.selectedCallSubscription) {
      this.selectedCallSubscription.dispose();
      this.selectedCallSubscription = null;
    }
  }

  componentDidUpdate() {
    this.openedCall$.emit(this.props.callId);
  }

  render() {
    const { data: trace, getColor, callId, traceId, isLargeTrace, showLargeTrace, setShowLargeTrace } = this.props;
    const traceDetails = (
      <div className={locals.wrapper}>
        <SideEffectOnPropertyChange callId={!callId} sideEffect={refreshWindowSizeDependingState} />
        <div className={locals.left}>
          <Row>
            {trace.startTime != null && (
              <Col lg={3}>
                <KpiCard
                  title="Trace Start Time"
                  value={
                    <Fragment>
                      <span className={locals.startDate}>{formatDate(trace.startTime)}</span>
                      <span className={locals.startDate}>{formatTime(trace.startTime)}</span>
                    </Fragment>
                  }
                />
              </Col>
            )}
            <Col lg={3}>
              <KpiCard title="Sub Calls" value={number.compact(trace.callCount)} />
            </Col>
            <Col lg={3}>
              <KpiCard title="Errors in Calls" value={number.compact(trace.totalErrorCount)} />
            </Col>
            <Col lg={3}>
              <KpiCard title="Latency" value={millis.compact(trace.duration)} />
            </Col>
          </Row>

          {isLargeTrace &&
            !showLargeTrace && (
              <Row>
                <Col lg={12}>
                  <Card title="Large Trace" framed>
                    This trace is large and rendering of this trace can result in performance problems within your
                    browser. You can either{' '}
                    <Link target="_blank" external href={`/api/analyze/traces/${encodeURIComponent(traceId)}?pretty`}>
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
                <Card title="Timeline" withoutPadding framed header={<ColorCodingToggleButtons {...this.props} />}>
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
                <Card title="Calls" framed header={<ColorCodingToggleButtons {...this.props} />}>
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
      </div>
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
  };

  onCallClicked = call => {
    this.props.setCall({ callId: call.id });
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
