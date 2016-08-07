import React from 'react';

import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

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
