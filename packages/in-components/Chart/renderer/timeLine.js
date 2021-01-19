/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';

import { formatTime, formatDateShort } from 'in-services/formatters/date';

const axisFontColor = theme.lib.colors.N800Dark;
const dayAxisFontColor = theme.lib.colors.N900Primary;
// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
const axisFont = `10px ${theme.fontFamilySansSerif}`;
const dayAxisFont = `9px ${theme.fontFamilySansSerif}`;
let timeLabelWidth;

export default function axis(config, tickPositions) {
  const { backBufferCtx: ctx } = config;

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = theme.lib.colors.N300;

  drawLine(config);
  drawTicks(tickPositions, config);

  ctx.fill();
  ctx.restore();
}

function drawLine(config) {
  const { backBufferCtx: ctx, height, timeAxisHeight, backBufferWidth } = config;
  const timeLineTop = height - timeAxisHeight;
  ctx.rect(0, timeLineTop, backBufferWidth, 1);
}

function drawTicks(tickPositions, config) {
  const { backBufferCtx: ctx, xScaleBackBuffer, bufferOffsetInPx, height, timeAxisHeight, backBufferWidth } = config;

  if (!tickPositions || tickPositions.length === 0) {
    return;
  }

  if (!timeLabelWidth) {
    timeLabelWidth = ctx.measureText('00:00:00').width;
  }

  tickPositions = tickPositions
    .map(tick => ({
      xPos: xScaleBackBuffer.getRange(tick),
      tick
    }))
    .filter(({ xPos }) => xPos + bufferOffsetInPx >= 0);

  const timeLineTop = height - timeAxisHeight;

  let dateLabel;
  for (let i = 0; i < tickPositions.length; i++) {
    let { xPos, tick } = tickPositions[i];
    const timeLabel = formatTime(tick);
    const currentDateLabel = formatDateShort(tick);
    if (i === tickPositions.length - 1) {
      xPos -= 1;
    }

    ctx.textAlign = calculateTextAlign(xPos, timeLabelWidth, backBufferWidth, bufferOffsetInPx);

    renderTickLine(ctx, xPos, timeLineTop);
    renderTimeLabel(ctx, timeLabel, xPos, timeLineTop);

    if (currentDateLabel !== dateLabel) {
      renderDateLabel(ctx, currentDateLabel, xPos, timeLineTop);
      dateLabel = currentDateLabel;
    }
  }
}

function renderTickLine(ctx, xPos, timeLineTop) {
  ctx.fillStyle = theme.lib.colors.N300;
  ctx.rect(xPos, timeLineTop, 1, 6);
}

function renderTimeLabel(ctx, label, xPos, timeLineTop) {
  ctx.font = axisFont;
  ctx.fillStyle = axisFontColor;
  ctx.fillText(label, xPos, timeLineTop + 17);
}

function renderDateLabel(ctx, label, xPos, timeLineTop) {
  ctx.font = dayAxisFont;
  ctx.fillStyle = dayAxisFontColor;
  ctx.fillText(label, xPos, timeLineTop + 28);
}

function calculateTextAlign(xPos, textWidth, chartWidth, offset) {
  if (xPos - offset - textWidth / 2 < 0) {
    return 'left';
  }
  if (xPos + offset + textWidth / 2 > chartWidth) {
    return 'right';
  }
  return 'center';
}
