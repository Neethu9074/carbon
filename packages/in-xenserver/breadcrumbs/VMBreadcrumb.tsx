/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
// @ts-expect-error needs migration
import connectTo from 'in-hoc/connectTo';
import getXenServerVM from 'in-xenserver/subscriptions/getXenServerVM';
import { useXenServerEntityLink } from 'in-xenserver/navigation/paths';
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
    vmData: getXenServerVM({
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
    const getXenServerVMDashboard = useXenServerEntityLink('vm', { hostId, vmId });
    if (!vmId) return null;
    return (
      <Breadcrumb href={getXenServerVMDashboard(vmId)} label={t('in-xenserver:vm')}>
        {vmData && vmData.name}
      </Breadcrumb>
    );
  }
);
