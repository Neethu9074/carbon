import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {highlightedMoment$} from 'in-stores/timeline';


export default class HighlightedMomentRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.highlightedMoment = null;
    this.subscription = highlightedMoment$.subscribe(highlightedMoment =>
      this.highlightedMoment = highlightedMoment
    );
  }

  draw() {
    if (!this.highlightedMoment) {
      return;
    }

    const buffer = this.backBuffer;
    const x = this.scale.getRange(this.highlightedMoment);

    buffer.strokeStyle = '#ff0000';
    buffer.lineWidth = 1;
    buffer.beginPath();
    buffer.moveTo(x, 40);
    buffer.lineTo(x, 162);
    buffer.closePath();
    buffer.stroke();
  }

  dispose() {
    super.dispose();
    this.subscription.dispose();
  }
}
