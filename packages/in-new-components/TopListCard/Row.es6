import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import theme from 'in-themes';

import locals from './Row.mless';

export default function TopListRow(props) {
  const {
    wrapLabel = wrapDefault,
    wrapMetric = wrapDefault,
    wrapContributedItem = wrapContributedItem,
    metricValue,
    maxValue,
    renderedMetric,
    renderedContributedItem
  } = props;
  const percent = Math.min(metricValue / maxValue, 1);
  const positionPercent = `${percent * 100}%`;
  const color = theme.lib.colors.chart.strokeColors100[0];

  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        {wrapLabel(<span className={locals.label}>{props.label}</span>)}
        {wrapMetric(<span className={locals.metric}>{renderedMetric}</span>)}
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: positionPercent, background: color }} />
        {renderedContributedItem && (
          <div className={locals.hairLine} style={{ marginLeft: positionPercent, background: color }}>
            {wrapContributedItem(
              <div
                className={evaluateClassNames({
                  [locals.contributedContentLeftAligned]: percent <= 0.5,
                  [locals.contributedContentRightAligned]: percent > 0.5
                })}
              >
                {renderedContributedItem}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

function wrapDefault(labelComponent) {
  return labelComponent;
}
