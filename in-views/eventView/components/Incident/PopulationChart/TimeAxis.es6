import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';

import './TimeAxis.less';


const block = 'in-event-view-detail-chart-time-axis';

export default function TimeAxis({scale}) {
  // full width / max pixels per timestamp
  const maxSteps = Math.ceil((scale.getRangeTo() - scale.getRangeFrom()) / 180);

  const windowSize = scale.getDomainTo() - scale.getDomainFrom();

  // clamp the stepSize to give the timestamps enough space
  // copy object so that we do not manipulate the axis config
  const axisConfig = Object.create(getAxisConfig(windowSize));
  axisConfig.stepSize = Math.max(axisConfig.stepSize, windowSize / maxSteps);

  const ceilToNearestStep = true;
  const tickPositions = getTickPositions(scale, axisConfig, ceilToNearestStep);

  return (
    <div className={block}>
      {tickPositions.map((position, index) => {
        const x = Math.ceil(position.range);
        const time = index === 0
          ? formatDateTime(position.domain)
          : axisConfig.formatter(position.domain);

        return (
          <div key={x}
               className={`${block}__tick`}
               style={{
                 left: x
               }}>
            {time}
          </div>
        );
      })}
    </div>
  );
}
