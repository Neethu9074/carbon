export default function createBorderRenderer(config) {
  const ctx = config.ctx.staticScreen;

  return {
    render
  };

  function render() {
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.moveTo(config.bounds.left, config.bounds.top);
    ctx.lineTo(config.bounds.right, config.bounds.top);
    ctx.lineTo(config.bounds.right, config.bounds.bottom);
    ctx.lineTo(config.bounds.left, config.bounds.bottom);
    ctx.lineTo(config.bounds.left, config.bounds.top);
    ctx.stroke();
  }
}
