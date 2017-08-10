import React from 'react';

import { getLabel } from 'in-sdk/snapshot';

import './SnapshotLabel.less';

const block = 'in-dash-sum-snap-label';

export default function SnapshotLabel({ snapshot, actions }) {
  // do not require keys for actions
  const actionElement = React.createElement.apply(React, ['div', { className: `${block}__actions` }].concat(actions));
  return (
    <h1 className={block}>
      {getLabel(snapshot)}
      {actionElement}
    </h1>
  );
}
