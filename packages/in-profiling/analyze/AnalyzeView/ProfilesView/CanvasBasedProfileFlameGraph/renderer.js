/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';

import { updateCanvasDimensions } from 'in-components/Chart/canvas';

const axisFont = `10px ${theme.fontFamilySansSerif}`;

export default function render(
  canvas,
  { layers, totalWidth, totalHeight },
  selfTimeHighlighted,
  selectedNode,
  threshold
) {
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

      if (node.percent < threshold || node.s_x + node.s_width < 0 || node.s_x > totalWidth) {
        continue;
      }

      drawRect(node);
      drawText(node);
    }
  }

  function drawRect(node) {
    const { highlighted } = node;
    const { s_x, y, s_width, height } = node;
    const isSelected = isEqual(node, selectedNode);

    ctx.fillStyle = '#fff';
    ctx.fillRect(s_x - 1, y - 1, s_width + 1, height + 1);

    if (selfTimeHighlighted && !highlighted) {
      colorSelfTime(node);
    } else {
      colorNode(node);
    }

    if (isSelected) {
      ctx.fillStyle = theme.lib.colors.blue800;
      ctx.fillRect(s_x, y - 1, s_width + 1, 1);
      ctx.fillRect(s_x, y - 1, 1, height);
      ctx.fillRect(s_x - 1 + s_width, y - 1, 1, height);
      ctx.fillRect(s_x, y - 2 + height, s_width + 1, 1);
    }
  }

  function colorNode(node, color) {
    const { s_x, y, s_width, height } = node;
    ctx.fillStyle = color || node.color;
    ctx.fillRect(s_x, y, Math.max(0, s_width - 1), height - 1);
  }

  function colorSelfTime(node) {
    const { s_x, y, s_width, height, value, selfTime } = node;

    const valueSelfTimeRatio = selfTime / value;
    const width = Math.max(0, s_width - 1);
    const selfTimeWidth = valueSelfTimeRatio * width;
    const valueWidth = width - selfTimeWidth;
    ctx.fillStyle = theme.lib.colors.N400;
    ctx.fillRect(s_x, y, valueWidth, height - 1);
    ctx.fillStyle = node.color;
    ctx.fillRect(s_x + valueWidth, y, selfTimeWidth, height - 1);
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

  function isEqual(n1, n2) {
    return n1 && n2 && n1.x === n2.x && n1.y === n2.y;
  }
}
