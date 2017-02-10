import React from 'react';

import {getDashboardLink} from 'in-stores/navigation';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Host.less';

const block = 'in-log-line-host';

export default connectTo(props => {
  return {
    // ignore sub-second differences in snapshot subscriptions
    snapshot: getSnapshot(props.hostSnapshotId, Math.round(props.time / 1000) * 1000),
    href: getDashboardLink(props.hostSnapshotId)
  };
}, function Host({snapshot, href}) {
  if (!snapshot) {
    return null;
  }
  return (
    <a className={block}
       href={href}>
      {' ' + getLabel(snapshot)}
    </a>
  );
});
