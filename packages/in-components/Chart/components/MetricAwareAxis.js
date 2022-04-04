/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import VerticalAxis, { HEIGHT as verticalAxisHeight } from 'in-components/Axis/VerticalAxis';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    filteredDataSeries: props.chart.config.filteredDataSeries$
  }),
  function MetricAwareAxis({ chart, axisName, height, align, filteredDataSeries }) {
    const axis = chart.config[axisName];

    if (!axis) {
      // When a chart is drawn with y1 and y2 for a while in live mode and then y2 is removed from the chart config, the
      // second MetricAwareAxis seems to get disposed too late and we try to render a MetricAwareAxis for which there is
      // no corresponding axis in the config for one render cycle.
      return null;
    }

    if (!axis.labels || axis.labels.filter((v, i) => !filteredDataSeries.has(`${axisName}-${i}`)).length == 0) {
      return <div style={{ minWidth: 0, height: `${height || verticalAxisHeight}px` }} />;
    }

    const scale = { from: axis.minValue, to: axis.maxValue };

    return (
      <VerticalAxis
        formatter={axis.formatter[0]}
        detailedFormatting={axis.detailedFormatting}
        scale={scale}
        tickPositions={get(chart, ['config', 'scales', axisName, 'tickPositions'])}
        align={align}
        height={height}
      />
    );
  }
);
