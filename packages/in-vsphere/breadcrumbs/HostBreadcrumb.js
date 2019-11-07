import React from 'react';

import getVsphereHost from 'in-vsphere/subscriptions/getVsphereDatacenter';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    datacenter: getVsphereHost({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HostBreadcrumb({ host }) {
    return (
      <Breadcrumb label="vSphere Host" icon="lib_vsphere_cluster">
        {host && host.label}
      </Breadcrumb>
    );
  }
);
