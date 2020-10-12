import theme from 'in-themes';
import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import Card from 'in-new-components/Card';

export default function UsageCharts({ windowSize, tenantUnit, showAggregatedMetrics = false }) {
  return (
    <>
      <Row>
        <Col xs={6}>
          <Card title="APM Usage">
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{ ...tenantUnit, metrics: ['apmhost'], labels: ['APM Hosts'] }}
              y2={{
                ...tenantUnit,
                metrics: ['licensed_apm_hosts'],
                labels: ['Purchased'],
                colors: [theme.lib.colors.failure]
              }}
            />
          </Card>
        </Col>
        <Col xs={6}>
          <Card title="Infrastructure Usage">
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{
                ...tenantUnit,
                metrics: ['infrahost'],
                labels: ['IQM Hosts']
              }}
              y2={{
                ...tenantUnit,
                metrics: ['licensed_infra_hosts'],
                labels: ['Purchased'],
                colors: [theme.lib.colors.failure]
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Card title="Container Usage">
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{
                ...tenantUnit,
                metrics: ['docker', 'containerd', 'crio', 'garden', 'lxc'],
                labels: ['Docker', 'ContainerD', 'Crio', 'Garden', 'LXC'],
                renderer: 'stackedArea'
              }}
              y2={{
                ...tenantUnit,
                metrics: ['licensed_container'],
                labels: ['Purchased'],
                colors: [theme.lib.colors.failure]
              }}
            />
          </Card>
        </Col>
        <Col xs={6}>
          <Card title="Serverless Usage">
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{
                ...tenantUnit,
                metrics: ['tracingserverless'],
                labels: ['Serverless']
              }}
              y2={{
                ...tenantUnit,
                metrics: ['licensed_tracingserverless'],
                labels: ['Purchased'],
                colors: [theme.lib.colors.failure]
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
