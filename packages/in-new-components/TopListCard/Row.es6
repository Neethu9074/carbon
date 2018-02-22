import React from 'react';

import locals from './Row.mless';

export default function TopListRow({ label, metricValue, maxValue, renderedMetric }) {
  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        {/* Do not remove the div wrapper. It ensures that the label is only ever recognized as one DOM element (for flexbox)*/}
        <div>{label}</div>
        {renderedMetric}
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: `${metricValue / maxValue * 100}%` }} />
      </div>
    </li>
  );
}
