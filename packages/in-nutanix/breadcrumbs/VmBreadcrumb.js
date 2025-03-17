/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import getNutanixVm from 'in-nutanix/subscriptions/getNutanixVm';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    virtualMachine: getNutanixVm({
      filter: {
        vmId: props.vmId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function VmBreadcrumb(props) {
    const { virtualMachine, datacenterId, hostId, vmId } = props;
    const getNutanixHostDashboard = useNutanixEntityLink('vm', { datacenterId, hostId });

    return (
      <Breadcrumb href={getNutanixHostDashboard(vmId)} label={t('in-nutanix:breadcrumbs.nutanixVm')}>
        {virtualMachine && virtualMachine.label}
      </Breadcrumb>
    );
  }
);
