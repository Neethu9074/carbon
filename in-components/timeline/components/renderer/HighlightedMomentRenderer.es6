import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {font} from 'in-components/timeline/timelineConfig';
import {highlightedMoment$} from 'in-stores/timeline';


const width = 120;

export default class HighlightedMomentRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.highlightedMoment = null;
    this.subscription = highlightedMoment$.subscribe(highlightedMoment => this.highlightedMoment = highlightedMoment);
  }

  draw() {
    const highlightedMoment = this.highlightedMoment;
    if (!this.highlightedMoment) {
      return;
    }

    const buffer = this.backBuffer;
    const scale = this.scale;
    let x = this.scale.getRange(highlightedMoment);

    buffer.fillStyle = '#92A5AE';
    buffer.fillRect(x, 16, 1, 122);

    if (x > scale.getRangeTo() * 0.8) {
      x -= width / 2;
    } else if (x < scale.getRangeTo() * 0.2) {
      x += width / 2;
    }

    buffer.fillStyle = '#172429';
    buffer.globalAlpha = 0.8;
    buffer.fillRect(x - width / 2, 0, width, 19);
    buffer.globalAlpha = 1;

    buffer.font = font;
    buffer.fillStyle = '#4c595f';
    buffer.fillText(formatDate(highlightedMoment), x - 47, 14);
    buffer.fillStyle = '#fff';
    buffer.fillText(formatTime(highlightedMoment), x + 10, 14);
  }

  dispose() {
    super.dispose();

    this.subscription.dispose();
  }
}
