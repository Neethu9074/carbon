/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ConditionsList from 'in-forge/plugins/kubernetesCluster/Sidebar/ConditionsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function KubernetesNodeSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Node</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />
    </div>
  );
}
