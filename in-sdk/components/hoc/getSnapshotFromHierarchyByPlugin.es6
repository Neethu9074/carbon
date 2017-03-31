import connectTo from 'in-hoc/connectTo';

import { getSnapshotFromPhysicalHierarchyByPlugin } from 'in-stores/snapshot';

export default function getSnapshotFromHierarchyByPluginHoc(plugin, WrappedComponent) {
  return connectTo(
    props => {
      let snapshotId;
      if (props.snapshotId) {
        snapshotId = props.snapshotId;
      } else if (props.snapshot) {
        snapshotId = props.snapshot.get('id');
      }

      if (snapshotId) {
        return {
          [`${plugin}Snapshot`]: getSnapshotFromPhysicalHierarchyByPlugin(snapshotId, plugin)
        };
      }

      return {};
    },
    WrappedComponent
  );
}
