import React from 'react';

import ConditionsList from 'in-forge/plugins/kubernetesCluster/Sidebar/ConditionsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from '../Info';

export default function KubernetesNodeSidebar({ snapshot, linkToDashboards = true }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Node</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} linkToDashboards={linkToDashboards} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />
    </div>
  );
}
