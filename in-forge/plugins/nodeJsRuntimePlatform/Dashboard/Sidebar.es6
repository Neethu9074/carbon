import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import NodeJsInfo from '../NodeJsInfo';


export default function NodejsDashboardSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Node.js Runtime</Collapsible.Header>
        <Collapsible.Content>
          <NodeJsInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header='Runtime Versions'
                     data={snapshot.getIn(['data', 'versions'])} />

      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

NodejsDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
