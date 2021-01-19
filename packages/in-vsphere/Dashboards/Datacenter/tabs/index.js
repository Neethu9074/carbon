/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TabLabelWithCounter from 'in-vsphere/Dashboards/commonComponents/TabLabelWithCounter';
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
    label: 'ESXi Hosts',
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
