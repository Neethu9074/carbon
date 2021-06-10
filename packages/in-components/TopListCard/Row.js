/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import theme from 'in-themes';

import locals from './Row.mless';

export default function TopListRow(props) {
  const {
    wrapLabel = wrapDefault,
    wrapMetric = wrapDefault,
    wrapContributedItem = wrapContributedItem,
    metricValue,
    maxValue,
    Label,
    Metric,
    CompanionMetric,
    renderedContributedItem,
    color
  } = props;
  const percent = maxValue != 0 ? Math.min(metricValue / maxValue, 1) : 0;
  const positionPercent = `${percent * 100}%`;
  const barColor = color || theme.lib.colors.chart.strokeColors100[0];

  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        {wrapLabel(
          <span className={locals.label}>
            <Label />
          </span>
        )}
        {wrapMetric(
          <div className={locals.metricWrapper}>
            <span className={locals.metric}>
              <Metric />
            </span>
            {CompanionMetric && (
              <span className={locals.companion}>
                <CompanionMetric />
              </span>
            )}
          </div>
        )}
      </div>

      <div className={locals.bar}>
        <div className={locals.barInner} style={{ width: positionPercent, background: barColor }} />
        {renderedContributedItem && (
          <div className={locals.hairLine} style={{ marginLeft: positionPercent, background: barColor }}>
            {wrapContributedItem(
              <div
                className={classNames({
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
