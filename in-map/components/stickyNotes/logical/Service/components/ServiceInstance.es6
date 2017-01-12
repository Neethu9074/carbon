import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import HealthIconListing from 'in-components/HealthIconListing';
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

      <EntityInformation snapshotId={snapshot.get('id')}
                         label=''
                         kind='light'
                         useSnapshotLink />

      <div className={block + '__kpis'}>
        <KPIList classname={block + '__kpi-list'}
                 snapshot={snapshot}
                 metrics={kpis.map(kpi => kpi.metric)}
                 labels={kpis.map(kpi => kpi.label)}
                 formatters={kpis.map(kpi => kpi.valueOnlyFormatter)}
                 timeWindowAggregations={kpis.map(kpi => kpi.timeWindowAggregation)} />

        <HealthIconListing className={block + '__health-icon'}
                           snapshotId={snapshotId} />
      </div>
    </li>
  );
});
