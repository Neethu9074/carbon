import {loadingPlaceholder, alwaysLoadingPlaceholder$} from 'in-views/traceView/components/SpanEntityInformation';
import SpanEntityInformation from 'in-views/traceView/components/SpanEntityInformation';
import subscribeToInstanceImplementation from 'in-services/subscription/serviceInstanceImplementation';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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
}, SpanEntityInformation);
