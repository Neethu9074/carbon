import React from 'react';

import './TwoColumnDetailHeader.less';

const block = 'in-dashboard-tab-view-columns';

export default function TwoColumn({ left, right }) {
  // do not require keys for left/right
  return (
    <div className={block}>
      {React.createElement('div', null, React.Children.toArray(left))}
      {React.createElement('div', null, React.Children.toArray(right))}
    </div>
  );
}
