import React from 'react';

import './RollupIndicator.less';

const block = 'in-chart-rollup-indicator';

export default function RollupIndicator({ rollup }) {
  return (
    <div className={block}>
      Rollup {rollup.label}
    </div>
  );
}
