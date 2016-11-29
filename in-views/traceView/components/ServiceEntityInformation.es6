import {loadingPlaceholder, alwaysLoadingPlaceholder$} from 'in-views/traceView/components/SpanEntityInformation';
import SpanEntityInformation from 'in-views/traceView/components/SpanEntityInformation';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import {getZone} from 'in-stores/zone';

export default connectTo(props => {
  const serviceInstanceSnapshotId = props.span.getIn(['rels', 'destinationServiceInstanceId']);

  let snapshot$ = alwaysNull;
  if (serviceInstanceSnapshotId) {
    const time = props.span.get('start');
    snapshot$ = getZone(serviceInstanceSnapshotId, time)
      .startWith(loadingPlaceholder)
      .flatMap(serviceSnapshotId => {
        if (!serviceSnapshotId) {
          return alwaysNull;
        } else if (serviceSnapshotId === loadingPlaceholder) {
          return alwaysLoadingPlaceholder$;
        }

        return getSnapshot(serviceSnapshotId, time)
          .startWith(loadingPlaceholder);
      });
  }

  return {
    snapshot: snapshot$
  };
}, SpanEntityInformation);
