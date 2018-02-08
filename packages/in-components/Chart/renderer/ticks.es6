import { formatDateShort, formatTime } from 'in-services/formatters/date';
import theme from 'in-themes';

// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
const smallerAxisFont = `9px ${theme.fontFamilySansSerif}`;
const axisFont = `10px ${theme.fontFamilySansSerif}`;
const TICK_LINE_WIDTH_IN_PX = 4;
const axisFontColor = '#aaa';
const axisFontColorDark = '#555';
const tickColor = '#ddd';

export default function ticks(config) {
  const ctx = config.ctx;

  ctx.fillStyle = axisFontColor;
  ctx.beginPath();

  drawXAxisText();
  config.clearLeftOverdraw();
  config.clearRightOverdraw();

  drawYAxisText('y1', config.scales.x.getRangeFrom() - TICK_LINE_WIDTH_IN_PX, -2, 'right');
  drawYAxisText('y2', config.scales.x.getRangeTo(), TICK_LINE_WIDTH_IN_PX + 2, 'left');

  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = tickColor;

  drawXAxis();
  drawYAxis('y1', config.scales.x.getRangeFrom() - TICK_LINE_WIDTH_IN_PX);
  drawYAxis('y2', config.scales.x.getRangeTo());

  ctx.fill();

  function drawXAxis() {
    for (let i = 0; i < config.scales.x.tickPositions.length; i++) {
      const tick = config.scales.x.tickPositions[i];
      const xPos = tick.range;

      ctx.rect(xPos, config.scales.y1.getRangeFrom(), 1, TICK_LINE_WIDTH_IN_PX);
    }
  }

  function drawYAxis(axisName, xPos) {
    if (!config.scales[axisName]) {
      return;
    }
    for (let i = 0; i < config.scales[axisName].tickPositions.length; i++) {
      const tick = config.scales[axisName].tickPositions[i];
      ctx.rect(xPos, tick.range, TICK_LINE_WIDTH_IN_PX, 1);
    }
  }

  function drawXAxisText() {
    for (let i = 0; i < config.scales.x.tickPositions.length; i++) {
      const tick = config.scales.x.tickPositions[i];
      const xPos = tick.range;

      drawText(
        formatTime(tick.domain),
        xPos,
        config.scales.y1.getRangeFrom() + 6,
        'center',
        axisFontColorDark,
        axisFont
      );
      drawText(
        formatDateShort(tick.domain),
        xPos,
        config.scales.y1.getRangeFrom() + 16,
        'center',
        axisFontColor,
        smallerAxisFont
      );
    }
  }

  function drawYAxisText(axisName, xPos, textOffset, alignment) {
    if (!config.scales[axisName]) {
      return;
    }
    for (let i = 0; i < config.scales[axisName].tickPositions.length; i++) {
      const tick = config.scales[axisName].tickPositions[i];

      drawText(
        config[axisName].formatter.compact(tick.domain),
        xPos + textOffset,
        tick.range,
        alignment,
        axisFontColor,
        axisFontColor
      );
    }
  }

  function drawText(text, x, y, alignment, fillStyle, font) {
    ctx.textAlign = alignment;
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.fillText(text, x, y + 8);
  }
}
