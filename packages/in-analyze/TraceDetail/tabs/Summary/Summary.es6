import { create } from 'reactive-observables';
import React, { Fragment } from 'react';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import CallDetails from 'in-analyze/TraceDetail/components/CallDetails/CallDetails';
import { number, millis } from 'in-services/formatters/number';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Sidebar from 'in-new-components/layout/Sidebar';
import Card from 'in-new-components/Card';

export default class extends React.Component {
  static displayName = 'Summary';

  selectedCall$ = create();
  timeoutHandle = null;

  state = {
    selectedCall: null
  };

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
    const { data: trace, getColor } = this.props;
    const { selectedCall } = this.state;

    return (
      <Fragment>
        {selectedCall && (
          <Sidebar onClose={this.clearSelectedCall}>
            <CallDetails call={selectedCall} />
          </Sidebar>
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
    this.setState({ selectedCall: call });
  };

  clearSelectedCall = () => {
    this.setState({ selectedCall: null });
  };
}
