import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import HealthIconListing from 'in-components/HealthIconListing';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import {viewStructure} from 'in-stores/view';
import KPIList from 'in-components/KPIList';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import './PhysicalEntitiesList.less';


const block = 'in-sticky-note-process-cluster-entity-list';
const CONNECTION_TYPES = {
  UNDEFINED: undefined,
  UPSTREAM: 1,
  DOWNSTREAM: 2
};

export default connectTo(props => {
  return {
    children: combineLatest(props.ids.toArray().map(child => getSnapshot(child.get('id')))),
    parentConnections: viewStructure.map(root => {
                          for (let i = 0, length = root.get('children').size; i < length; i++) {
                            const item = root.getIn(['children', i]);
                            if (item.get('id') === props.parentId) {
                              return {
                                outgoing: item.get('outgoingConnections'),
                                incoming: item.get('incomingConnections')
                              };
                            }
                          }
                        }),
    selectedId: selectedSnapshotId
  };
}, PhysicalEntitiesList);

function PhysicalEntitiesList({children, parentConnections, selectedId}) {
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
          const baseClass = block + '__item';
          let className = baseClass;
          if (snapshotId === selectedId) {
            className += ' ' + className + '--selected';
          }

          return (
            <li key={snapshotId}
                className={className}
                onClick={() => setSelectedSnapshotId(snapshotId)}>

              <HealthIconListing className={block + '__health-icon'}
                                 snapshotId={snapshotId} />

              <div className={block + '__entity-information'}>
                <IsConnectedIcon id={snapshotId}
                                 connections={parentConnections} />

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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IsConnectedIcon({id, connections}) {
  const type = getConnectionType(id, connections);
  if (!type) {
    return null;
  }

  return (
    {type}
  );
}

function getConnectionType(id, connections) {
  if (!connections) {
    return CONNECTION_TYPES.UNDEFINED;
  }

  for (let i = 0, length = connections.outgoing.size; i < length; i++) {
    const connectedId = connections.outgoing.getIn([i, 'otherId']);
    if (id === connectedId) {
      return CONNECTION_TYPES.UPSTREAM;
    }
  }
  for (let i = 0, length = connections.incoming.size; i < length; i++) {
    const connectedId = connections.incoming.getIn([i, 'otherId']);
    if (id === connectedId) {
      return CONNECTION_TYPES.DOWNSTREAM;
    }
  }
  return CONNECTION_TYPES.UNDEFINED;
}

const rpt = React.PropTypes;
PhysicalEntitiesList.propTypes = {
  parentId: rpt.string.isRequired,
  ids: irpt.list.isRequired,
  children: rpt.array
};
