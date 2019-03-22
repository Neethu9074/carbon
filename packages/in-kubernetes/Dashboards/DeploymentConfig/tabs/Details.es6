import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import { deploymentConfigDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: deploymentConfig }) => ({ annotations: getAnnotations(deploymentConfig.id) }),
  function Details({ data: deploymentConfig, annotations, timeConfig }) {
    const snapshotId = deploymentConfig.id;

    return (
      <Fragment>
        <Row>
          <Col lg={4}>
            <KpiCard title="Namespace" value={deploymentConfig.namespace} raw />
          </Col>
          <Col lg={4}>
            <KpiCard title="Cluster" value={deploymentConfig.clusterId} raw />
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
          resource={deploymentConfig}
          annotations={annotations}
          timeConfig={timeConfig}
        />
      </Fragment>
    );
  }
);

const navigationItems = [
  labelsNavigationItem(deploymentConfigDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${deploymentConfigDashboardDetailsFullyQualified}/annotations`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
