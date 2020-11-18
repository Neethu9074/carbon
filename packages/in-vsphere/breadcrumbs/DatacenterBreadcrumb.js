import React from 'react';

import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

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
      <>
        {datacenter && (
          <Breadcrumb
            href$={getVsphereDatacenterDashboard(datacenter.id)}
            label="vSphere Datacenter"
            icon="lib_vsphere_datacenter"
          >
            {datacenter.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
