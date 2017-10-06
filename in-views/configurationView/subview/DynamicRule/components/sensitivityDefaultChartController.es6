import { updateCanvasDimensions } from 'in-charts/canvas';

export default function createController(canvas) {
  const ctx = canvas.getContext('2d');

  let sensitivity = 100;
  let width = 0;
  let height = 0;

  return {
    update
  };

  function update(_sensitivity, _width, _height) {
    sensitivity = _sensitivity;
    width = _width;
    height = _height;

    updateCanvasDimensions(canvas, ctx, width, height, 1);

    render();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(0, 0, 0, ${sensitivity / 100})`;
    ctx.rect(0, 0, width, height + 20);
    ctx.fill();
  }
}
