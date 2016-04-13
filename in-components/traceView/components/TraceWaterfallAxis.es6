import React from 'react';

import './TraceWaterfallAxis.less';

const block = 'in-trace-waterfall-axis';

export default function TraceWaterfallAxis({axisConfig, ticks}) {
  const minDomain = ticks[0].domain;

  return (
    <div className={block}>
      {ticks.map(tick =>
        <div className={block + '__tick'}
             key={tick.domain}
             style={{left: `${tick.range}%`}}>
          <div className={block + '__vertical-line'}></div>
          {axisConfig.relativeFormatter(tick.domain - minDomain)}
        </div>
      )}
    </div>
  );
}
