/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Config } from 'in-components/Chart/ResultAwareChart.d';
import { ScaleType } from 'in-services/scale';

// TODO: this is very likely incomplete

export type DataSeries = [number, number][];

export interface RenderConfig extends Config {
  xScaleBackBuffer: ScaleType;
  backBufferCtx: CanvasRenderingContext2D;

  markerPaneHeight: number;
}

export interface RenderProps {
  dataSeries: DataSeries;
  color: string;
  scale: ScaleType;
  config: RenderConfig;

  metricId?: string;
}
