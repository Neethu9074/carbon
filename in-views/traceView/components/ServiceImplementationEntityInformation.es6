import subscribeToPhysicalEndpointImplementation from 'in-services/subscription/physicalEndpointImplementation';
import {loadingPlaceholder, alwaysLoadingPlaceholder$} from 'in-components/EntityInformation';
import EntityInformation from 'in-components/EntityInformation';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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
}, EntityInformation);
