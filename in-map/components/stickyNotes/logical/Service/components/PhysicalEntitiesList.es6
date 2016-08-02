import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import KPIList from 'in-components/KPIList';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import './PhysicalEntitiesList.less';


const block = 'in-sticky-note-process-cluster-entity-list';

export default connectTo(props => {
  return {
    children: combineLatest(props.ids.toArray().map(id => getSnapshot(id))),
    selectedId: selectedSnapshotId
  };
}, PhysicalEntitiesList);

function PhysicalEntitiesList({children, selectedId}) {
  if (!children) {
    return null;
  }

  children = children.sort((a, b) => getPlural(getLabel(a)).localeCompare(getLabel(b)));

  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {children.map(snapshot => {
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

              <img src={getIcon(snapshot)}
                   alt='plugin icon'
                   className={block + '__plugin-icon'} />

              {getLabel(snapshot)}

              <KPIList snapshot={snapshot}
                       metrics={kpis.map(kpi => kpi.metric)}
                       labels={kpis.map(kpi => kpi.label)}
                       formatters={kpis.map(kpi => kpi.valueOnlyFormatter)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const rpt = React.PropTypes;
PhysicalEntitiesList.propTypes = {
  parentId: rpt.string.isRequired,
  ids: irpt.set.isRequired,
  children: rpt.array
};
