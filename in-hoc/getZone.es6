import { getSnapshot as loadSnapshot } from 'in-stores/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { getZone as loadZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';

export default function getZone(ComposedComponent) {
  return connectTo(props => {
    return {
      zoneSnapshot: loadZone(props.snapshotId || props.snapshot.get('id')).flatMap(zoneSnapshotId => {
        if (zoneSnapshotId) {
          return loadSnapshot(zoneSnapshotId);
        }
        return alwaysNull;
      })
    };
  }, ComposedComponent);
}
