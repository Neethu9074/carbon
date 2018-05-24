import React from 'react';

import theme from 'in-themes';

import locals from './Row.mless';

export default function TopListRow({ label, metricValue, maxValue, renderedMetric }) {
  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        <span className={locals.label}>{label}</span>
        <span className={locals.metric}>{renderedMetric}</span>
      </div>

      <div className={locals.bar}>
        <div
          className={locals.barInner}
          style={{ width: `${metricValue / maxValue * 100}%`, background: theme.lib.colors.chart.strokeColors100[0] }}
        />
      </div>
    </li>
  );
}
