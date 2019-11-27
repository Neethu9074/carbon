import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';

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
      <Breadcrumb label="vSphere Host" icon="lib_linux">
        {host && host.label}
      </Breadcrumb>
    );
  }
);
