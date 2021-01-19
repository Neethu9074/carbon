/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsBeanstalk/Info';
import List from 'in-sdk/components/sidebar/List';
import { emptyList } from 'in-services/fixedImmutables';

export default function AwsBeanstalkSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const instanceIds = data.get('instances.ids', emptyList);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>AWS Beanstalk Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Instances ({instanceIds.size})</Collapsible.Header>
        <Collapsible.Content>
          <List>
            {instanceIds.map((id, i) => (
              <List.Item key={i}>{id}</List.Item>
            ))}
          </List>
        </Collapsible.Content>
      </Collapsible>
      <TagList snapshot={snapshot} />
    </div>
  );
}
