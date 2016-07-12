export default function createAxisRenderer(config) {
  const ctx = config.ctx.buffer;

  return {
    render
  };

  function render() {
    // draw box around the chart area

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
