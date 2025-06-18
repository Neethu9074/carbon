/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { CorrectionWithConfiguration } from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionWindows';
import { RenderConfig } from 'in-components/Chart/renderer/types';
import { MetricDataSeries } from 'in-components/Chart/types';

export type Vertex = [number, number];

export function drawLines(lineVertices: Vertex[], config: RenderConfig) {
  const startVertex = lineVertices[0];
  config.backBufferCtx.moveTo(startVertex[0], startVertex[1]);
  for (let i = 1; i < lineVertices.length; i++) {
    const thisVertex = lineVertices[i];
    config.backBufferCtx.lineTo(thisVertex[0], thisVertex[1]);
  }
}

export function fillBackground(lineVertices: Vertex[], config: RenderConfig, color: string, height: number): void {
  const startVertex = lineVertices[0];
  const endVertex = lineVertices[lineVertices.length - 1];

  config.backBufferCtx.save();
  config.backBufferCtx.beginPath();
  config.backBufferCtx.fillStyle = color;
  config.backBufferCtx.globalAlpha = 0.25;
  drawLines(lineVertices, config);
  config.backBufferCtx.lineTo(endVertex[0], height);
  config.backBufferCtx.lineTo(startVertex[0], height);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
  config.backBufferCtx.restore();
}

export function getLineWidth(config: RenderConfig) {
  return config.y1?.lineWidth ?? 2;
}

export function getCorrectionWindowMetrics(
  correctiondata: CorrectionWithConfiguration | undefined
): MetricDataSeries | undefined {
  const correctionWindows = correctiondata?.correction?.correctionWindows;
  if (!correctionWindows) {
    return undefined;
  }
  const sorted = [...correctionWindows].flat().sort((a, b) => a.from! - b.from!);
  if (sorted.length === 0) {
    return [];
  }
  const result: MetricDataSeries = [];
  let [currentFrom, currentTo] = [sorted[0].from!, sorted[0].to!];

  for (let i = 1; i < sorted.length; i++) {
    const { from, to } = sorted[i];
    if (from! <= currentTo) {
      // Overlap → extend the current range
      currentTo = Math.max(currentTo, to!);
    } else {
      // No overlap → push current and start new
      result.push([currentFrom, -Infinity], [currentTo, -Infinity]);
      [currentFrom, currentTo] = [from!, to!];
    }
  }

  // Push the final range
  result.push([currentFrom, -Infinity], [currentTo, -Infinity]);
  return result;
}
