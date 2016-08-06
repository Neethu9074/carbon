import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import List from 'in-sdk/components/sidebar/List';

import HttpdInfo from '../HttpdInfo';


export default function HttpdSidebar({snapshot}) {
  const modules = snapshot.getIn(['data', 'modules']).sort().toArray();
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Apache Httpd</Collapsible.Header>
        <Collapsible.Content>
          <HttpdInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {modules.length > 0 ?
        <div>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Modules</Collapsible.Header>
            <Collapsible.Content>
              <List>
                {modules.map(module =>
                  <List.Item key={module}>{module}</List.Item>
                )}
              </List>
            </Collapsible.Content>
          </Collapsible>
        </div>
      : null}
    </div>
  );
}
