import { getColorByEvent } from 'in-stores/events';

const y = 111;

export default function createChangeEventRenderer(basicEventRenderer, ctx) {
  return {
    draw
  };

  function draw(event, isHighlighted) {
    const positions = basicEventRenderer.draw(event, isHighlighted, y);
    if (!positions) {
      return;
    }

    ctx.fillStyle = getColorByEvent(event);
    ctx.fillRect(positions.x, y + 10, 2, 18);
  }
}
