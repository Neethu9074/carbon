/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  renderMissingDataIndicator,
  timeWindowIncludesFirstCollectionTimestamp
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { RenderConfig, RenderProps, Renderer as RendererType } from 'in-components/Chart/renderer/types';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { lighten } from 'in-services/formatters/color';
import { ScaleType } from 'in-services/scale';
import theme from 'in-themes';

const backgroundOpacity = 0.15;

type ApdexAreas = readonly [0, number, number, 1];

export default function useApdexLineRenderer(
  [frustrated, tolerated, satisfied, end]: ApdexAreas,
  firstCollectedMetricTimestamp = 0
): RendererType {
  return {
    id: 'apdexLine',
    render: (props: RenderProps): void => {
      const { scale, config } = props;

      config.backBufferCtx.save();

      [
        { from: frustrated, to: tolerated, color: lighten(theme.lib.colors.red800, backgroundOpacity) },
        { from: tolerated, to: satisfied, color: lighten(theme.lib.colors.orange800, backgroundOpacity) },
        { from: satisfied, to: end, color: lighten(theme.lib.colors.green800, backgroundOpacity) }
      ].forEach(area => drawBackgroundArea(area, scale, config));

      config.backBufferCtx.restore();

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }

      Renderer.line.render?.({
        ...props,
        dataSeries: props.dataSeries.filter(([timestamp]) => timestamp >= firstCollectedMetricTimestamp)
      });
    }
  };
}

interface BackgroundArea {
  from: number;
  to: number;
  color: string;
}

function drawBackgroundArea({ from, to, color }: BackgroundArea, yScale: ScaleType, config: RenderConfig): void {
  const { backBufferCtx: ctx, width } = config;

  const y = yScale.getRange(from);
  const height = yScale.getRange(to) - y;
  const x = 0;

  ctx.lineWidth = 0;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
