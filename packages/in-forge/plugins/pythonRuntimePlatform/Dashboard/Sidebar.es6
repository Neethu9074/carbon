import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function PythonDashboardSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Python</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header="Loaded Modules" data={snapshot.getIn(['data', 'snapshot.versions'])} />
      <KeyValuePopup header="Django Middleware" data={snapshot.getIn(['data', 'snapshot.djmw'])} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
