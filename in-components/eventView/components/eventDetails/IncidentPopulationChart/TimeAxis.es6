import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';

import './TimeAxis.less';


const block = 'in-event-view-detail-chart-time-axis';
const maxSteps = 5;

export default function TimeAxis({scale}) {
  const windowSize = scale.getDomainTo() - scale.getDomainFrom();

  // clamp the stepSize to give the timestamps enough space
  const axisConfig = getAxisConfig(windowSize);
  axisConfig.stepSize = Math.max(axisConfig.stepSize, windowSize / maxSteps);

  const tickPositions = getTickPositions(scale, axisConfig, true); // true -> ceilToNearestStep

  return (
    <div className={block}>
      <div className={`${block}__topline`}
           style={{
             width: `${scale.getRangeTo() - scale.getRangeFrom()}px`
           }}/>

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
