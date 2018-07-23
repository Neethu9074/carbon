import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';

export default function createHighlightedTimeframeRenderer(ctx, scale, height) {
  let highlightedTimeframe = null;
  const subscription = highlightedTimeframe$.subscribe(_tf => (highlightedTimeframe = _tf));

  return {
    draw,
    dispose
  };

  function draw() {
    if (!highlightedTimeframe) {
      return;
    }

    const from = clamp(scale.getRange(highlightedTimeframe[0]));
    const to = clamp(scale.getRange(highlightedTimeframe[1]));

    if (from === to) {
      return;
    }

    ctx.beginPath();
    ctx.rect(from, 0, to - from, height);
    ctx.fillStyle = 'rgba(160, 160, 160, 0.2)';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(from, 0, 1, height);
    ctx.rect(to, 0, 1, height);
    ctx.fillStyle = 'rgba(160, 160, 160, 0.6)';
    ctx.fill();
  }

  function clamp(x) {
    return Math.max(Math.min(x, scale.getRangeTo()), scale.getRangeFrom());
  }

  function dispose() {
    subscription.dispose();
  }
}
