import React from 'react';

import VerticalAxis, { WIDTH, HEIGHT } from 'in-new-components/Axis/VerticalAxis';
import { getAxisMinMax } from 'in-components/Chart/Scales';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.filteredDataSeries$
  }),
  function MetricAwareAxis({ filteredDataSeries, axis, height, align }) {
    const scale = getAxisScale(axis, filteredDataSeries);
    if (scale && scale.allDataSeriesIgnored) {
      return <div style={{ width: `${WIDTH}px`, height: `${height || HEIGHT}px` }} />;
    }

    return (
      <VerticalAxis
        formatter={axis.formatter[0]}
        detailedFormatting={axis.detailedFormatting}
        scale={scale}
        align={align}
        height={height}
      />
    );
  }
);

function getAxisScale(axis, filteredDataSeries) {
  const { minValue, maxValue, allDataSeriesIgnored } = getAxisMinMax(axis, filteredDataSeries);
  return { from: minValue, to: maxValue, allDataSeriesIgnored };
}
