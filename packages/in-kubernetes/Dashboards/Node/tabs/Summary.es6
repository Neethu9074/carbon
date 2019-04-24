import React, { Fragment } from 'react';

import NodeConditionsPresenter from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/NodeConditionsPresenter';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: node }) {
  const snapshotId = node.id;

  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <KpiCard title="Status" value={<Capitalize>{node.status || '-'}</Capitalize>} raw />
        </Col>
        <Col lg={3}>
          <KpiCard title="Roles" value={<Capitalize>{node.roles || '-'}</Capitalize>} raw />
        </Col>
        <Col lg={3}>
          <KpiCard title="Age" value={<Capitalize>{node.age ? formatDuration(node.age) : '-'}</Capitalize>} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Requests Alloc."
            snapshotId={snapshotId}
            metric="required_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="CPU Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_cpu_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Requests Alloc."
            snapshotId={snapshotId}
            metric="required_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Memory Limits Alloc."
            snapshotId={snapshotId}
            metric="limit_mem_percentage"
            formatter={percentage.detailed}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title="Pods Alloc."
            snapshotId={snapshotId}
            metric="alloc_pods_percentage"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card title="CPU Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['required_cpu', 'limit_cpu', 'cap_cpu'],
                labels: ['Requests', 'Limits', 'Capacity'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Memory Resources">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['required_mem', 'limit_mem', 'cap_mem'],
                labels: ['Requests', 'Limits', 'Capacity'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={4}>
          <Card title="Pods Allocation">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['allocatedPods', 'cap_pods'],
                labels: ['Allocated', 'Capacity'],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={node.conditions}
            viewAllHref$={getNodeDashboard(snapshotId, { tab: '/conditions' })}
            TablePresenter={NodeConditionsPresenter}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
