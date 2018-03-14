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
        left: 0
      }}
      padding={0.3}
      groupMode="grouped"
      colors="#4b3aff"
      borderColor="inherit:darker(1.6)"
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'country',
        legendPosition: 'center',
        legendOffset: 36
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'food',
        legendPosition: 'center',
        legendOffset: -40
      }}
      enableLabel={false}
      labelTextColor="#e1e8ea"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
}
