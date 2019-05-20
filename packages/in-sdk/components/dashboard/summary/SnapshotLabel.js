import React from 'react';

import './SnapshotLabel.less';

const block = 'in-dash-sum-snap-label';

export default function SnapshotLabel({ children, actions }) {
  // do not require keys for actions
  const actionElement = React.createElement.apply(React, ['div', { className: `${block}__actions` }].concat(actions));
  return (
    <h1 className={block}>
      <span>{children}</span>
      {actionElement}
    </h1>
  );
}
