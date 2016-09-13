import React from 'react';

import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import './TimeAxis.less';


const block = 'in-event-view-event-detail-time-axis';

export default connectTo({
  serverTime: serverTime$
},
function TimeAxis({start, end, serverTime}) {
  end = end || serverTime;

  const x = createScale();
  x.setRangeFrom(0);
  x.setRangeTo(100);
  x.setDomainFrom(start);
  x.setDomainTo(end);

  const axisConfig = getAxisConfig(end - start);
  const tickPositions = getTickPositions(x, axisConfig, true);

  return (
    <div className={block}>
      {tickPositions.map(position =>
        <div key={position.range}
             style={{
               left: `${position.range}%`
             }}
             className={`${block}__tick`}>
          {axisConfig.relativeFormatter(position.domain - start)}
        </div>
      )}
    </div>
  );
});
