import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';

import JbossDataGridCaches from '../JbossDataGridCaches.es6';
import JbossDataGridInfo from '../JbossDataGridInfo.es6';
import JbossDataGridPorts from '../JbossDataGridPorts.es6';


export default function JbossDataGridSidebar({snapshot}) {
  return (
    <div>
      <JbossDataGridInfo snapshot={snapshot}/>
      <JbossDataGridPorts snapshot={snapshot}/>
      <JbossDataGridCaches snapshot={snapshot}/>
      <RunningComponentsList snapshotId={snapshot.get('id')}/>
    </div>
  );
}

JbossDataGridSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
