import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import ContainerList from 'in-forge/plugins/kubernetes/Sidebar/ContainerList';
import ConditionsList from 'in-forge/plugins/kubernetes/Sidebar/ConditionsList';

import Info from '../Info';

export default function KubernetesPodSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Pod</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />

      <ContainerList snapshot={snapshot} />

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>kubectl</Collapsible.Header>
        <Collapsible.Content>
          <code>
            kubectl get pod -n {data.get('namespace')} {data.get('name')}
          </code>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
