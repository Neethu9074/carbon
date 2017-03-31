import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';

export default class HighlightedTimeframeRenderer extends BasicRenderer {
  constructor(backBuffer, scale, height) {
    super(backBuffer, scale);

    this.height = height;
    this.highlightedTimeframe = null;
    this.subscription = highlightedTimeframe$.subscribe(
      highlightedTimeframe => this.highlightedTimeframe = highlightedTimeframe
    );
  }

  draw() {
    const highlightedTimeframe = this.highlightedTimeframe;
    if (!this.highlightedTimeframe) {
      return;
    }

    const buffer = this.backBuffer;
    const from = this.clamp(this.scale.getRange(highlightedTimeframe[0]));
    const to = this.clamp(this.scale.getRange(highlightedTimeframe[1]));

    if (from === to) {
      return;
    }

    buffer.beginPath();
    buffer.rect(from, 0, to - from, this.height);
    buffer.fillStyle = 'rgba(160, 160, 160, 0.2)';
    buffer.fill();

    buffer.beginPath();
    buffer.rect(from, 0, 1, this.height);
    buffer.rect(to, 0, 1, this.height);
    buffer.fillStyle = 'rgba(160, 160, 160, 0.6)';
    buffer.fill();
  }

  clamp(x) {
    return Math.max(Math.min(x, this.scale.getRangeTo()), this.scale.getRangeFrom());
  }

  dispose() {
    super.dispose();
    this.subscription.dispose();
  }
}
