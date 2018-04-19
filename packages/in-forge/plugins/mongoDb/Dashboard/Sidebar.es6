import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';

import Info from '../Info';

export default function MongoDBSidebar({ snapshot }) {
  const databases = snapshot
    .getIn(['data', 'databases'], emptyList)
    .toArray()
    .sort();

  const replicaSet = snapshot
    .getIn(['data', 'repl.membersList'], emptyList)
    .toArray()
    .sort();

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>MongoDB</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Databases</Collapsible.Header>
        <Collapsible.Content>
          <List>{databases.map(database => <List.Item key={database}>{database}</List.Item>)}</List>
        </Collapsible.Content>
      </Collapsible>

      {replicaSet.length > 0 ? (
        <div>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Replica Set</Collapsible.Header>
            <Collapsible.Content>
              <List>
                {replicaSet.map(rsmember => (
                  <List.Item key={rsmember.get('id')}>
                    {'[ ' + rsmember.get('id') + ':' + rsmember.get('state') + ' ]' + ' - ' + rsmember.get('name')}
                  </List.Item>
                ))}
              </List>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
