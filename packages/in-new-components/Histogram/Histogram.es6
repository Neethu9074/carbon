import { Bar } from '@nivo/bar';
import React from 'react';

import { millis } from 'in-services/formatters/number';

export default function Histogram({ buckets }) {
  const data = buckets.map(({ from, to, value }) => ({
    from,
    to,
    value,
    label: `< ${millis.fixedCompact(to)}`
  }));

  return (
    <Bar
      data={data}
      width={600}
      height={189}
      keys={['value']}
      indexBy="label"
      margin={{
        top: 0,
        right: 0,
        bottom: 30,
        left: 50
      }}
      padding={0.1}
      groupMode="grouped"
      colors="#5da6da"
      borderColor="inherit:darker(1.6)"
      axisBottom={{
        orient: 'bottom',
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'center'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'center'
      }}
      enableLabel={false}
      labelTextColor="#e1e8ea"
    />
  );
}
