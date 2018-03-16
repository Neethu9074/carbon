import { Bar } from '@nivo/bar';
import { chain } from 'lodash';
import React from 'react';

import { millis } from 'in-services/formatters/number';

export default function Histogram({ buckets }) {
  let data = buckets.map(({ from, to, value }) => ({
    from,
    to,
    value,
    label: `< ${millis.fixedCompact(to)}`
  }));

  // This is just a temporary fix until we can customize axis labels and tooltips better, see
  // https://github.com/instana/ui-client/pull/680. Until then, we collect all buckets for which the label is the same
  // (due to, for example, 0.7ms and 1.1 ms both being formatted to 1ms) into one single bucket and add up the calls.
  // We only do so if there actually are duplicate labels.
  if (
    data.length !==
    chain(data)
      .map('label')
      .uniq()
      .value().length
  ) {
    data = chain(data)
      // combine all buckets with the same label into one bucket, adding up the values
      .groupBy('label')
      .map(bucketGroup => ({
        from: bucketGroup[0].from,
        to: bucketGroup[bucketGroup.length - 1].to,
        label: bucketGroup[0].label,
        value: chain(bucketGroup)
          .map('value')
          .reduce((a, b) => a + b, 0)
          .value()
      }))
      .value();
  }

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
