import icons from 'in-components/SvgIcon/registry.json';
import theme from 'in-themes';

let path = null;

export default {
  render: (events, { scales, backBufferCtx, markerPaneHeight, timeAxisHeight, height }) => {
    if (!events || events.length === 0) {
      return;
    }

    if (!path) {
      path = new Path2D(icons.lib_release_rocket.path);
    }

    const from = markerPaneHeight;
    const to = height - timeAxisHeight;
    const iconSize = 24;

    backBufferCtx.save();
    backBufferCtx.lineWidth = 2;
    backBufferCtx.setLineDash([6, 6]);

    function renderLines(offset = 0) {
      backBufferCtx.beginPath();
      for (let i = 0; i < events.length; i++) {
        const xPos = scales.xBackBuffer.getRange(events[i].start);
        backBufferCtx.moveTo(xPos + offset, to + offset);
        backBufferCtx.lineTo(xPos + offset, from + offset);
      }
      backBufferCtx.closePath();
      backBufferCtx.stroke();
    }

    backBufferCtx.strokeStyle = '#fff';
    renderLines(1);
    backBufferCtx.strokeStyle = theme.lib.colors.N500;
    renderLines();

    backBufferCtx.beginPath();
    for (let i = 0; i < events.length; i++) {
      const xPos = scales.xBackBuffer.getRange(events[i].start);
      backBufferCtx.strokeStyle = theme.lib.colors.N500;
      backBufferCtx.moveTo(xPos, to);
      backBufferCtx.lineTo(xPos, from);
    }
    backBufferCtx.closePath();
    backBufferCtx.stroke();

    backBufferCtx.fillStyle = theme.lib.colors.N500;

    // move icons directly to the border of the canvas. 24px icons have 4px of padding which can be substracted
    backBufferCtx.translate(0, -4);

    for (let i = 0; i < events.length; i++) {
      const xPos = scales.xBackBuffer.getRange(events[i].start) - iconSize / 2;
      backBufferCtx.translate(xPos, 0);
      backBufferCtx.fill(path);
      backBufferCtx.translate(-xPos, 0);
    }
    backBufferCtx.restore();
  }
};
