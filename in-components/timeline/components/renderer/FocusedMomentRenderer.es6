import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import { focusedMomentXPosition$ } from 'in-components/timeline/timelineStore';

const color = '#9fffff';

export default class FocusedMomentRenderer extends BasicRenderer {
  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.x = null;
    this.focusedMomentXPositionSubscription = focusedMomentXPosition$.subscribe(x => this.x = x);
  }

  getCurrentXPosition() {
    return this.x;
  }

  draw() {
    const buffer = this.backBuffer;
    const x = this.x;

    // draw line
    buffer.fillStyle = color;

    buffer.globalAlpha = 0.2;
    buffer.fillRect(x, 40, 1, 160);
    buffer.globalAlpha = 1;
  }

  dispose() {
    super.dispose();

    this.focusedMomentXPositionSubscription.dispose();
  }
}
