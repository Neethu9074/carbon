/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getWindowsHypervisorVM from 'in-windowshypervisor/subscriptions/getWindowsHypervisorVM';
import { useWindowsHypervisorEntityLink } from 'in-windowshypervisor/navigation/paths';
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
    vmData: getWindowsHypervisorVM({
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
    const getWindowsHypervisorVMDashboard = useWindowsHypervisorEntityLink('vm', { hostId, vmId });
    if (!vmId) return null;
    return (
      <Breadcrumb href={getWindowsHypervisorVMDashboard(vmId)} label={t('in-windowshypervisor:vm')}>
        {vmData?.name}
      </Breadcrumb>
    );
  }
);
