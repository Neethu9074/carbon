import React from 'react';

import {alwaysEmptyImmutableMap, alwaysNull} from 'in-services/fixedStreams';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

const loadingPlaceholder = {};

export default connectTo(props => {
  const connectionId = props.span.getIn(['rels', 'physicalConnectionId']);
  const start = props.span.get('start');
  let connectedEntities$;
  if (connectionId) {
    connectedEntities$ = getConnectedEntities(connectionId, start)
      .startWith(loadingPlaceholder);
  } else {
    connectedEntities$ = alwaysEmptyImmutableMap;
  }

  const snapshot$ = connectedEntities$.flatMap(connectedEntities => {
    if (connectedEntities === loadingPlaceholder) {
      return loadingPlaceholder;
    }

    const sourceId = connectedEntities.get('sourceId');
    if (sourceId) {
      return getSnapshot(sourceId, start)
        .startWith(loadingPlaceholder);
    }
    return alwaysNull;
  });

  return {
    snapshot: snapshot$
  };
}, function SpanEntityInformation({snapshot}) {
  if (snapshot === loadingPlaceholder) {
    return <LoadingIndicator />;
  } else if (!snapshot) {
    return <div>No entity data found.</div>;
  }

  const readablePluginId = getSingular(snapshot.get('plugin'));
  return (
    <div>
      <img src={getIcon(snapshot)} alt={`Icon depicting ${readablePluginId}`} />
      {getLabel(snapshot)}
    </div>
  );
});
