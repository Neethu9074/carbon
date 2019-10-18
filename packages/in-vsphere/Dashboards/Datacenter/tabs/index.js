import React from 'react';

import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import VirtualMachines from 'in-vsphere/Dashboards/Datacenter/tabs/VirtualMachines';
import TabLabelWithCounter from 'in-vsphere/commonComponents/TabLabelWithCounter';
import { datacenterDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import VSphereHosts from 'in-vsphere/Dashboards/Datacenter/tabs/VsphereHosts';
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
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
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
