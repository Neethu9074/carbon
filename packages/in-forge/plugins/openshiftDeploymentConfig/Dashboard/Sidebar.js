/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import ConditionsList from '../Sidebar/ConditionsList';
import Info from '../Info';

export default function OpenshiftDeploymentConfigSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Openshift DeploymentConfig</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>oc</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="describe">
              <code>
                oc describe deploymentconfig -n {data.get('namespace')} {data.get('name')}
              </code>
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
