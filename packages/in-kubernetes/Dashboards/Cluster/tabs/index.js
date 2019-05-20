import React from 'react';

import getKubernetesClusterItemCounters from 'in-subscription/kubernetes/getKubernetesClusterItemCounters';
import DeploymentConfigs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/DeploymentConfigs';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import { PodsWithNamespaces } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Infrastructure from 'in-kubernetes/Dashboards/Cluster/tabs/Infrastructure';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${clusterDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${clusterDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: 'Nodes',
    path: `${clusterDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, 'nodes')
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces,
    header: props => getCounterComponent(props, 'namespaces')
  },
  {
    label: 'Deployments',
    path: `${clusterDashboardFullyQualified}/deployments`,
    component: Deployments,
    header: props => getCounterComponent(props, 'deployments')
  },
  {
    label: 'Deployment Configs',
    path: `${clusterDashboardFullyQualified}/deploymentconfigs`,
    component: DeploymentConfigs,
    header: props => getCounterComponent(props, 'deploymentConfigs')
  },
  {
    label: 'K8s Services',
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
  },
  {
    label: 'Pods',
    path: `${clusterDashboardFullyQualified}/pods`,
    component: PodsWithNamespaces,
    header: props => getCounterComponent(props, 'pods')
  },
  {
    label: 'Infrastructure',
    path: `${clusterDashboardFullyQualified}/hosts`,
    component: Infrastructure,
    header: props => getCounterComponent(props, 'hosts')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() => getKubernetesClusterItemCounters({ clusterId: props.clusterId, timeConfig: props.timeConfig })}
      resultPropName={resultPropName}
    />
  );
}
