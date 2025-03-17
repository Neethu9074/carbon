/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    virtualMachine: getVsphereVm({
      filter: {
        vmId: props.vmId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function VmBreadcrumb(props) {
    const { virtualMachine, datacenterId, hostId, vmId } = props;
    const getVsphereHostDashboard = useVspehereEntityLink('vm', { datacenterId, hostId });

    return (
      <Breadcrumb
        href={getVsphereHostDashboard(vmId)}
        label={t('in-vsphere:breadcrumbs.vSphereVm')}
        icon="lib_vsphere_vm"
      >
        {virtualMachine && virtualMachine.label}
      </Breadcrumb>
    );
  }
);
