import React from 'react';

import ConditionsList from 'in-forge/plugins/kubernetesCluster/Sidebar/ConditionsList';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function KubernetesPodSidebar({ snapshot, linkToDashboards = true }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Pod</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} linkToDashboards={linkToDashboards} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>kubectl</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="describe">
              <code>
                kubectl describe pod -n {data.get('namespace')} {data.get('name')}
              </code>
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
