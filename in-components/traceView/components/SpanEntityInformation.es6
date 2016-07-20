import {create} from 'reactive-observables';
import React from 'react';

import {alwaysEmptyImmutableMap, alwaysNull} from 'in-services/fixedStreams';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

const loadingPlaceholder = {};
const alwaysLoadingPlaceholder = create().emit(loadingPlaceholder);

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
      return alwaysLoadingPlaceholder;
    }

    const otherId = connectedEntities.get(props.connectionEndpointType);
    if (otherId) {
      return getSnapshot(otherId, start)
        .startWith(loadingPlaceholder);
    }
    return alwaysNull;
  });

  return {
    snapshot: snapshot$
  };
}, function SpanEntityInformation({label, snapshot}) {
  if (snapshot === loadingPlaceholder) {
    return <LoadingIndicator />;
  } else if (!snapshot) {
    return null;
  }

  const readablePluginId = getSingular(snapshot.get('plugin'));
  return (
    <span>
      &nbsp;
      {label}:
      &nbsp;
      <img src={getIcon(snapshot)}
           alt={`Icon depicting ${readablePluginId}`}
           style={{
             width: '14px',
             background: 'black'
           }}/>
      &nbsp;
      <DashboardLink snapshotId={snapshot.get('id')}>
        {getLabel(snapshot)}
      </DashboardLink>
    </span>
  );
});
