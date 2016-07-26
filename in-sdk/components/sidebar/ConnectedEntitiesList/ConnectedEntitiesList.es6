import irpt from 'react-immutable-proptypes';
import React from 'react';

import {ClickableList, ClickableSnapshotListItem} from 'in-sdk/components/sidebar/ClickableList';
import Separator from 'in-sdk/components/sidebar/Separator';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import {emptyMap} from 'in-services/fixedImmutables';
import Collapsible from 'in-components/Collapsible';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './ConnectedEntitiesList.less';

const block = 'in-connected-entities-list';

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
      {sourceId ? <Entity snapshotId={sourceId} title={'Upstream (1)'} /> : null}
      {sourceId && destinationId ?
        <Separator />
      : null}
      {destinationId ? <Entity snapshotId={destinationId} title={'Downstream (1)'} /> : null}
    </div>
  );
}

const Entity = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId)
  };
}, function Entity({title, snapshot}) {
  if (!snapshot) {
    return null;
  }
  const id = snapshot.get('id');

  return (
    <Collapsible>
      <Collapsible.Header>
        {title}
      </Collapsible.Header>
      <Collapsible.Content className={`${block}__snapshot-list`}>
        <ClickableList>
          <ClickableSnapshotListItem snapshotId={id}>
            {getLabel(snapshot)}
          </ClickableSnapshotListItem>
        </ClickableList>
      </Collapsible.Content>
    </Collapsible>
  );
});

const rpt = React.PropTypes;
ConnectedEntitiesList.propTypes = {
  snapshotId: rpt.string.isRequired,
  connectedEntities: irpt.map
};
