import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId, selectedSnapshotId} from 'in-stores/snapshot';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import {viewStructure} from 'in-stores/view';
import KPIList from 'in-components/KPIList';
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
    children: combineLatest(props.children.toArray().map(child => getSnapshot(child.get('id')))),
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

              <IsConnectedIcon id={snapshotId}
                               connections={parentConnections} />

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
  childIds: irpt.list,
  children: rpt.array
};
