/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-infrastructure/Dashboard/components/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/containerd/Info';

export default function ContainerdSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'labels']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Containerd Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay header={t('in-forge:plugins.containerd.dashboard.headerContainerLabels')} data={labels} />

      <KubernetesInfo snapshot={snapshot} labels={snapshot.getIn(['data', 'labels'])} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
