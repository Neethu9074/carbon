import React from 'react';

import subscribeToInstanceImplementation from 'in-services/subscription/serviceInstanceImplementation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {alwaysNull, always} from 'in-services/fixedStreams';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './SpanEntityInformation.less';

const loadingPlaceholder = {};
const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

const block = 'in-trace-view-span-entity-information';

export default connectTo(props => {
  const serviceInstanceSnapshotId = props.span.getIn(['rels', props.connectionEndpointType + 'ServiceInstanceId']);

  let snapshot$ = alwaysNull;
  if (serviceInstanceSnapshotId) {
    const time = props.span.get('start');
    snapshot$ = subscribeToInstanceImplementation({
        time,
        serviceInstanceSnapshotId
      })
      .startWith(loadingPlaceholder)
      .flatMap(serviceInstanceImplementationSnapshotId => {
        if (!serviceInstanceImplementationSnapshotId) {
          return alwaysNull;
        } else if (serviceInstanceImplementationSnapshotId === loadingPlaceholder) {
          return alwaysLoadingPlaceholder$;
        }

        return getSnapshot(serviceInstanceImplementationSnapshotId, time)
          .startWith(loadingPlaceholder);
      });
  }

  return {
    snapshot: snapshot$
  };
}, function SpanEntityInformation({label, snapshot}) {
  if (snapshot === loadingPlaceholder) {
    return (
      <LoadingIndicator inline={true}
                        type='dark'
                        style={{
                          height: '16px'
                        }}/>
    );
  } else if (!snapshot) {
    return null;
  }

  const readablePluginId = getSingular(snapshot.get('plugin'));
  return (
    <span className={block}>
      <span className={`${block}__label`}>
        {label}
      </span>
      &nbsp;
      <img src={getIcon(snapshot)}
           alt={`Icon depicting ${readablePluginId}`}
           className={`${block}__icon`} />
      &nbsp;
      <DashboardLink snapshotId={snapshot.get('id')}
                     className={`${block}__link`}>
        {getLabel(snapshot)}
      </DashboardLink>
    </span>
  );
});
