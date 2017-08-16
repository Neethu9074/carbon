export default function createBorderRenderer(config) {
  const ctx = config.ctx.staticScreen;
  const lineWidth = 1;

  return {
    render
  };

  function render() {
    const width = config.bounds.right - config.bounds.left;
    const height = config.bounds.top - config.bounds.bottom;

    ctx.fillStyle = '#ddd';
    ctx.rect(config.bounds.left, config.bounds.top, width, lineWidth);
    ctx.rect(config.bounds.left, config.bounds.bottom, width, lineWidth);
    ctx.rect(config.bounds.left, config.bounds.bottom, lineWidth, height);
    ctx.rect(config.bounds.right, config.bounds.bottom, lineWidth, height);
    ctx.fill();
    return;
  }
}
