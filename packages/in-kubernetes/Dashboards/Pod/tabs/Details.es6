import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { podDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: pod }) => ({ annotations: getAnnotations(pod.id) }), function Details({
  data: pod,
  annotations,
  timeConfig
}) {
  const snapshotId = pod.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Phase" value={pod.phase} raw />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title="Restarts"
            snapshotId={snapshotId}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
          />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster ID" value={pod.clusterId} raw />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <KpiCard title="Host IP" value={pod.hostIp} raw />
        </Col>
        <Col lg={6}>
          <KpiCard title="Pod IP" value={pod.podIp} raw />
        </Col>
      </Row>
      <DetailsNavigation
        navigationItems={navigationItems}
        resource={pod}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems = [
  labelsNavigationItem(podDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${podDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${podDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);
