import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import Collapsible from 'in-components/Collapsible';

import PostgreSqlInfo from '../PostgreSqlInfo';


export default function PostgreSqlSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          PostgreSql
        </Collapsible.Header>
        <Collapsible.Content>
          <PostgreSqlInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

PostgreSqlSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
