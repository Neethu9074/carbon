import React from 'react';

import locals from './Row.mless';

export default function TopListRow({ label, metricValue, maxValue, renderedMetric }) {
  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        {label}
        {renderedMetric}
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: `${metricValue / maxValue * 100}%` }} />
      </div>
    </li>
  );
}
