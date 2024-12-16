/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { themes } from '@instana/design-tokens';
import { TimeConfig } from '@instana/types';

import { getLineWidth } from 'in-service-levels/components/SloDashboard/components/chart/renderer/utils';
import { RenderConfig } from 'in-components/Chart/renderer/types';

export function timeWindowIncludesFirstCollectionTimestamp(
  firstCollectionTimestamp: number,
  timeConfig?: TimeConfig
): boolean {
  const start = (timeConfig?.to ?? 0) - (timeConfig?.windowSize ?? 0);
  return start < firstCollectionTimestamp;
}

export function renderMissingDataIndicator(config: RenderConfig, endTimestamp: number) {
  config.backBufferCtx.save();

  config.backBufferCtx.fillStyle = themes.default.ids.color.option.neutral[300];

  const borderWidth = getLineWidth(config) * 0.5;
  const endX = config.xScaleBackBuffer.getRange(endTimestamp);
  const startY = config.markerPaneHeight - borderWidth;
  const height = config.height - config.markerPaneHeight - config.timeAxisHeight + borderWidth;
  // Set globalAlpha to 0.25 for better transparency
  config.backBufferCtx.globalAlpha = 0.25;
  config.backBufferCtx.fillRect(0, startY, endX, height);
  config.backBufferCtx.lineTo(0, endX);

  config.backBufferCtx.restore();
}
