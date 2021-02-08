/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import getKubernetesServiceItemCounters from 'in-subscription/kubernetes/getKubernetesServiceItemCounters';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { serviceDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import SelectorsList from 'in-kubernetes/Dashboards/commonComponents/SelectorsList';
import PortsList from 'in-kubernetes/Dashboards/commonComponents/PortsList';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import IPs from 'in-kubernetes/Dashboards/Service/tabs/IPs';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: service, timeConfig }) => ({
    annotations: getAnnotations(service.id),
    counters: getKubernetesServiceItemCounters({ serviceId: service.id, timeConfig })
  }),
  function Details({ data: service, annotations, timeConfig, clusterId, namespaceId, counters }) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={service}
        annotations={annotations}
        timeConfig={timeConfig}
        clusterId={clusterId}
        namespaceId={namespaceId}
        counters={counters}
      />
    );
  }
);

const navigationItems = [
  {
    path: `${serviceDashboardDetailsFullyQualified}`,
    icon: 'lib_kubernetes_selector',
    label: t('in-kubernetes:dashboards.selector'),
    component: SelectorsList
  },
  labelsNavigationItem(`${serviceDashboardDetailsFullyQualified}/labels`),
  annotationsNavigationItem(`${serviceDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${serviceDashboardDetailsFullyQualified}/spec`),
  {
    path: `${serviceDashboardDetailsFullyQualified}/ports`,
    icon: 'lib_kubernetes_port',
    renderLabel: ({ resource }) => `Ports (${resource.ports.length})`,
    component: PortsList
  },
  {
    path: `${serviceDashboardDetailsFullyQualified}/ips`,
    icon: 'lib_kubernetes_ip',
    label: t('in-kubernetes:dashboards.iPs'),
    component: IPs
  }
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
