import React, { Fragment } from 'react';
import { get } from 'lodash';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ExpandingConditionsCard from 'in-kubernetes/Dashboards/commonComponents/ExpandingConditionsCard';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/ContainerStates';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import MetricValue from 'in-components/MetricValue';
import Card from 'in-new-components/Card';

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <Card title="Status" useMaxAvailableHeight>
            <Dl>
              <Di title="Status Summary">
                <Capitalize>{get(pod, ['status', 'statusSummary'], '-')}</Capitalize>
              </Di>
              <Di title="Phase">
                <Capitalize>{get(pod, ['status', 'phase'], pod.phase)}</Capitalize>
              </Di>
              <Di title="Ready">{`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}</Di>
              <Di title="Restarts">
                <MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />
              </Di>
              <Di title="Age">{pod.age ? formatDuration(pod.age) : '-'}</Di>
              <Di title="Message">
                <PodMessage message={get(pod, ['status', 'message'])} />
              </Di>
            </Dl>
          </Card>
        </Col>

        <Col lg={4}>
          <Card title="IPs" useMaxAvailableHeight>
            <Dl>
              <Di title="Host IP">{pod.hostIp}</Di>
              <Di title="Pod IP">{pod.podIp}</Di>
            </Dl>
          </Card>
        </Col>

        <Col lg={4}>
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
        <Col lg={12}>
          <Card title="Container States" useMaxAvailableHeight>
            <ContainerStates
              podId={snapshotId}
              states={get(pod, ['status', 'containerStatuses'])}
              timeConfig={timeConfig}
            />
          </Card>
        </Col>
      </Row>

      <ExpandingConditionsCard
        conditions={[
          { type: 'PodScheduled', status: 'false' },
          { type: 'Ready', status: 'true' },
          { type: 'Initialized', status: 'false' },
          { type: 'Unschedulable', status: 'false' },
          { type: 'ContainersReady', status: 'false' }
        ]}
        viewAllHref$={getPodDashboard(snapshotId, { tab: '/conditions' })}
      />
    </Fragment>
  );
}
