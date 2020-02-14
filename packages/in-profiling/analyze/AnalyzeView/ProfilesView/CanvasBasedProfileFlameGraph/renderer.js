import theme from 'in-themes';

import { updateCanvasDimensions } from 'in-components/Chart/canvas';

const axisFont = `10px ${theme.fontFamilySansSerif}`;

export default function render(canvas, { layers, totalWidth, totalHeight }, selfTimeHighlighted, selectedNode) {
  const ctx = canvas.getContext('2d');
  updateCanvasDimensions(canvas, ctx, totalWidth, totalHeight);

  ctx.beginPath();
  const layerIterator = layers.values();
  for (const layer of layerIterator) {
    renderLayer(layer);
  }
  ctx.fill();

  function renderLayer(layerNodes) {
    for (let i = 0; i < layerNodes.length; i++) {
      const node = layerNodes[i];

      if (node.s_x + node.s_width < 0 || node.s_x > totalWidth) {
        continue;
      }

      drawRect(node);
      drawText(node);
    }
  }

  function drawRect(node) {
    const { s_x, y, s_width, height, value, highlighted, selfValue } = node;
    ctx.fillStyle = '#fff';
    ctx.fillRect(s_x, y, s_width, height);
    if (node === selectedNode) {
      ctx.fillStyle = theme.lib.colors.fadedBlue800;
      ctx.fillRect(s_x, y, Math.max(0, s_width - 1), height - 1);
    } else if (selfTimeHighlighted && !highlighted) {
      const valueSelfValueRatio = selfValue / value;
      const width = Math.max(0, s_width - 1);
      const selfValueWidth = valueSelfValueRatio * width;
      const valueWidth = width - selfValueWidth;
      ctx.fillStyle = theme.lib.colors.N400;
      ctx.fillRect(s_x, y, valueWidth, height - 1);
      ctx.fillStyle = node.color;
      ctx.fillRect(s_x + valueWidth, y, selfValueWidth, height - 1);
    } else {
      ctx.fillStyle = node.color;
      ctx.fillRect(s_x, y, Math.max(0, s_width - 1), height - 1);
    }
  }

  function drawText({ name: textToRender, s_x, y, s_width }) {
    ctx.font = axisFont;
    ctx.fillStyle = theme.lib.colors.N900Primary;

    let text = '';
    let textWidth = 0;
    for (let i = 0; i < textToRender.length; i++) {
      const char = textToRender[i];
      const chartWidth = ctx.measureText(char).width;
      if (textWidth + chartWidth > s_width - 2) {
        break;
      }
      text += char;
      textWidth += chartWidth;
    }

    if (text.length > 3) {
      ctx.fillText(text, s_x + 1, y + 11);
    }
  }
}
