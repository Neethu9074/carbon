/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getSnapshotFromPhysicalHierarchyByPlugin } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default function getSnapshotFromHierarchyByPluginHoc(plugin, WrappedComponent) {
  return connectTo(props => {
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
  }, WrappedComponent);
}
