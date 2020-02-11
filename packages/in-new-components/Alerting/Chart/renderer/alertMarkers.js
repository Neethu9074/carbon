import theme from 'in-themes';

let path = null;

const alertIndicator16 =
  'M13.4317946,11.9821449 L8.56512795,3.31547821 C8.44356843,3.11933359 8.22921966,3 7.99846128,3 C7.7677029,3 7.55335413,3.11933359 7.43179461,3.31547821 L2.56512795,11.9821449 C2.44926364,12.1817066 2.44483931,12.4269949 2.55343149,12.6306052 C2.66202366,12.8342155 2.86818802,12.9671898 3.09846128,12.9821449 L12.8317946,12.9821449 C13.0740022,12.9904611 13.301645,12.8666817 13.4263332,12.658868 C13.5510213,12.4510543 13.5531125,12.1919439 13.4317946,11.9821449 Z M10.787023,10.9819478 L5.11019192,10.9819478 L7.94860745,5.97321731 L10.787023,10.9819478 Z';

export default {
  render: (events, { scales, backBufferCtx }) => {
    if (!events || events.length === 0) {
      return;
    }

    if (!path) {
      path = new Path2D(alertIndicator16);
    }

    const iconSize = 16;

    backBufferCtx.save();

    backBufferCtx.fillStyle = theme.lib.colors.red800;

    backBufferCtx.translate(0, 6);

    for (let i = 0; i < events.length; i++) {
      const xPos = scales.xBackBuffer.getRange(events[i][0]) - iconSize / 2;
      backBufferCtx.translate(xPos, 0);
      backBufferCtx.fill(path);
      backBufferCtx.translate(-xPos, 0);
    }

    backBufferCtx.restore();
  }
};
