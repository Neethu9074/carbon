/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import TabLabelWithCounter from 'in-nutanix/Dashboards/commonComponents/TabLabelWithCounter';
import { hostDashboardFullyQualified } from 'in-nutanix/navigation/paths';
import VirtualMachines from 'in-nutanix/commonComponents/VirtualMachines';
import getNutanixVms from 'in-nutanix/subscriptions/getNutanixVms';
import Summary from 'in-nutanix/Dashboards/Host/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-nutanix:dashboards.summary'),
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-nutanix:dashboards.virtualMachines'),
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
        getNutanixVms({
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
