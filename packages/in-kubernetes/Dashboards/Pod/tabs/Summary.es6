import React, { Fragment } from 'react';
import { get } from 'lodash';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import calculateReadyContainers from 'in-kubernetes/Dashboards/commonComponents/calculateReadyContainers';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/ContainerStates';
import PodPhase from 'in-kubernetes/Dashboards/commonComponents/PodPhase';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import MetricValue from 'in-components/MetricValue';
import Card from 'in-new-components/Card';

export default function Summary({ data: pod }) {
  const snapshotId = pod.id;

  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <Card title="Summary" useMaxAvailableHeight>
            <Dl>
              <Di title="Status Summary">{get(pod, ['status', 'statusSummary'], '-')}</Di>
              <Di title="Phase">
                <PodPhase status={get(pod, ['status', 'phase'], pod.phase)} />
              </Di>
              <Di title="Ready">{calculateReadyContainers(pod)}</Di>
              <Di title="Restarts">
                <MetricValue
                  snapshotId={pod.id}
                  metric="restartCount"
                  formatter={zeroDecimalPlaces}
                  timeWindowAggregation="sum"
                />
              </Di>
              <Di title="Age">{pod.age ? formatDuration(pod.age) : '-'}</Di>
            </Dl>
          </Card>
        </Col>

        <Col lg={3}>
          <Card title="Message" useMaxAvailableHeight>
            {get(pod, ['status', 'message'])}
          </Card>
        </Col>

        <Col lg={3}>
          <Card title="IPs" useMaxAvailableHeight>
            <Dl>
              <Di title="Host IP">{pod.hostIp}</Di>
              <Di title="Pod IP">{pod.podIp}</Di>
            </Dl>
          </Card>
        </Col>

        <Col lg={3}>
          <Card title="Requests & Limits" useMaxAvailableHeight>
            <Dl>
              <Di title="CPU Requests">
                <MetricValue
                  snapshotId={snapshotId}
                  metric="cpuRequests"
                  formatter={twoDecimalPlaces}
                  timeWindowAggregation="mean"
                />
              </Di>
              <Di title="CPU Limits">
                <MetricValue
                  snapshotId={snapshotId}
                  metric="cpuLimits"
                  formatter={twoDecimalPlaces}
                  timeWindowAggregation="mean"
                />
              </Di>
              <Di title="Memory Requests">
                <MetricValue
                  snapshotId={snapshotId}
                  metric="memoryRequests"
                  formatter={bytesTwoDecimalPlaces}
                  timeWindowAggregation="mean"
                />
              </Di>
              <Di title="Memory Limits">
                <MetricValue
                  snapshotId={snapshotId}
                  metric="memoryLimits"
                  formatter={bytesTwoDecimalPlaces}
                  timeWindowAggregation="mean"
                />
              </Di>
            </Dl>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card title="Conditions" useMaxAvailableHeight>
            <Dl>
              <Di title="PodScheduled">-</Di>
              <Di title="Ready">-</Di>
              <Di title="Initialized">-</Di>
              <Di title="Unschedulable">-</Di>
              <Di title="ContainersReady">-</Di>
            </Dl>
          </Card>
        </Col>

        <Col lg={9}>
          <Card title="Container States" useMaxAvailableHeight>
            <ContainerStates states={get(pod, ['status', 'containerStatuses'])} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
