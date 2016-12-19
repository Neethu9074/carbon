import {combineLatest} from 'reactive-observables';
import React from 'react';

import {ClickableList, ClickableSnapshotListItem} from 'in-sdk/components/sidebar/ClickableList';
import Separator from 'in-sdk/components/sidebar/Separator';
import Collapsible from 'in-components/Collapsible';
import {getSnapshot} from 'in-stores/snapshot';
import {viewStructure} from 'in-stores/view';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
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
}, function ConnectionList({connections}) {
  if (!connections || (connections.outgoing.size === 0 && connections.incoming.size === 0)) {
    return null;
  }

  return (
    <div>
      {connections.incoming.size === 0
        ? null
        : <div>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              {'Inbound Connections (' + connections.incoming.size + ')'}
            </Collapsible.Header>
            <Collapsible.Content>
              <SnapshotList connections={connections.incoming} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      }

      {connections.outgoing.size === 0
        ? null
        : <div>
          <Separator />
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              {'Outbound Connections (' + connections.outgoing.size + ')'}
            </Collapsible.Header>
            <Collapsible.Content>
              <SnapshotList connections={connections.outgoing} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      }
    </div>
  );
});

const SnapshotList = connectTo(props => {
  return {
    snapshots: combineLatest(props.connections.map(connection => getSnapshot(connection.get('id'))))
  };
}, function SnapshotList({snapshots}) {
  if (!snapshots) {
    return null;
  }

  return (
    <ClickableList>
      {snapshots.map(snapshot =>
        <ClickableSnapshotListItem key={snapshot.get('id')}
                                   snapshotId={snapshot.get('id')}>
          {getLabel(snapshot)}
        </ClickableSnapshotListItem>
      )}
    </ClickableList>
  );
});
