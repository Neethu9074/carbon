/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ConditionsList from 'in-forge/plugins/kubernetesCluster/Sidebar/ConditionsList';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function KubernetesPodSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Pod</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />

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
