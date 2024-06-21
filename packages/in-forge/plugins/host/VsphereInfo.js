/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import getVsphereDatacenterByVm from 'in-vsphere/subscriptions/getVsphereDatacenterByVm';
import VsphereSnapshotLink from 'in-components/Link/SnapshotLink/VsphereSnapshotLink';
import getVsphereVmByVmHost from 'in-vsphere/subscriptions/getVsphereVmByVmHost';
import getVsphereHostByVm from 'in-vsphere/subscriptions/getVsphereHostByVm';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
  function NodeAndDatacenterInformation({ vm, host, datacenter }) {
    const datacenterId = datacenter?.id;
    const hostId = host?.id;

    const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter', { datacenterId, hostId });

    if (!vm || !host || !datacenter) {
      return null;
    }

    return (
      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.host.vSphere')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {vm && (
              <DescriptionItem title={t('in-forge:plugins.host.vm')}>
                <VsphereSnapshotLink vsphereEntityType={'vm'} snapshotId={vm.id} parameters={{ datacenterId, hostId }}>
                  {vm.label}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {host && (
              <DescriptionItem title={t('in-forge:plugins.host.esXiHost')}>
                <VsphereSnapshotLink vsphereEntityType={'host'} snapshotId={host.id} parameters={{ datacenterId }}>
                  {host.label}
                </VsphereSnapshotLink>
              </DescriptionItem>
            )}
            {datacenter && (
              <DescriptionItem title={t('in-forge:plugins.host.datacenter')}>
                <VsphereSnapshotLink
                  vsphereEntityType={'datacenter'}
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
