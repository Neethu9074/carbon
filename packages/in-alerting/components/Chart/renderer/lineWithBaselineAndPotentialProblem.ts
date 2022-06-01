/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { renderHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ colors50, colors100, scale, config, metrics }) => {
    const metric = metrics[0];

    renderHistoricBaseline(config, scale, colors50, colors100, metric);

    renderHighlight(config, scale);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0], scale, config });
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
  }
};

function renderHighlight(config, scale) {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer, y1 } = config;
  const { highlight } = y1;

  if (!highlight) {
    return;
  }

  const {
    area: { start, end },
    color
  } = highlight;

  const chartHeight = scale.getRangeFrom();
  const height = chartHeight - markerPaneHeight;
  const y = markerPaneHeight;

  if (start && end) {
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
