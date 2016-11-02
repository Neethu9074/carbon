import React from 'react';

import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/rubyRuntimePlatform/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';

export default function RubyDashboardSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Ruby</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <KeyValuePopup header='Dependencies'
                     data={snapshot.getIn(['data', 'dependencies'])} />

      <KeyValuePopup header='Runtime Versions'
                     data={snapshot.getIn(['data', 'versions'])} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
