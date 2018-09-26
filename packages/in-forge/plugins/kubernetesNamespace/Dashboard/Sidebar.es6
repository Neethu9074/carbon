import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from '../Info';

export default function KubernetesNamespaceSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Namespace</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>kubectl</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="describe">
              <code>kubectl describe namespace {data.get('name')}</code>
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
