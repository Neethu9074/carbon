import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PhpSnapshot from 'in-forge/plugins/phpRuntimePlatform/PhpSnapshot.es6';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function HttpdSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Apache Httpd</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header="Modules" data={snapshot.getIn(['data', 'modules'])} />
      <PhpSnapshot snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
