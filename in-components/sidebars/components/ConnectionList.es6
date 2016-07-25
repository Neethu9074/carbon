import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId} from 'in-stores/snapshot';
import Collapsible from 'in-components/Collapsible';
import {viewStructure} from 'in-stores/view';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import List from 'in-sdk/components/sidebar/List';


const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      connections: viewStructure
      .map(root => {
        for (let i = 0, length = root.get('children').size; i < length; i++) {
          const item = root.getIn(['children', i]);
          if (item.get('id') === props.snapshotId) {
            return {
              outgoing: item.get('outgoingConnections'),
              incoming: item.get('incomingConnections')
            };
          }
        }
      })
    };
  }, ConnectionList
);

function ConnectionList({connections}) {
  if (!connections || (connections.outgoing.size === 0 && connections.incoming.size === 0)) {
    return null;
  }

  return (
    <div>
      {connections.outgoing.size === 0 ? null :
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {'Downstream (' + connections.outgoing.size + ')'}
          </Collapsible.Header>
          <Collapsible.Content>
            <SnapshotList connections={connections.outgoing} />
          </Collapsible.Content>
        </Collapsible>
      }

      {connections.incoming.size === 0 ? null :
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {'Upstream (' + connections.incoming.size + ')'}
          </Collapsible.Header>
          <Collapsible.Content>
            <SnapshotList connections={connections.incoming} />
          </Collapsible.Content>
        </Collapsible>
      }
    </div>
  );
}

const SnapshotList = connectTo(props => {
  return {
    snapshots: combineLatest(props.connections.map(connection => getSnapshot(connection.get('id'))))
  };
}, function SnapshotList({snapshots}) {
  if (!snapshots) {
    return null;
  }

  return (
    <List>
      {snapshots.map(snapshot =>
        <List.Item key={snapshot.get('id')}
                   onClick={() => setSelectedSnapshotId(snapshot.get('id'))}>
          {getLabel(snapshot)}
        </List.Item>
      )}
    </List>
  );
});

ConnectionList.propTypes = {
  snapshotId: rpt.string.isRequired,
  connections: rpt.shape({
    outgoing: irpt.list.isRequired,
    incoming: irpt.list.isRequired
  })
};
