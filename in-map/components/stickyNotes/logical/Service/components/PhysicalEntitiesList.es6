import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import HealthIconListing from 'in-components/HealthIconListing';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import KPIList from 'in-components/KPIList';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import './PhysicalEntitiesList.less';


const block = 'in-sticky-note-process-cluster-entity-list';

export default connectTo(props => {
  return {
    entitySnapshots: combineLatest(props.ids.toArray().map(id => getSnapshot(id))),
    selectedId: selectedSnapshotId
  };
}, PhysicalEntitiesList);

function PhysicalEntitiesList({entitySnapshots, selectedId}) {
  if (!entitySnapshots) {
    return null;
  }
  entitySnapshots = entitySnapshots.slice().sort((a, b) => getPlural(getLabel(a)).localeCompare(getLabel(b)));

  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {entitySnapshots.map(snapshot => {
          const kpis = getKpis(snapshot);
          const snapshotId = snapshot.get('id');
          let className = block + '__item';
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
        })}
      </ul>
    </div>
  );
}

const rpt = React.PropTypes;
PhysicalEntitiesList.propTypes = {
  ids: irpt.set.isRequired,
  entitySnapshots: rpt.array
};
