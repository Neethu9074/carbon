import React from 'react';

import HealthIconListing from 'in-components/HealthIconListing';

import './SnapshotLabel.less';

const block = 'in-dash-sum-snap-label';

export default function SnapshotLabel({ children, actions, snapshotId }) {
  // do not require keys for actions
  const actionElement = React.createElement.apply(React, ['div', { className: `${block}__actions` }].concat(actions));
  return (
    <h1 className={block}>
      <span>
        {snapshotId && <HealthIconListing snapshotId={snapshotId} className={`${block}__health`} />}
        {children}
      </span>
      {actionElement}
    </h1>
  );
}
