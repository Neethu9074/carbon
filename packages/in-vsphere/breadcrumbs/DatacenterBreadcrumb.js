import React from 'react';

import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    datacenter: getVsphereDatacenter({
      filter: {
        datacenterId: props.datacenterId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function DatacenterBreadcrumb({ datacenter }) {
    return (
      <Breadcrumb label="vSphere Datacenter" icon="lib_kubernetes_cluster">
        {datacenter && datacenter.label}
      </Breadcrumb>
    );
  }
);
