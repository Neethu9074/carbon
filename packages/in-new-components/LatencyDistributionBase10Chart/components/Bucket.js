import React from 'react';

import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './Bucket.mless';

export default function Bucket({
  bucket,
  bucketWidth,
  maxDataValue,
  height,
  percentileHeight,
  percentilesShown,
  formatter
}) {
  const percentiles = bucket.percentiles?.filter(p => percentilesShown.includes(p));
  return (
    <Tooltip themeStyle="unset" content={TooltipContent(bucket, formatter)}>
      <Link className={locals.barOuter} style={{ width: bucketWidth, height: `${height}px` }}>
        <Bar calls={bucket.calls} maxDataValue={maxDataValue} height={height - percentileHeight} />
        {percentiles && percentiles.length > 0 && <PercentileMarker percentiles={percentiles} />}
        <StrikeLine height={height - percentileHeight} />
      </Link>
    </Tooltip>
  );
}

function Bar({ calls, maxDataValue, height }) {
  let barHeight = (calls / maxDataValue) * height;
  if (calls > 0) {
    barHeight = Math.max(2, barHeight);
  }
  return (
    <div
      style={{
        height: `${barHeight}px`,
        background: theme.lib.colors.chart.strokeColors100[0] + '60'
      }}
      className={locals.barInner}
    />
  );
}

function StrikeLine({ height }) {
  return <div style={{ height: `${height}px` }} className={locals.barStrike} />;
}

function PercentileMarker({ percentiles }) {
  return (
    <>
      <div className={locals.dottedLine} />
      <div className={locals.percentiles}>{percentiles.map(p => 'p' + p).join(',')}</div>
    </>
  );
}

const TooltipContent = (bucket, formatter) => {
  const from = formatter.detailed(bucket.from);
  const to = formatter.detailed(bucket.to);
  let text;
  if (bucket.from !== 0 && bucket.to !== 0) {
    text = `${from} to ${to}`;
  } else if (bucket.from) {
    text = `> ${from}`;
  } else {
    text = `< ${to}`;
  }
  return (
    <>
      <div className={locals.tooltipContent}>
        <div className={locals.labelWrapper}>{text}</div>
        <div className={locals.labelWrapper}>
          <div className={locals.dot} />
          <span>Calls (sum)</span>
          <span className={locals.value}>{number.forcedCompact.detailed(bucket.calls)}</span>
        </div>
      </div>
    </>
  );
};
