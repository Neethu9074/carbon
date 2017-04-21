import { formatDate, formatTime } from 'in-services/formatters/date';
import { font } from 'in-components/timeline/timelineConfig';
import { highlightedMoment$ } from 'in-stores/timeline';

const width = 120;

export default function createHighlightedMomentRenderer(ctx, scale) {
  let highlightedMoment = null;
  const subscription = highlightedMoment$.subscribe(_hm => highlightedMoment = _hm);

  return {
    draw,
    dispose
  };

  function draw() {
    if (!highlightedMoment) {
      return;
    }

    let x = scale.getRange(highlightedMoment);

    ctx.fillStyle = '#92A5AE';
    ctx.fillRect(x, 16, 1, 140);

    if (x > scale.getRangeTo() * 0.8) {
      x -= width / 2;
    } else if (x < scale.getRangeTo() * 0.2) {
      x += width / 2;
    }

    ctx.fillStyle = '#172429';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x - width / 2, 0, width, 19);
    ctx.globalAlpha = 1;

    ctx.font = font;
    ctx.fillStyle = '#4c595f';
    ctx.fillText(formatDate(highlightedMoment), x - 47, 14);
    ctx.fillStyle = '#fff';
    ctx.fillText(formatTime(highlightedMoment), x + 10, 14);
  }

  function dispose() {
    subscription.dispose();
  }
}
