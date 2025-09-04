/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';
import { Spacer, Typography } from '@instana/components';

// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { getKeyValueObjectAsArray } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/Details';
import Etcd from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/Etcd';
import useUrlState from 'in-hooks/useUrlState';
import ApiServer from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/components/ApiServer';
import ControllerManager from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/components/ControllerManager';
import ControlPlaneTabs from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/components/ControlPlaneTabs';
import Scheduler from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/components/Scheduler';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';

import { t } from 'in-i18n';

const urlStateDefinition = [
  {
    name: 'controlplane.view',
    path: '/controlplane',
    initialState: 'apiServer',
    parser: buildJsonParser(),
    serializer: buildJsonSerializer(),
    as: 'view'
  }
];

export interface ControlPlaneProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function ControlPlane({ data: cluster, timeConfig }: ControlPlaneProps) {
  const { debuggingInfo } = cluster;
  const [urlState, setView] = useUrlState({ bind: urlStateDefinition, replaceHistory: false });
  const { view } = urlState;
  const clusterInfos = getKeyValueObjectAsArray(debuggingInfo);

  const renderTabs = useMemo(() => {
    switch (view) {
      case 'apiServer':
        return <ApiServer />;
      case 'scheduler':
        return <Scheduler />;
      case 'etcd':
        return <Etcd clusterId={cluster.id} timeConfig={timeConfig} />;
      case 'controllerManager':
        return <ControllerManager />;
      case 'details':
        return <Details clusterId={cluster.id} clusterInfos={clusterInfos} timeConfig={timeConfig} />;
      default:
        return null;
    }
  }, [view, cluster.id, clusterInfos, timeConfig]);

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={cluster.id} timeConfig={timeConfig} />
      <Spacer vertical="xsmall" />
      <Typography variant="heading-04">{t('in-kubernetes:controlPlane.title')}</Typography>
      <Typography variant="helper-text-02">{t('in-kubernetes:controlPlane.description')}</Typography>
      <Spacer vertical="large" />
      <ControlPlaneTabs view={view} setView={setView} />
      <Spacer vertical="large" />
      {renderTabs}
      <Spacer vertical="xxlarge" />
    </>
  );
}
