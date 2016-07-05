import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import Collapsible from 'in-components/Collapsible';

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
      <TagListSnapshot snapshot={snapshot} />
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

MariaDbSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
