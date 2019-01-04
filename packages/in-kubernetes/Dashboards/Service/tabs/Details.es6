import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { serviceDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import SelectorsList from 'in-kubernetes/Dashboards/commonComponents/SelectorsList';
import PortsList from 'in-kubernetes/Dashboards/commonComponents/PortsList';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: service }) => ({ annotations: getAnnotations(service.id) }), function Details({
  data: service,
  annotations,
  timeConfig
}) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.location} raw />
        </Col>
        <Col lg={4}>
          <KpiCard title="Age" value={formatDuration(service.age)} raw />
        </Col>
      </Row>
      <DetailsNavigation
        navigationItems={navigationItems}
        resource={service}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems = [
  {
    path: `${serviceDashboardDetailsFullyQualified}`,
    label: 'Selector',
    component: ({ resource }) => <SelectorsList selectors={resource.selectors} defaultOperator="=" />
  },
  labelsNavigationItem(`${serviceDashboardDetailsFullyQualified}/labels`),
  annotationsNavigationItem(`${serviceDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${serviceDashboardDetailsFullyQualified}/spec`),
  {
    path: `${serviceDashboardDetailsFullyQualified}/ports`,
    icon: 'lib_kubernetes_port',
    renderLabel: ({ resource }) => `Ports (${resource.ports.length})`,
    component: ({ resource }) => <PortsList ports={resource.ports} />
  },
  {
    path: `${serviceDashboardDetailsFullyQualified}/endpoints`,
    icon: 'lib_kubernetes_endpoint',
    label: 'Endpoints',
    component: ({ resource, timeConfig }) => <Endpoints timeConfig={timeConfig} data={resource} />
  }
].filter(Boolean);
