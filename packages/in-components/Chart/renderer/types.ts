/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Config, AxisConfiguration, Axis } from 'in-components/Chart/types';
import Configuration from 'in-components/Chart/Configuration';
import { ScaleType } from 'in-services/scale';

// TODO: this is very likely incomplete

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
  isStaticBudget?: boolean;
  lineWidth?: number;
}

export interface RenderProps {
  dataSeries: DataSeries;
  color: string;
  scale: ScaleType;
  config: RenderConfig;

  metricId?: string;
}

export interface Renderer {
  id?: string;
  render: (args: RenderProps) => void;
  enrich?: (config: Configuration, axis: Axis) => void;
}
