/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getAxisConfig } from 'in-new-components/Axis/timeFormatting';
import { getTickPositionsAbsolute } from 'in-services/ticks/horizontal';
import { formatDateTime } from 'in-services/formatters/date';

import './TimeAxis.less';

const block = 'in-event-view-detail-chart-time-axis';

export default function TimeAxis({ scale }) {
  if (scale.getDomainFrom() === null || scale.getDomainTo() === null) {
    return null;
  }

  // full width / max pixels per timestamp
  const maxSteps = Math.ceil((scale.getRangeTo() - scale.getRangeFrom()) / 180);

  const windowSize = scale.getDomainTo() - scale.getDomainFrom();

  // clamp the stepSize to give the timestamps enough space
  // copy object so that we do not manipulate the axis config
  const axisConfig = Object.create(getAxisConfig(windowSize));
  axisConfig.stepSize = Math.max(axisConfig.stepSize, windowSize / maxSteps);

  const tickPositions = getTickPositionsAbsolute({
    scale,
    axisConfig
  });

  return (
    <div className={block}>
      {tickPositions.map((tick, index) => {
        const x = Math.ceil(scale.getRange(tick));
        const time = index === 0 ? formatDateTime(tick) : axisConfig.formatter(tick);

        return (
          <div
            key={x}
            className={`${block}__tick`}
            style={{
              left: x
            }}
          >
            {time}
          </div>
        );
      })}
    </div>
  );
}
