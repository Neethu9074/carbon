const y = 111;

export default function createChangeEventRenderer(basicEventRenderer, ctx) {
  return {
    draw
  };

  function draw(event, isHighlighted) {
    const drawConfig = basicEventRenderer.draw(event, isHighlighted, y);
    if (drawConfig) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawConfig.x, y + 10, 2, 18);
    }
  }
}
