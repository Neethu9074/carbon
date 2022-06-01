/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error modules is not yet migrated to typescript
import line from 'in-components/Chart/renderer/line';
import { renderHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { RenderAxis, RenderConfig } from 'in-components/Chart/renderer/types';
import { AxisColor, MetricDataSeries } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale';

export default {
  render: ({
    colors50,
    colors100,
    scale,
    config,
    metrics
  }: {
    colors50: AxisColor[];
    colors100: AxisColor[];
    scale: ScaleType;
    config: RenderConfig;
    metrics: MetricDataSeries[];
  }): void => {
    const metric = metrics[0];

    renderHistoricBaseline(config, scale, colors50, colors100, metric);

    renderHighlight(config, scale);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
  },
  enrich: (_config: unknown, axis: RenderAxis) => {
    // @ts-expect-error field actually does not yet exist in Axis
    axis.valuesDependOnEachOther = true;
  }
} as const;

function renderHighlight(config: RenderConfig, scale: ScaleType): void {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer, y1 } = config;

  // @ts-expect-error field actually does not yet exist in Axis
  const { highlight } = y1;

  if (!highlight) {
    return;
  }

  const { area, color } = highlight as Highlight;

  if (!area) {
    return;
  }

  const { start, end } = area;

  if (start && end) {
    const chartHeight = scale.getRangeFrom();
    const height = chartHeight - markerPaneHeight;
    const y = markerPaneHeight;

    const startX = xScaleBackBuffer.getRange(start);
    const endX = xScaleBackBuffer.getRange(end);

    backBufferCtx.fillStyle = color[0];
    backBufferCtx.save();
    backBufferCtx.strokeStyle = color[1];
    backBufferCtx.lineWidth = 0.5;
    backBufferCtx.fillRect(startX, y, endX - startX, height);

    [startX, endX].forEach(x => {
      backBufferCtx.beginPath();
      backBufferCtx.moveTo(x, y);
      backBufferCtx.lineTo(x, y + height);
      backBufferCtx.stroke();
    });
    backBufferCtx.restore();
  }
}

interface Highlight {
  area?: {
    /** the start x coordinate (in the metrics x range) */
    start?: number;
    /** the end x coordinate (in the metrics x range) */
    end?: number;
  };
  /**
   * an array of color strings:
   * -Index 0 being the highlights fill color and
   * - index 1 being its border color.
   */
  color: string[];
  label: string;
}
