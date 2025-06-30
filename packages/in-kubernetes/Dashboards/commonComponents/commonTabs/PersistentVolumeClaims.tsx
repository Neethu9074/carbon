/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesQueryFilter } from '@instana/types';

//@ts-expect-error TS migration
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import PersistentVolumeClaimsTable from 'in-kubernetes/Dashboards/commonComponents/PersistentVolumeClaimsTable';

export default function PersistentVolumeClaims(props: Readonly<KubernetesQueryFilter>) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="persistentvolumeclaims" />
      <PersistentVolumeClaimsTable {...props} />
    </>
  );
}
