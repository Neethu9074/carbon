import React from 'react';

import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';

import './TimeAxis.less';


const block = 'in-event-view-detail-chart-time-axis';

export default function TimeAxis({scale}) {
  const windowSize = scale.getDomainTo() - scale.getDomainFrom();
  const axisConfig = getAxisConfig(windowSize);
  const tickPositions = getTickPositions(scale, axisConfig);

  return (
    <div className={block}>
      <div className={`${block}__topline`}
           style={{
             width: `${scale.getRangeTo() - scale.getRangeFrom()}px`
           }}/>

      {tickPositions.map(position => {
        const x = Math.ceil(position.range);
        const time = axisConfig.formatter(position.domain);

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
