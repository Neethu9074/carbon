/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Axis, AxisColor, AxisConfiguration, AxisName, Config, MetricDataSeries } from 'in-components/Chart/types';
import Configuration from 'in-components/Chart/Configuration';
import { ScaleType } from 'in-services/scale';

// TODO: this is very likely incomplete
// Please add types carefully, as it might affect other existing renderer code easily.

export type DataSeries = [number, number][];

export interface RenderConfig extends Config {
  xScaleBackBuffer: ScaleType;
  backBufferCtx: CanvasRenderingContext2D;

  markerPaneHeight: number;
  timeAxisHeight: number;
  height: number;
  width: number;

  y1: RenderAxis;
}

export interface RenderAxis extends AxisConfiguration {
  lineWidth?: number;
}

export interface RenderProps {
  dataSeries: DataSeries;
  color: string;
  scale: ScaleType;
  config: RenderConfig;

  metricId?: string;
}

type BaseProps = Omit<RenderProps, 'dataSeries' | 'color' | 'metricId'>;

/**
 * This type defines the interface for Renderer used in the Chart component, when the rendering more than
 * one datasource.
 * This is the cases, when the axis configuration has `valuesNeedToBeStacked`, `valuesDependOnEachOther` or `manualRenderLoop`,
 * typically configured in the renderer's enrich() function.
 *
 * Short discussion: https://github.ibm.com/instana/ui-client/pull/9813/files/ce9044387a04401d29eec8805781f1cf20876147#r6390765
 */
export interface MultiMetricRenderProps extends BaseProps {
  colors50: AxisColor[];
  colors100: AxisColor[];
  metrics: MetricDataSeries[];
  axisName: AxisName;
  axis: AxisConfiguration;
  metricIds: string[];
  colors: AxisColor[];
  /*
  Unused parameters:
  To have a slim interface, they are not part of the interface yet, even
  while they are part of the invocation in render({...})
  (adding is always easier than removing)

  Add them if used and needed by any renderer:
  axis,
  metricIds,
  colors
 */
}

export interface Renderer<RENDER_PROPS extends RenderProps | MultiMetricRenderProps = RenderProps> {
  id?: string;
  render: (args: RENDER_PROPS) => void;
  enrich?: (config: Configuration, axis: Axis) => void;
}
