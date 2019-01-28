import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import getKubernetesServiceItemCounters from 'in-subscription/kubernetes/getKubernetesServiceItemCounters';
import { serviceDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import SelectorsList from 'in-kubernetes/Dashboards/commonComponents/SelectorsList';
import PortsList from 'in-kubernetes/Dashboards/commonComponents/PortsList';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: service, timeConfig }) => ({
    annotations: getAnnotations(service.id),
    counters: getKubernetesServiceItemCounters({ serviceId: service.id, timeConfig })
  }),
  function Details({ data: service, annotations, timeConfig, clusterId, namespaceId, counters }) {
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
          clusterId={clusterId}
          namespaceId={namespaceId}
          counters={counters}
        />
      </Fragment>
    );
  }
);

const navigationItems = [
  {
    path: `${serviceDashboardDetailsFullyQualified}`,
    icon: 'lib_kubernetes_selector',
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
    renderLabel: ({ counters }) => `Endpoints ${counters.data && `(${counters.data.endpoints}`})`,
    component: ({ resource, ...props }) => <Endpoints data={resource} {...props} />
  }
].filter(Boolean);
