import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import PhpFpmInfo from '../PhpFpmInfo';


export default function PhpFpmDashboardSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          PHP-FPM Runtime
        </Collapsible.Header>
        <Collapsible.Content>
          <PhpFpmInfo snapshot={snapshot}/>
        </Collapsible.Content>
      </Collapsible>

      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

PhpFpmDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
