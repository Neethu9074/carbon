import { formatDateShort, formatTime } from 'in-services/formatters/date';
import theme from 'in-themes';

// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
const smallerAxisFont = `9px ${theme.fontFamilySansSerif}`;
const axisFont = `11px ${theme.fontFamilySansSerif}`;
const tickColor = '#ddd';

export default function ticks(config) {
  const ctx = config.ctx;

  ctx.beginPath();

  drawXAxisText();
  config.clearLeftOverdraw();
  config.clearRightOverdraw();

  drawYAxisText('y1', config.scales.x.getRangeFrom(), -5, 'right');
  drawYAxisText('y2', config.scales.x.getRangeTo(), 5, 'left');

  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = tickColor;

  drawXAxis();

  ctx.fill();

  function drawXAxis() {
    for (let i = 0; i < config.scales.x.tickPositions.length; i++) {
      const tick = config.scales.x.tickPositions[i];
      const xPos = tick.range;

      ctx.rect(xPos, config.scales.y1.getRangeFrom(), 1, 4);
    }
  }

  function drawXAxisText() {
    for (let i = 0; i < config.scales.x.tickPositions.length; i++) {
      const tick = config.scales.x.tickPositions[i];
      const xPos = tick.range;

      drawText(formatTime(tick.domain), xPos, config.scales.y1.getRangeFrom() + 6, 'left', '#7F949D', axisFont);
      drawText(
        formatDateShort(tick.domain),
        xPos,
        config.scales.y1.getRangeFrom() + 16,
        'left',
        '#7F949D',
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
        config[axisName].formatter[0].compact(tick.domain),
        xPos + textOffset,
        tick.range,
        alignment,
        '#16363e',
        axisFont
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
