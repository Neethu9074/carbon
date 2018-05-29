import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import theme from 'in-themes';

import locals from './Row.mless';

export default function TopListRow({ label, metricValue, maxValue, renderedMetric, renderContributedItem }) {
  const percent = Math.min(metricValue / maxValue, 1);
  const positionPercent = `${percent * 100}%`;
  const color = theme.lib.colors.chart.strokeColors100[0];

  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        <span className={locals.label}>{label}</span>
        <span className={locals.metric}>{renderedMetric}</span>
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: positionPercent, background: color }} />
        {renderContributedItem && (
          <div className={locals.hairLine} style={{ marginLeft: positionPercent, background: color }}>
            <div
              className={evaluateClassNames({
                [locals.contributedContentLeftAligned]: percent <= 0.5,
                [locals.contributedContentRightAligned]: percent > 0.5
              })}
            >
              {renderContributedItem()}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
