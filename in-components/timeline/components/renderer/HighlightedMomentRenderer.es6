import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {highlightedMoment$} from 'in-stores/timeline';


export default class HighlightedMomentRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.highlightedMoment = null;
    this.subscription = highlightedMoment$.subscribe(highlightedMoment => this.highlightedMoment = highlightedMoment);
  }

  draw() {
    if (!this.highlightedMoment) {
      return;
    }

    const buffer = this.backBuffer;
    const x = this.scale.getRange(this.highlightedMoment);

    buffer.fillStyle = '#669FA3';
    buffer.fillRect(x, 40, 1, 122);
  }

  dispose() {
    super.dispose();

    this.subscription.dispose();
  }
}
