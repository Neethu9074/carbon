import theme from 'in-themes';

import { formatTime, formatDateShort } from 'in-services/formatters/date';

const axisFontColor = '#2d4048';
const softerAxisFontColor = '#8c969a';
// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
const axisFont = `10px ${theme.fontFamilySansSerif}`;
const smallerAxisFont = `9px ${theme.fontFamilySansSerif}`;

export default function axis(config, tickPositions) {
  if (!tickPositions) {
    return;
  }
  const timeLineTop = config.height - config.timeAxisHeight;

  config.backBufferCtx.beginPath();
  config.backBufferCtx.fillStyle = theme.lib.colors.N300;
  config.backBufferCtx.rect(0, timeLineTop, config.backBufferWidth, 1);

  for (let i = 0; i < tickPositions.length; i++) {
    const tickPosition = tickPositions[i];
    const xPos = config.scales.xBackBuffer.getRange(tickPosition);

    config.backBufferCtx.fillStyle = theme.lib.colors.N300;
    config.backBufferCtx.rect(xPos, timeLineTop, 1, 6);

    config.backBufferCtx.font = axisFont;
    config.backBufferCtx.fillStyle = axisFontColor;
    config.backBufferCtx.fillText(formatTime(tickPosition), xPos - 20, timeLineTop + 17);
    config.backBufferCtx.font = smallerAxisFont;
    config.backBufferCtx.fillStyle = softerAxisFontColor;
    config.backBufferCtx.fillText(formatDateShort(tickPosition), xPos - 13, timeLineTop + 28);
  }

  config.backBufferCtx.fill();
}
