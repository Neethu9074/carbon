/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// TODO: this is very likely incomplete
import { ScaleType } from 'in-services/scale';

export interface RenderConfig {
  xScaleBackBuffer: ScaleType;
  backBufferCtx: CanvasRenderingContext2D;
}

export interface RenderArguments {
  dataSeries: [number, number][];
  color: string;
  scale: ScaleType;
  config: RenderConfig;

  minSpaceBetweenPoints?: number;
}
