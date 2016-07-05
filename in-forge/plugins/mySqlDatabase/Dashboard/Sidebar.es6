import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import Collapsible from 'in-components/Collapsible';

import MySqlInfo from '../MySqlInfo';


export default function MySqlSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>MySql</Collapsible.Header>
        <Collapsible.Content>
          <MySqlInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

MySqlSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
