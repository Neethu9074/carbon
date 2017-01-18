import React from 'react';

import subscribeToPhysicalEndpointImplementation from 'in-services/subscription/physicalEndpointImplementation';
import {loadingPlaceholder, alwaysLoadingPlaceholder$} from 'in-components/EntityInformation';
import EntityInformation from 'in-components/EntityInformation';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ServiceImplementationEntityInformation.less';


const block = 'in-trace-tree-span-element-service-information';

export default connectTo(props => {
  const physicalEndpoint = props.span.getIn(['rels', props.connectionEndpointType + 'PhysicalEndpoint']);

  let snapshot$ = alwaysNull;
  if (physicalEndpoint) {
    const time = props.span.get('start');
    snapshot$ = subscribeToPhysicalEndpointImplementation({
        time,
        physicalEndpoint
      })
      .startWith(loadingPlaceholder)
      .flatMap(physicalEndpointImplementationSnapshotId => {
        if (!physicalEndpointImplementationSnapshotId) {
          return alwaysNull;
        } else if (physicalEndpointImplementationSnapshotId === loadingPlaceholder) {
          return alwaysLoadingPlaceholder$;
        }

        return getSnapshot(physicalEndpointImplementationSnapshotId, time)
          .startWith(loadingPlaceholder);
      });
  }

  return {
    snapshot: snapshot$
  };
}, EntityInformationComponent);

function EntityInformationComponent({snapshot, label, serviceId}) {
  if (snapshot == null) {
    return null;
  }

  return (
    <div className={`${block}__link-service-wrapper`}>
      <EntityInformation snapshot={snapshot}
                         label={label} />

      <Service serviceId={serviceId} />
    </div>
  );
}

const Service = connectTo(props => {
  return {
    snapshot: props.serviceId ? getSnapshot(props.serviceId) : alwaysNull
  };
},
function Service({snapshot}) {
  if (!snapshot) {
    return null;
  }

  return (
    <div className={block}>
      <SvgIcon type='corner_arrow_right'
               className={`${block}__service-icon`}
               width={10}
               color='#92a5ae' />
      <EntityInformation snapshot={snapshot}
                         label='Service:' />
    </div>
  );
});
