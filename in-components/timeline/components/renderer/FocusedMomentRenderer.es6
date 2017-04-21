import { focusedMomentXPosition$ } from 'in-components/timeline/timelineStore';

const color = '#9fffff';

export default function createFocusedMomentRenderer(ctx) {
  let x = null;
  const focusedMomentXPositionSubscription = focusedMomentXPosition$.subscribe(_x => x = _x);

  return {
    draw,
    dispose
  };

  function draw() {
    // draw line
    ctx.fillStyle = color;

    ctx.globalAlpha = 0.2;
    ctx.fillRect(x, 40, 1, 160);
    ctx.globalAlpha = 1;
  }

  function dispose() {
    focusedMomentXPositionSubscription.dispose();
  }
}
