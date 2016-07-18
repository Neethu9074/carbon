import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getConnectedEntities} from 'in-stores/connectedEntities';
import {emptySet} from 'in-services/fixedImmutables';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import './ConnectedEntitiesList.less';


export default connectTo(
  props => {
    return {
      connectedEntities: getConnectedEntities(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  }, ConnectedEntitiesList);

function ConnectedEntitiesList({connectedEntities}) {
  if (!connectedEntities) {
    return null;
  }

  console.log(connectedEntities.toJS());

  return (
    <div>
      <Collapsible>
        <Collapsible.Header>
          header
        </Collapsible.Header>
        <Collapsible.Content>
          content
        </Collapsible.Content>
        </Collapsible>
    </div>
  );
}

const rpt = React.PropTypes;
ConnectedEntitiesList.propTypes = {
  snapshotId: rpt.string.isRequired,
  connectedEntities: irpt.map
};
