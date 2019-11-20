import React from 'react';

import {
  getVsphereDatacenterDashboard,
  getVsphereHostDashboard,
  getVsphereVmDashboard
} from 'in-vsphere/navigation/paths';
import getVsphereDatacenterByVm from 'in-vsphere/subscriptions/getVsphereDatacenterByVm';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import VsphereSnapshotLink from 'in-components/Link/SnapshotLink/VsphereSnapshotLink';
import getVsphereHostByVm from 'in-vsphere/subscriptions/getVsphereHostByVm';
import getVsphereVmByVmHost from 'in-vsphere/subscriptions/getVsphereVmByVmHost';
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
    if (!vm && !host && !host) {
      return null;
    }

    return (
      <Collapsible>
        <Collapsible.Header>Kubernetes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {vm && (
              <DescriptionItem title="VM">
                <VsphereSnapshotLink getKubernetesViewEntityDashboard={getVsphereVmDashboard} snapshotId={vm.id}>
                  {vm.name}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {host && (
              <DescriptionItem title="Host">
                <VsphereSnapshotLink getKubernetesViewEntityDashboard={getVsphereHostDashboard} snapshotId={host.id}>
                  {host.name}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {datacenter && (
              <DescriptionItem title="Datacenter">
                <VsphereSnapshotLink
                  getKubernetesViewEntityDashboard={getVsphereDatacenterDashboard}
                  snapshotId={datacenter.id}
                >
                  {datacenter.name}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
