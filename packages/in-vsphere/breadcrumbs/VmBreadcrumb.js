import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    datacenter: getVsphereVm({
      filter: {
        hostId: props.vmId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function VmBreadcrumb({ vm }) {
    return (
      <Breadcrumb label="vSphere VM" icon="lib_vsphere_vm">
        {vm && vm.label}
      </Breadcrumb>
    );
  }
);
