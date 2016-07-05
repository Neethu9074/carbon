import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';

import MongoDBInfo from '../MongoDBInfo';


export default function MongoDBSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>MongoDB</Collapsible.Header>
        <Collapsible.Content>
          <MongoDBInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

MongoDBSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
