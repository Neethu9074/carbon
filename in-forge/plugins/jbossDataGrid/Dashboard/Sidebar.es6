import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';

import JbossDataGridCaches from '../JbossDataGridCaches.es6';
import JbossDataGridPorts from '../JbossDataGridPorts.es6';
import Info from '../Info.es6';
import JbossDataGridClusters from '../JbossDataGridClusters.es6';


export default function JbossDataGridSidebar({snapshot}) {
  return (
    <div>
      <Info snapshot={snapshot}/>
      <JbossDataGridPorts snapshot={snapshot}/>
      <JbossDataGridCaches snapshot={snapshot}/>
      <JbossDataGridClusters snapshot={snapshot}/>
      <RunningComponentsList snapshotId={snapshot.get('id')}/>
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
