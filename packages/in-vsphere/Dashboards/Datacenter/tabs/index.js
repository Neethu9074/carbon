import React from 'react';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { datacenterDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import VSphereHosts from 'in-vsphere/Dashboards/Datacenter/tabs/VsphereHosts';
import VirtualMachines from 'in-vsphere/commonComponents/VirtualMachines';
import Summary from 'in-vsphere/Dashboards/Datacenter/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${datacenterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'vSphere hosts',
    path: `${datacenterDashboardFullyQualified}/vsphere-hosts`,
    component: VSphereHosts,
    header: props => getCounterComponent(props, 'hosts')
  },
  {
    label: 'Virtual Machines',
    path: `${datacenterDashboardFullyQualified}/vms`,
    component: VirtualMachines,
    header: props => getCounterComponent(props, 'vms')
  }
];

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounterPresenter
      label={props.tab.label}
      getCounters={() =>
        getVsphereDatacenter({
          filter: {
            datacenterId: props.datacenterId,
            timeConfig: props.timeConfig
          }
        })
      }
      resultPropName={resultPropName}
    />
  );
}
