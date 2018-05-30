import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import List from 'in-sdk/components/sidebar/List';

import Info from '../Info';

export default function PythonDashboardSidebar({ snapshot }) {
  const djangoMiddleware = snapshot.getIn(['data', 'snapshot.djmw']);

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

      <ServiceInstancesList snapshot={snapshot} />

      {djangoMiddleware ? (
        <div>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Django Middleware</Collapsible.Header>
            <Collapsible.Content>
              <List>{djangoMiddleware.map(mw => <List.Item>{mw}</List.Item>)}</List>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ) : null}
    </div>
  );
}
