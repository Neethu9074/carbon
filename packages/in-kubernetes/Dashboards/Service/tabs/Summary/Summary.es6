import React, { Fragment } from 'react';

import EventTopList from 'in-kubernetes/Dashboards/Service/tabs/Summary/EventTopList';
import LogTopList from 'in-kubernetes/Dashboards/Service/tabs/Summary/LogTopList';
import PodTopList from 'in-kubernetes/Dashboards/Service/tabs/Summary/PodTopList';
import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function Summary({ timeConfig, data }) {
  const granularity = getChartGranularity(timeConfig);
  const service = data;
  const result = {
    progress: { loading: false },
    errors: [],
    data
  };

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Type"
            result={result}
            renderKpiCard={() => <KpiCard title="Type" value={service.type} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Location"
            result={result}
            renderKpiCard={() => <KpiCard title="Location" value={service.location} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Age"
            result={result}
            renderKpiCard={() => <KpiCard title="Age" value={service.age} />}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <EventTopList timeConfig={timeConfig} serviceId={service.id} />
        </Col>
        <Col lg={6}>
          <LogTopList timeConfig={timeConfig} serviceId={service.id} />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Matching Pods"
            result={result}
            renderKpiCard={() => <KpiCard title="Matching Pods" value={data.matchingPods} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="CPU Usage"
            result={result}
            renderKpiCard={() => <KpiCard title="CPU Usage" value={data.cpuUsage} />}
          />
        </Col>
        <Col lg={4}>
          <ResultAwareKpiCard
            title="Memory Usage"
            result={result}
            renderKpiCard={() => <KpiCard title="Memory Usage" value={data.memoryUsed} />}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <PodTopList timeConfig={timeConfig} serviceId={service.id} />
        </Col>
        <Col lg={4}>
          <AppdataChartWrapper
            cardTitle="CPU Resources (cpu units)"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Used', 'Requests', 'Limits'],
              metricIds: ['used', 'requests', 'limits']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                service: service.id
              },
              metrics: {
                used: {
                  metric: 'used',
                  granularity,
                  aggregation: 'MEAN'
                },
                requests: {
                  metric: 'requests',
                  granularity,
                  aggregation: 'MEAN'
                },
                limits: {
                  metric: 'limits',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <AppdataChartWrapper
            cardTitle="Memory Resources (GiB)"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Used', 'Requests', 'Limits'],
              metricIds: ['used', 'requests', 'limits']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                service: service.id
              },
              metrics: {
                used: {
                  metric: 'used',
                  granularity,
                  aggregation: 'MEAN'
                },
                requests: {
                  metric: 'requests',
                  granularity,
                  aggregation: 'MEAN'
                },
                limits: {
                  metric: 'limits',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
