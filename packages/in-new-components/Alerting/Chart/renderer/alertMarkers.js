import theme from 'in-themes';

import icons from 'in-components/SvgIcon/registry.json';

let path = null;

export default {
  render: (events, { scales, backBufferCtx }) => {
    if (!events || events.length === 0) {
      return;
    }

    if (!path) {
      path = new Path2D(icons.lib_events_warning.path);
    }

    const iconSize = 24;

    backBufferCtx.save();

    backBufferCtx.fillStyle = theme.lib.colors.red800;

    backBufferCtx.translate(0, 2);

    for (let i = 0; i < events.length; i++) {
      const xPos = scales.xBackBuffer.getRange(events[i][0]) - iconSize / 2;
      backBufferCtx.translate(xPos, 0);
      backBufferCtx.fill(path);
      backBufferCtx.translate(-xPos, 0);
    }

    backBufferCtx.restore();
  }
};
