import React from 'react';

import { getDashboardLink } from 'in-stores/navigation';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './Host.less';

const block = 'in-log-line-host';

export default connectTo(
  props => {
    return {
      // ignore sub-second differences in snapshot subscriptions
      snapshot: getSnapshot(props.hostSnapshotId, Math.round(props.time / 1000) * 1000)
    };
  },
  function Host({ snapshot }) {
    if (!snapshot) {
      return null;
    }
    return (
      <Link className={block} href$={getDashboardLink(snapshot.get('id'))}>
        {' ' + getLabel(snapshot)}
      </Link>
    );
  }
);
