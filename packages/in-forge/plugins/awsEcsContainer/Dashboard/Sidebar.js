import React from 'react';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsEcsContainer/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsEcsContainerSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>AWS ECS Container Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      {/* Node.js specific */}
      <KeyValueOverlay header="Runtime Versions" data={snapshot.getIn(['data', 'versions'])} />
      <KeyValueOverlay header="Dependencies" data={snapshot.getIn(['data', 'dependencies'])} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
