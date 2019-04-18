import React from 'react';

import VerticalAxis, { WIDTH, HEIGHT } from 'in-new-components/Axis/VerticalAxis';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.filteredDataSeries$
  }),
  function MetricAwareAxis({ axis, height, align }) {
    const scale = { from: axis.minValue, to: axis.maxValue, allDataSeriesIgnored: axis.allDataSeriesIgnored };

    if (scale && scale.allDataSeriesIgnored) {
      return <div style={{ minWidth: `${WIDTH}px`, height: `${height || HEIGHT}px` }} />;
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
