import React from 'react';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { hostDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import VirtualMachines from 'in-vsphere/commonComponents/VirtualMachines';
import Summary from 'in-vsphere/Dashboards/Host/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Virtual Machines',
    path: `${hostDashboardFullyQualified}/vms`,
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
