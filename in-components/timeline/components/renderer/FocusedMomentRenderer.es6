import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {focusedMomentXPosition$} from 'in-components/timeline/timelineStore';


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
    const width = 8;
    const x = this.x;

    // draw line
    buffer.fillStyle = color;

    buffer.globalAlpha = 0.2;
    buffer.fillRect(x, 40, 1, 160);
    buffer.globalAlpha = 1;

    buffer.strokeStyle = color;
    buffer.lineWidth = width;
    buffer.lineJoin = 'round';
    buffer.beginPath();
    buffer.moveTo(x, 10);
    buffer.lineTo(x, 40);
    buffer.closePath();
    buffer.stroke();
    buffer.fill();
  }

  dispose() {
    super.dispose();

    this.focusedMomentXPositionSubscription.dispose();
  }
}
