/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

import { RenderConfig } from 'in-components/Chart/renderer/types';
import { ScaleType } from 'in-services/scale';

export default function axis(config: RenderConfig): void {
  const backBufferCtx = config.backBufferCtx;
  backBufferCtx.save();
  backBufferCtx.globalCompositeOperation = 'multiply';

  backBufferCtx.fillStyle = themes.default.ids.color.option.neutral['300'];
  backBufferCtx.beginPath();

  // @ts-expect-error scales is not yet defined on config
  drawTickPositionsForAxis(config.scales.y1);
  // @ts-expect-error scales is not yet defined on config
  drawTickPositionsForAxis(config.scales.y2);

  backBufferCtx.fill();
  backBufferCtx.restore();

  function drawTickPositionsForAxis(axis: ScaleType): void {
    if (!axis) {
      return;
    }

    const tickPositions = axis.tickPositions ?? [];
    for (let i = 0; i < tickPositions?.length; i++) {
      const tick = tickPositions[i];
      backBufferCtx.rect(
        config.xScaleBackBuffer.getRangeFrom(),
        tick.range,
        config.xScaleBackBuffer.getRangeTo() - config.xScaleBackBuffer.getRangeFrom(),
        1
      );
    }
  }
}
