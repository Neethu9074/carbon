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
import getXenServerHost from 'in-xenserver/subscriptions/getXenServerHost';
import { useXenServerEntityLink } from 'in-xenserver/navigation/paths';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export interface HostBreadcrumbProps {
  hostId: string | null | undefined;
  viewPath: string;
  timeConfig: TimeConfig;
  result?: Result<any>;
}
interface HostInfo {
  hostId: string;
  hostData: SnapshotData;
}
export default connectTo(
  (props: HostBreadcrumbProps) => ({
    hostData: getXenServerHost({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HostBreadcrumb({ hostId, hostData }: HostInfo) {
    const getXenServerHostDashboard = useXenServerEntityLink('host', { hostId });

    if (!hostId) return null;

    return (
      <Breadcrumb href={getXenServerHostDashboard(hostId)} label={t('in-xenserver:host')}>
        {hostData && hostData.name}
      </Breadcrumb>
    );
  }
);
