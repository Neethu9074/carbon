import React from 'react';

import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import HealthIconListing from 'in-components/HealthIconListing';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import KPIList from 'in-components/KPIList';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import './ServiceInstance.less';


const block = 'in-sticky-note-service-instance';

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId),
    selectedId: selectedSnapshotId
  };
}, function ServiceInstance({snapshot, selectedId}) {
  if (!snapshot) {
    return null;
  }

  const snapshotId = snapshot.get('id');
  const kpis = getKpis(snapshot);
  let className = block;
  if (snapshotId === selectedId) {
    className += ' ' + className + '--selected';
  }
  return (
    <li key={snapshotId}
        className={className}
        onClick={() => setSelectedSnapshotId(snapshotId)}>

      <div className={block + '__entity-information'}>
        <img src={getIcon(snapshot)}
             alt='plugin icon'
             className={block + '__plugin-icon'} />

        {getLabel(snapshot)}
      </div>

      <div className={block + '__kpis'}>
      <KPIList snapshot={snapshot}
               metrics={kpis.map(kpi => kpi.metric)}
               labels={kpis.map(kpi => kpi.label)}
               formatters={kpis.map(kpi => kpi.valueOnlyFormatter)} />

      <HealthIconListing className={block + '__health-icon'}
                         snapshotId={snapshotId} />

      </div>
    </li>
  );
});
