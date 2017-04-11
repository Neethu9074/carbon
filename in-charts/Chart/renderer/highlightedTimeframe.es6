import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';

export default function createHighlightedTimeframeRenderer(config) {
  let highlightedTimeframe;
  const ctx = config.ctx.animationScreen;
  const top = config.margins.top;
  const bottom = config.height - config.margins.top - config.margins.bottom;

  config.subscriptions.push(
    highlightedTimeframe$.throttle(20, { setTimeout, clearTimeout }).subscribe(tf => highlightedTimeframe = tf)
  );

  return {
    render
  };

  function render() {
    if (!highlightedTimeframe) {
      return;
    }

    const from = clamp(config.scales.x.getRange(highlightedTimeframe[0]));
    const to = clamp(config.scales.x.getRange(highlightedTimeframe[1]));

    if (from === to) {
      return;
    }

    ctx.beginPath();
    ctx.rect(from, top, to - from, bottom);
    ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(from, top, 1, bottom);
    ctx.rect(to, top, 1, bottom);
    ctx.fillStyle = 'rgba(128, 128, 128, 0.6)';
    ctx.fill();
  }

  function clamp(x) {
    return Math.max(Math.min(x, config.bounds.right), config.bounds.left);
  }
}
