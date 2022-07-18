/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { AxisColor, AxisConfiguration, MetricDataSeries } from 'in-components/Chart/types';
import { Renderer, RenderProps } from 'in-components/Chart/renderer/types';

/**
 * This type defines the interface for Renderer used in the Chart component,
 * in the case, when the axis config has `valuesNeedToBeStacked`, `valuesDependOnEachOther` or `manualRenderLoop`
 */
export interface MultiMetricRenderProps extends Omit<RenderProps, 'dataSeries' | 'color' | 'metricId'> {
  axis: AxisConfiguration;

  colors50: AxisColor[];
  colors100: AxisColor[];
  metrics: MetricDataSeries[];

  metricIds: String[];
  colors: AxisColor[];
}

export interface MultiMetricRenderer extends Omit<Renderer, 'render'> {
  render: (props: MultiMetricRenderProps) => void;
}
