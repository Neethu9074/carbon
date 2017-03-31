import irpt from 'react-immutable-proptypes';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLabel from 'in-sdk/components/sidebar/SnapshotLabel';
import { getConnectedEntities } from 'in-stores/connectedEntities';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { emptyMap } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      connectedEntities: getConnectedEntities(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptyMap)
    };
  },
  ConnectedEntitiesList
);

function ConnectedEntitiesList({ connectedEntities }) {
  if (!connectedEntities) {
    return null;
  }

  const sourceId = connectedEntities.get('sourceId');
  const destinationId = connectedEntities.get('destinationId');

  return (
    <div>
      {sourceId ? <Separator /> : null}
      {sourceId ? <Entity snapshotId={sourceId} title={'Connection From (1)'} /> : null}
      {sourceId && destinationId ? <Separator /> : null}
      {destinationId ? <Entity snapshotId={destinationId} title={'Connection To (1)'} /> : null}
    </div>
  );
}

const Entity = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function Entity({ title, snapshot }) {
    if (!snapshot) {
      return null;
    }
    const snapshotId = snapshot.get('id');

    return (
      <DescriptionList>
        <DescriptionItem title={title}>
          <SnapshotLink key={snapshotId} snapshotId={snapshotId}>
            <SnapshotLabel snapshotId={snapshotId} />
          </SnapshotLink>
        </DescriptionItem>
      </DescriptionList>
    );
  }
);

ConnectedEntitiesList.propTypes = {
  connectedEntities: irpt.map
};
