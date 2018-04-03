import React, { Fragment } from 'react';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import { number, millis } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

export default function Summary({ data: trace, getColor }) {
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <KpiCard title="Duration" value={millis.compact(trace.duration)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Calls to Services" value={number.compact(trace.callCount)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Spans" value={number.compact(trace.spanCount)} />
        </Col>
        <Col lg={3}>
          <KpiCard title="Errors in Calls" value={number.compact(trace.totalErrorCount)} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card title="Calls to Services">
            <ServerIcicleChart traceId={trace.id} getColor={getColor} />
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
            <ServerCallTree traceId={trace.id} getColor={getColor} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
