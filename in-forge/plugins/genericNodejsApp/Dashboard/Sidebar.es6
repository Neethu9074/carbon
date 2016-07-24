import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import TagList from 'in-sdk/components/sidebar/TagList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import NodeJsAppInfo from '../NodeJsAppInfo';


export default function NodejsDashboardSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Node.js Application</Collapsible.Header>
        <Collapsible.Content>
          <NodeJsAppInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header='Dependencies'
                     data={snapshot.getIn(['data', 'dependencies'])} />

      <TagList snapshot={snapshot} />
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

NodejsDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
