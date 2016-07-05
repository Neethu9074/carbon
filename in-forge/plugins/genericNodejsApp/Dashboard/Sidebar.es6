import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-components/DeployedUnitList';
import TagListSnapshot from 'in-components/TagListSnapshot';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-components/Collapsible';

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

      <TagListSnapshot snapshot={snapshot} />
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

NodejsDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
