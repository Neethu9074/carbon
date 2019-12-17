import React from 'react';

import { getVsphereHostDashboard } from 'in-vsphere/navigation/paths';
import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    host: getVsphereHost({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HostBreadcrumb({ host }) {
    return (
      <>
        {host && (
          <Breadcrumb
            href$={getVsphereHostDashboard(host.id, { datacenterId: host.datacenterId })}
            label="vSphere Host"
            icon="lib_linux"
          >
            {host.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
