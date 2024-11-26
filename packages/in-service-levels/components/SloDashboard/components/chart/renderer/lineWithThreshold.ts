/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  drawLines,
  fillBackground,
  getLineWidth,
  Vertex
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/utils';
import { DataSeries, RenderConfig, Renderer, RenderProps } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';
import { ScaleType } from 'in-services/scale';

export const thresholdMetricId = 'threshold';

type LineWithThresholdRenderProps = RenderProps & { isGreaterOp: boolean };

export const lineWithThreshold: Renderer<LineWithThresholdRenderProps> = {
  id: 'lineWithThreshold',
  render: ({ color, scale, config, dataSeries, metricId, isGreaterOp }: LineWithThresholdRenderProps) => {
    if (metricId === thresholdMetricId) {
      const thresholdLine = generateThresholdVertices(dataSeries, scale, config);

      config.backBufferCtx.beginPath();
      config.backBufferCtx.strokeStyle = color;
      config.backBufferCtx.lineWidth = getLineWidth(config);
      drawLines(thresholdLine, config);
      config.backBufferCtx.stroke();
      if (isGreaterOp) {
        fillBackground(thresholdLine, config, color, config.markerPaneHeight);
      } else {
        fillBackground(thresholdLine, config, color, config.height);
      }
    } else {
      renderer.line.render({ color, scale, config, dataSeries, metricId });
    }
  }
};

function generateThresholdVertices(dataSeries: DataSeries, scale: ScaleType, config: RenderConfig): Vertex[] {
  const threshold = dataSeries[0][1];
  const startX = config.xScaleBackBuffer.rangeFrom;
  const startY = scale.getRange(threshold);

  const endX = config.xScaleBackBuffer.rangeTo;
  const endY = scale.getRange(threshold);

  return [
    [startX, startY],
    [endX, endY]
  ];
}
