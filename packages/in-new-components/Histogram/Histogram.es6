import { defaultProps, compose, renameProps } from 'recompose';
import { Bar } from '@nivo/bar';
import { chain } from 'lodash';
import React from 'react';

import VerticalAxisPlaceholder from 'in-new-components/Axis/VerticalAxisPlaceholder';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';

import locals from './Histogram.mless';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 189
  })
)(Histogram);

function Histogram({ width, height, customWidth, customHeight, buckets }) {
  if (!width) {
    return <div style={{ height: customHeight || height }} className={locals.heatMap} />;
  }
  width = (customWidth || width) - 60;
  height = (customHeight || height) - 30;

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
    <div className={locals.histogram}>
      <VerticalAxis scale={{ from: 0, to: getMaxDataValue(data) }} height={height} />
      <div>
        <Bar
          data={data}
          width={width}
          height={height}
          keys={['value']}
          indexBy="label"
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
          padding={0.1}
          groupMode="grouped"
          colors="#5da6da"
          borderColor="inherit:darker(1.6)"
          enableLabel={false}
          labelTextColor="#e1e8ea"
        />
        <HorizontalAxis
          formatter={millis}
          scale={{ from: data[0].from, to: data[data.length - 1].to }}
          fixedTickPositions={data.map((item, i) => i / data.length + 1 / data.length / 2)}
          width={width}
        />
      </div>
      <VerticalAxisPlaceholder />
    </div>
  );
}

function getMaxDataValue(data) {
  let max = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].value > max) {
      max = data[i].value;
    }
  }

  return max;
}
