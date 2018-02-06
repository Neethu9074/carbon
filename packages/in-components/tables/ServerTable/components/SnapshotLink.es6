import React from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const snapshot$ = getSnapshot(props.snapshotId);
    return {
      snapshot: snapshot$,
      href: snapshot$.flatMap(snapshot => {
        if (!snapshot) {
          return alwaysNull;
        }
        return getModifiedUrlStream(params => {
          params.pathname = physicalDashboardPath;
          params.query.snapshotId = snapshot.get('id');
        });
      })
    };
  },
  function SnapshotLink({ snapshot, href }) {
    if (!snapshot || !href) {
      return null;
    }

    return <a href={href}>{getLabel(snapshot)}</a>;
  }
);
