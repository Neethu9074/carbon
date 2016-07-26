import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';

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

      <Separator />

      <KeyValuePopup header='Runtime Versions'
                     data={snapshot.getIn(['data', 'versions'])} />

      <Separator />

      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

NodejsDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
