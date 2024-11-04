/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import TabLabelWithCounter from 'in-nutanix/Dashboards/commonComponents/TabLabelWithCounter';
import getNutanixDatacenter from 'in-nutanix/subscriptions/getNutanixDatacenter';
import { datacenterDashboardFullyQualified } from 'in-nutanix/navigation/paths';
import NutanixHosts from 'in-nutanix/Dashboards/Datacenter/tabs/NutanixHosts';
import VirtualMachines from 'in-nutanix/commonComponents/VirtualMachines';
import Summary from 'in-nutanix/Dashboards/Datacenter/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-nutanix:dashboards.summary'),
    path: `${datacenterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-nutanix:dashboards.hosts'),
    path: `${datacenterDashboardFullyQualified}/nutanix-hosts`,
    component: NutanixHosts,
    header: props => getCounterComponent(props, 'hosts')
  },
  {
    label: t('in-nutanix:dashboards.virtualMachines'),
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
        getNutanixDatacenter({
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
