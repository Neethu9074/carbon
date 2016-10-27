import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import SnapshotLabel from 'in-sdk/components/sidebar/SnapshotLabel';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import {viewStructure} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';


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

      {connections.incoming.size === 0 ? null :
        <DescriptionList>
          <DescriptionItem title={`Inbound Connections (${connections.incoming.size})`}>
            <SnapshotList connections={connections.incoming} />
          </DescriptionItem>
        </DescriptionList>
      }

      {connections.incoming.size > 0 && connections.outgoing.size > 0 ? <Separator /> : null}

      {connections.outgoing.size === 0 ? null :
        <DescriptionList>
          <DescriptionItem title={`Outbound Connections (${connections.outgoing.size})`}>
            <SnapshotList connections={connections.outgoing} />
          </DescriptionItem>
        </DescriptionList>
      }
    </div>
  );
}

function SnapshotList({connections}) {
  if (!connections) {
    return null;
  }

  return (
    <div>
      {connections.map(connection => {
        const snapshotId = connection.get('id');
        return (
          <SnapshotLink key={snapshotId}
                        snapshotId={snapshotId}>
            <SnapshotLabel snapshotId={snapshotId}/>
          </SnapshotLink>
        );
      })}
    </div>
  );
}

ConnectionList.propTypes = {
  snapshotId: rpt.string.isRequired,
  connections: rpt.shape({
    outgoing: irpt.list.isRequired,
    incoming: irpt.list.isRequired
  })
};
