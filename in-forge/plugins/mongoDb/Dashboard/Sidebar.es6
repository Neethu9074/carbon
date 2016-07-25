import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {emptyList} from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';

import MongoDBInfo from '../MongoDBInfo';


export default function MongoDBSidebar({snapshot}) {
  const databases = snapshot.getIn(['data', 'databases'], emptyList).toArray().sort();

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>MongoDB</Collapsible.Header>
        <Collapsible.Content>
          <MongoDBInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Databases</Collapsible.Header>
        <Collapsible.Content>
          <List>
            {databases.map(database =>
              <List.Item key={database}>{database}</List.Item>
            )}
          </List>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

MongoDBSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
