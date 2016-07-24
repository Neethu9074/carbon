import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import TagList from 'in-sdk/components/sidebar/TagList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import MariaDbInfo from '../MariaDbInfo';


export default function MariaDbSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>MariaDB</Collapsible.Header>
        <Collapsible.Content>
          <MariaDbInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <TagList snapshot={snapshot} />
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

MariaDbSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
