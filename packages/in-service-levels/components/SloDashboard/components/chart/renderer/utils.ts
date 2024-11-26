/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { RenderConfig } from 'in-components/Chart/renderer/types';

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
