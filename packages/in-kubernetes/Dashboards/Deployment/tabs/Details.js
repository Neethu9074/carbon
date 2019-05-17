import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { deploymentDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: deployment }) => ({ annotations: getAnnotations(deployment.id) }), function Details({
  data: deployment,
  annotations,
  timeConfig
}) {
  const snapshotId = deployment.id;

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Namespace" value={deployment.namespace} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={deployment.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard
            title="Replicas"
            renderValue={() => (
              <MetricBasedTwoValueBar
                snapshotId={snapshotId}
                metrics={['availableReplicas', 'desiredReplicas']}
                labels={['Available', 'Desired']}
                timeWindowAggregation={null}
              />
            )}
          />
        </Col>
      </Row>
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={deployment}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems = [
  labelsNavigationItem(deploymentDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${deploymentDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${deploymentDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
