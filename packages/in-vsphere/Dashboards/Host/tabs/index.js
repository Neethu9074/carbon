import React from 'react';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import getVsphereVms from 'in-vsphere/subscriptions/getVsphereVms';
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
        getVsphereVms({
          filter: {
            hostId: props.hostId,
            timeConfig: props.timeConfig
          }
        })
      }
      resultPropName={resultPropName}
    />
  );
}
