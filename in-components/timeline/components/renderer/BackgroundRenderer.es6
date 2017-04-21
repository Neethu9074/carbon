export default function createBackgroundRenderer(ctx, scale, height) {
  let width = 0;

  return {
    draw,
    setWidth
  };

  function setWidth(_width) {
    width = _width;
  }

  function draw() {
    // fill whole canvas with color of lines
    ctx.fillStyle = '#43565E';
    ctx.fillRect(0, 0, width, height);

    // fill the rest of the canvas with the actual background color
    ctx.fillStyle = '#2D4048';
    ctx.fillRect(0, 0, width, 36);
    ctx.fillRect(0, 37, width, 36);
    ctx.fillRect(0, 74, width, 36);
    ctx.fillRect(0, 111, width, 36);
  }
}
