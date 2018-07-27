import { create } from 'reactive-observables';
import { compose } from 'recompose';
import React from 'react';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import { callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, millis } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { traceDetail } from 'in-analyze/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

class Summary extends React.Component {
  selectedCall$ = create();
  hoveredServiceEndpoint$ = create();
  timeoutHandle = null;

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

  render() {
    const { data: trace, getColor, callId, traceId } = this.props;
    const traceDetails = (
      <div className={locals.wrapper}>
        <div className={locals.left}>
          <Row>
            <Col lg={4}>
              <KpiCard title="Service Calls" value={number.compact(trace.callCount)} />
            </Col>
            <Col lg={4}>
              <KpiCard title="Latency" value={millis.compact(trace.duration)} />
            </Col>
            <Col lg={4}>
              <KpiCard title="Errors in Calls" value={number.compact(trace.totalErrorCount)} />
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card title="Timeline" withoutPadding framed>
                <div className={locals.icicleChartWrapper}>
                  <ServerIcicleChart
                    traceId={traceId}
                    getColor={getColor}
                    onCallClicked={this.onSubCallClicked}
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

          <Row>
            <Col lg={12}>
              <Card title="Calls" framed>
                <ServerCallTree
                  traceId={traceId}
                  openedCall={callId}
                  getColor={getColor}
                  selectedCall$={this.selectedCall$}
                  onSubCallClicked={this.onSubCallClicked}
                  onCallClicked={this.onCallClicked}
                />
              </Card>
            </Col>
          </Row>
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
        expandedSide$={
          callId
            ? create()
                .emit(null)
                .freeze()
            : create()
                .emit('left')
                .freeze()
        }
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
    reducerName: 'setCall',
    resets: [
      // Reset the call when the trace changes
      {
        getResettingProps: () => ['traceId'],
        onReset: () => ({ callId: null })
      }
    ]
  })
)(Summary);
