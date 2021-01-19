/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getVsphereDatacenterDashboard,
  getVsphereHostDashboard,
  getVsphereVmDashboard
} from 'in-vsphere/navigation/paths';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import getVsphereDatacenterByVm from 'in-vsphere/subscriptions/getVsphereDatacenterByVm';
import VsphereSnapshotLink from 'in-components/Link/SnapshotLink/VsphereSnapshotLink';
import getVsphereVmByVmHost from 'in-vsphere/subscriptions/getVsphereVmByVmHost';
import getVsphereHostByVm from 'in-vsphere/subscriptions/getVsphereHostByVm';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId }) => {
    const datacenter$ = timeConfig$.flatMap(timeConfig =>
      getVsphereDatacenterByVm({
        filter: {
          snapshotId: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    const host$ = timeConfig$.flatMap(timeConfig =>
      getVsphereHostByVm({
        filter: {
          snapshotId: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    const vm$ = timeConfig$.flatMap(timeConfig =>
      getVsphereVmByVmHost({
        filter: {
          snapshotId: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    return {
      datacenter: datacenter$,
      host: host$,
      vm: vm$
    };
  },
  function NodeAndClusterInformation({ vm, host, datacenter }) {
    if (!vm || !host || !datacenter) {
      return null;
    }
    const datacenterId = datacenter.id;
    const hostId = host.id;

    return (
      <Collapsible>
        <Collapsible.Header>vSphere</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {vm && (
              <DescriptionItem title="VM">
                <VsphereSnapshotLink
                  getVsphereViewEntityDashboard={getVsphereVmDashboard}
                  snapshotId={vm.id}
                  parameters={{ datacenterId, hostId }}
                >
                  {vm.label}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {host && (
              <DescriptionItem title="ESXi Host">
                <VsphereSnapshotLink
                  getVsphereViewEntityDashboard={getVsphereHostDashboard}
                  snapshotId={host.id}
                  parameters={{ datacenterId }}
                >
                  {host.label}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {datacenter && (
              <DescriptionItem title="Datacenter">
                <VsphereSnapshotLink
                  getVsphereViewEntityDashboard={getVsphereDatacenterDashboard}
                  snapshotId={datacenter.id}
                >
                  {datacenter.label}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
