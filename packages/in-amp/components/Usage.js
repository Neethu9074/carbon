import React, { useState } from 'react';
import theme from 'in-themes';

import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

import locals from './Usage.mless';

export default function TimeRestrictedUsageWrapper() {
  const timeConfig = useTimeConfig();
  return (
    <UsageTimeConfigContextModification timeConfig={timeConfig}>
      <Usage />
    </UsageTimeConfigContextModification>
  );
}

function Usage() {
  const [showAggregatedMetrics, setShowAggregatedMetrics] = useState(false);

  return (
    <>
      <Title title="Company Information" />

      <div className={locals.buttonHeader}>
        <Button
          kind={showAggregatedMetrics ? 'primaryv2' : 'secondary'}
          onClick={() => setShowAggregatedMetrics(!showAggregatedMetrics)}
        >
          {`${showAggregatedMetrics ? 'Hide' : 'Show'}`} aggregated values
        </Button>
        <AmpTimeSelection />
      </div>

      <form>
        <Row>
          <Col xs={12}>
            <Card title="APM Usage">
              <UsageChart
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{ metrics: ['apmhost'], labels: ['AMP Hosts'] }}
                y2={{ metrics: ['licensed_apm_hosts'], labels: ['Purchased'], colors: [theme.lib.colors.failure] }}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card title="Infra Usage">
              <UsageChart
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{ metrics: ['infrahost'], labels: ['Infra Hosts'] }}
                y2={{ metrics: ['licensed_infra_hosts'], labels: ['Purchased'], colors: [theme.lib.colors.failure] }}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card title="Container Usage">
              <UsageChart
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{
                  metrics: ['docker', 'containerd', 'crio', 'garden', 'lxc'],
                  labels: ['Docker', 'ContainerD', 'Crio', 'Garden', 'LXC'],
                  renderer: 'stackedArea'
                }}
                y2={{ metrics: ['licensed_container'], labels: ['Purchased'], colors: [theme.lib.colors.failure] }}
              />
            </Card>
          </Col>
        </Row>
      </form>
    </>
  );
}
