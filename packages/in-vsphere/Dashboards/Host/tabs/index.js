import React from 'react';

import TabLabelWithCounter from 'in-vsphere/Dashboards/commonComponents/TabLabelWithCounter';
import { hostDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import VirtualMachines from 'in-vsphere/commonComponents/VirtualMachines';
import getVsphereVms from 'in-vsphere/subscriptions/getVsphereVms';
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
    header: props => getCounterComponent(props, 'totalHits')
  }
];

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() =>
        getVsphereVms({
          filter: {
            hostId: props.hostId,
            timeConfig: props.timeConfig
          },
          pagination: {
            page: 1,
            pageSize: 200
          },
          order: {
            by: 'label',
            direction: 'ASC'
          }
        })
      }
      resultPropName={resultPropName}
    />
  );
}
