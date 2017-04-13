import { loadingPlaceholder } from 'in-components/EntityInformation';
import EntityInformation from 'in-components/EntityInformation';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  const side = getServiceSideForOverview(props.span);
  const serviceSnapshotId = props.span.getIn(['rels', `${side}ServiceId`]);

  let snapshot$ = alwaysNull;
  if (serviceSnapshotId) {
    const time = props.span.get('start');
    snapshot$ = getSnapshot(serviceSnapshotId, time).startWith(loadingPlaceholder);
  }

  return {
    snapshot: snapshot$
  };
}, EntityInformation);
