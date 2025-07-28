/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';

import getLinuxKVMHypervisorVM from 'in-linux-kvm-hypervisor/subscriptions/getLinuxKVMHypervisorVM';
// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { useLinuxKVMHypervisorEntityLink } from 'in-linux-kvm-hypervisor/navigation/paths';
// @ts-expect-error needs migration
import connectTo from 'in-hoc/connectTo';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export interface VMBreadcrumbProps {
  hostId: string | null | undefined;
  vmId: string | null | undefined;
  viewPath: string;
  timeConfig: TimeConfig;
  result?: Result<any>;
}
interface VMInfo {
  hostId: string;
  vmId: string;
  vmData: SnapshotData;
}
export default connectTo(
  (props: VMBreadcrumbProps) => ({
    vmData: getLinuxKVMHypervisorVM({
      filter: {
        hostId: props.hostId,
        vmId: props.vmId,
        timeConfig: props.timeConfig
      },
      pagination: {
        page: 1,
        pageSize: 20
      },
      order: {
        by: 'name',
        direction: 'ASC'
      }
    }).map(result => result.data)
  }),
  function VMBreadcrumb({ hostId, vmId, vmData }: VMInfo) {
    const getLinuxKVMHypervisorVMDashboard = useLinuxKVMHypervisorEntityLink('vm', { hostId, vmId });
    if (!vmId) return null;
    return (
      <Breadcrumb href={getLinuxKVMHypervisorVMDashboard(vmId)} label={t('in-linux-kvm-hypervisor:vm')}>
        {vmData && vmData.name}
      </Breadcrumb>
    );
  }
);
