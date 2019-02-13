// @flow
import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import type { NavigationTree, Page } from 'in-new-components/layout/SideNavigationAndContent';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { namespaceDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: namespace }) => ({ annotations: getAnnotations(namespace.id) }), function Details({
  data: namespace,
  annotations,
  timeConfig
}) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <KpiCard title="Status" value={namespace.status} raw />
        </Col>
        <Col lg={6}>
          <DateTimeKpiCard title="Creation Time" time={namespace.created} raw />
        </Col>
      </Row>
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={namespace}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems: [Page] = [
  labelsNavigationItem(namespaceDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${namespaceDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${namespaceDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree: NavigationTree = singletonNavigationTree(navigationItems);
