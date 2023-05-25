/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  renderMissingDataIndicator,
  timeWindowIncludesFirstCollectionTimestamp
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { RenderConfig, RenderProps, Renderer } from 'in-components/Chart/renderer/types';
import { drawPoint } from 'in-components/Chart/renderer/point';
import { ScaleType } from 'in-services/scale';

export const hourlyBudgetMetricId = 'hourlyBudget';

type Vertex = [number, number];

type MetricId = string | 'default';
interface MetricConfig {
  fillTopBackground?: boolean;
}
interface UseStairwayRendererProps {
  /**
   * Timestamp at which data collection for the rendered metrics has started.
   * If this timestamp is within the rendered time window the chart will be greyed out up to this timestamp.
   */
  firstCollectedMetricTimestamp?: number;

  metricConfiguration?: Record<MetricId, MetricConfig>;
}

function createStairwayRenderer({
  firstCollectedMetricTimestamp = 0,
  metricConfiguration
}: UseStairwayRendererProps): Renderer {
  return {
    id: 'stairway',
    render: ({ color, scale, config, dataSeries, metricId }: RenderProps) => {
      if (!dataSeries || dataSeries.length === 0) {
        return;
      }

      if (dataSeries.length === 1) {
        // only draw a dot if just a single data point is available
        const dataPoint = dataSeries[0];
        const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
        const posY = scale.getRange(dataPoint[1]);
        config.backBufferCtx.beginPath();
        drawPoint(config, posX, posY, color);
        config.backBufferCtx.stroke();
        return;
      }

      const lineWidth = getLineWidth(config);
      const isStaticBudget = config.y1?.isStaticBudget ?? false;
      const markerPaneHeight = config.markerPaneHeight;

      // we want to shift the metric half a "bucket" to the left, to that the plateau is in the middle
      const stepDelta =
        config.xScaleBackBuffer.getRange(dataSeries[1][0]) - config.xScaleBackBuffer.getRange(dataSeries[0][0]);
      const shiftX = stepDelta / 2.0;

      const lineVertices: Vertex[] = generateVertices(dataSeries, config, isStaticBudget, scale, stepDelta, shiftX);

      config.backBufferCtx.beginPath();
      config.backBufferCtx.strokeStyle = color;
      config.backBufferCtx.lineWidth = lineWidth;
      drawLines(lineVertices, config);
      config.backBufferCtx.stroke();

      if (metricConfiguration?.[metricId ?? 'default']?.fillTopBackground) {
        fillTopBackground(lineVertices, config, color, markerPaneHeight);
      }

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }
    }
  };
}

function generateVertices(
  dataSeries: [number, number][],
  config: RenderConfig,
  isStaticBudget: boolean,
  scale: ScaleType,
  stepDelta: number,
  shiftX: number
): Vertex[] {
  const lineVertices: Vertex[] = [];
  let previousPosY: number | undefined = undefined;

  // extend first value by half a bucket
  const firstDataPoint = dataSeries[0];
  const firstPosX = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
  if (isStaticBudget) {
    // extend first value as is
    const posY = scale.getRange(firstDataPoint[1]);
    lineVertices.push([firstPosX - stepDelta, posY]);
  } else {
    // extend fist value as new zero-step if the budget is hourly changing
    const posY = scale.getRange(0);
    lineVertices.push([firstPosX - stepDelta, posY]);
    lineVertices.push([firstPosX - shiftX, posY]);
  }

  dataSeries.forEach(dataPoint => {
    if (!dataPoint) {
      return;
    }

    const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
    const posY = scale.getRange(dataPoint[1]);
    if (previousPosY) {
      lineVertices.push([posX - shiftX, previousPosY]);
    }
    lineVertices.push([posX - shiftX, posY]);

    previousPosY = posY;
  });

  // extend last value by a bucket
  const posX = config.xScaleBackBuffer.getRange(dataSeries[dataSeries.length - 1][0]);
  lineVertices.push([posX + shiftX, previousPosY!]);

  return lineVertices;
}

export function getLineWidth(config: RenderConfig) {
  return config.y1?.lineWidth ?? 2;
}

function drawLines(lineVertices: Vertex[], config: RenderConfig) {
  const startVertex = lineVertices[0];
  config.backBufferCtx.moveTo(startVertex[0], startVertex[1]);
  for (let i = 1; i < lineVertices.length; i++) {
    const thisVertex = lineVertices[i];
    config.backBufferCtx.lineTo(thisVertex[0], thisVertex[1]);
  }
}

function fillTopBackground(
  lineVertices: Vertex[],
  config: RenderConfig,
  color: string,
  markerPaneHeight: number
): void {
  const startVertex = lineVertices[0];
  const endVertex = lineVertices[lineVertices.length - 1];

  // background are above
  config.backBufferCtx.save();
  config.backBufferCtx.beginPath();
  config.backBufferCtx.fillStyle = color;
  config.backBufferCtx.globalAlpha = 0.25;
  drawLines(lineVertices, config);
  config.backBufferCtx.lineTo(endVertex[0], markerPaneHeight);
  config.backBufferCtx.lineTo(startVertex[0], markerPaneHeight);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
  config.backBufferCtx.restore();
}

export default createStairwayRenderer({});
export function useStairwayRenderer(props: UseStairwayRendererProps) {
  return createStairwayRenderer(props);
}
