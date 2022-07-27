/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import VerticalAxis, { HEIGHT as verticalAxisHeight } from 'in-components/Axis/VerticalAxis';
import { AxisName, Chart } from 'in-components/Chart/types';
import { AxisAlign, AxisScale } from 'in-components/Axis';

interface MetricAwareAxisProps {
  chart: Chart;
  axisName: AxisName;
  align: AxisAlign;

  height?: number;
}

export default function MetricAwareAxis({ chart, axisName, height, align }: MetricAwareAxisProps) {
  const filteredDataSeries = useObservable(() => chart.config.filteredDataSeries$, [chart]);
  const axis$ = axisName === 'y1' ? chart.config.y1$ : chart.config.y2$;
  const axis = useObservable(axis$, [chart, axisName]);

  if (!axis) {
    // When a chart is drawn with y1 and y2 for a while in live mode and then y2 is removed from the chart config, the
    // second MetricAwareAxis seems to get disposed too late and we try to render a MetricAwareAxis for which there is
    // no corresponding axis in the config for one render cycle.
    return null;
  }

  if (!axis.labels || axis.labels.filter((_v, i) => !filteredDataSeries?.has(`${axisName}-${i}`)).length == 0) {
    return <div style={{ minWidth: 0, height: `${height || verticalAxisHeight}px` }} />;
  }

  const scale: AxisScale = { from: axis.minValue!, to: axis.maxValue! };

  return (
    <VerticalAxis
      formatter={axis.formatter[0]}
      detailedFormatting={axis.detailedFormatting}
      scale={scale}
      tickPositions={get(chart, ['config', 'scales', axisName, 'tickPositions'])}
      align={align}
      height={height}
      renderAllTickLabels={axis.renderAllTickLabels}
    />
  );
}
