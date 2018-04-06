import { create } from 'reactive-observables';
import React, { Fragment } from 'react';
import { compose } from 'recompose';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, millis } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { traceDetail } from 'in-analyze/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import ErrorBoundary from 'in-components/ErrorBoundary';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Sidebar from 'in-new-components/layout/Sidebar';
import Card from 'in-new-components/Card';

class Summary extends React.Component {
  selectedCall$ = create();
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
    const { data: trace, getColor, callId } = this.props;
    return (
      <Fragment>
        {callId && (
          <ErrorBoundary name="call tree sidebar">
            <Sidebar relativeTopOffset={-16}>
              <CallDetails callId={callId} traceId={trace.id} onClose={this.clearSelectedCall} />
            </Sidebar>
          </ErrorBoundary>
        )}
        <Row>
          <Col lg={4}>
            <KpiCard title="Duration" value={millis.compact(trace.duration)} />
          </Col>
          <Col lg={4}>
            <KpiCard title="Calls to Services" value={number.compact(trace.callCount)} />
          </Col>
          <Col lg={4}>
            <KpiCard title="Errors in Calls" value={number.compact(trace.totalErrorCount)} />
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card title="Calls to Services">
              <ServerIcicleChart traceId={trace.id} getColor={getColor} onCallClicked={this.onSubCallClicked} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <ServiceEndpointList traceId={trace.id} getColor={getColor} />
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card title="Calls">
              <ServerCallTree
                traceId={trace.id}
                getColor={getColor}
                selectedCall$={this.selectedCall$}
                onSubCallClicked={this.onSubCallClicked}
                onCallClicked={this.onCallClicked}
              />
            </Card>
          </Col>
        </Row>
      </Fragment>
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
}

export default compose(
  withUrlDependingState({
    getPathSegment: () => traceDetail,
    getMatrixPrefix: () => '',
    boundKeys: ['callId'],
    getInitialState: () => ({ callId: null }),
    reducerName: 'setCall',
    resets: [
      // Reset the call when the trace changes
      {
        getResettingProps: () => ['data'],
        onReset: () => ({ callId: null })
      }
    ]
  })
)(Summary);
