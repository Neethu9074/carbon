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
    renderedCompanionMetric,
    renderedContributedItem,
    color
  } = props;
  const percent = Math.min(metricValue / maxValue, 1);
  const positionPercent = `${percent * 100}%`;
  const barColor = color || theme.lib.colors.chart.strokeColors100[0];

  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        {wrapLabel(<span className={locals.label}>{props.label}</span>)}
        {wrapMetric(
          <div>
            <span className={locals.metric}>{renderedMetric}</span>
            {renderedCompanionMetric && <span className={locals.companion}>{renderedCompanionMetric}</span>}
          </div>
        )}
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: positionPercent, background: barColor }} />
        {renderedContributedItem && (
          <div className={locals.hairLine} style={{ marginLeft: positionPercent, background: barColor }}>
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
