import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId} from 'in-stores/snapshot';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import {emptyMap} from 'in-services/fixedImmutables';
import Collapsible from 'in-components/Collapsible';
import List from 'in-sdk/components/sidebar/List';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './ConnectedEntitiesList.less';


export default connectTo(
  props => {
    return {
      connectedEntities: getConnectedEntities(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptyMap)
    };
  }, ConnectedEntitiesList);

function ConnectedEntitiesList({connectedEntities}) {
  if (!connectedEntities) {
    return null;
  }

  const sourceId = connectedEntities.get('sourceId');
  const destinationId = connectedEntities.get('destinationId');

  return (
    <div>
      {sourceId ? <Entity snapshotId={sourceId} title={'Upstream'} /> : null}
      {destinationId ? <Entity snapshotId={destinationId} title={'Downstream'} /> : null}
    </div>
  );
}

const Entity = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId)
  };
}, function Enttiy({title, snapshot}) {
  if (!snapshot) {
    return null;
  }
  const id = snapshot.get('id');

  return (
    <Collapsible>
      <Collapsible.Header>
        {title}
      </Collapsible.Header>
      <Collapsible.Content>
        <List>
          <List.Item key={id}
                     onClick={() => setSelectedSnapshotId(id)}>
            {getLabel(snapshot)}
          </List.Item>
        </List>
      </Collapsible.Content>
    </Collapsible>
  );
});

const rpt = React.PropTypes;
ConnectedEntitiesList.propTypes = {
  snapshotId: rpt.string.isRequired,
  connectedEntities: irpt.map
};
