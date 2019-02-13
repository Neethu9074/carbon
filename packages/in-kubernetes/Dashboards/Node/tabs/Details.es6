// @flow
import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import type { NavigationTree, Page } from 'in-new-components/layout/SideNavigationAndContent';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { nodeDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: node }) => ({ annotations: getAnnotations(node.id) }), function Details({
  data: node,
  annotations,
  timeConfig
}) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Machine ID" value={node.machineId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Cluster" value={node.clusterId} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Hostname" value={node.hostname} raw />
        </Col>
      </Row>
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={node}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems: [Page] = [
  labelsNavigationItem(nodeDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${nodeDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${nodeDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree: NavigationTree = singletonNavigationTree(navigationItems);
