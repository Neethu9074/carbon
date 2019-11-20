import React from 'react';

import {
  getVsphereDatacenterDashboard,
  getVsphereHostDashboard,
  getVsphereVmDashboard
} from 'in-vsphere/navigation/paths';
import getVsphereDatacenterByVmUuid from 'in-vsphere/subscriptions/getVsphereDatacenterByVmUuid';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import VsphereSnapshotLink from 'in-components/Link/SnapshotLink/VsphereSnapshotLink';
import getVsphereHostByVmUuid from 'in-vsphere/subscriptions/getVsphereHostByVmUuid';
import getVsphereVmByUuid from 'in-vsphere/subscriptions/getVsphereVmByUuid';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId }) => {
    const datacenter$ = timeConfig$.flatMap(timeConfig =>
      getVsphereDatacenterByVmUuid({
        filter: {
          vmUuid: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    const host$ = timeConfig$.flatMap(timeConfig =>
      getVsphereHostByVmUuid({
        filter: {
          vmUuid: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    const vm$ = timeConfig$.flatMap(timeConfig =>
      getVsphereVmByUuid({
        filter: {
          vmUuid: snapshotId,
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
