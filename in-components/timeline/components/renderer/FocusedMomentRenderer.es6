import {focusedMomentXPosition$} from 'in-components/timeline/timelineStore';


const color = '#9fffff';

export default class FocusedMomentRenderer {

  constructor(buffer, scale) {
    this.buffer = buffer;
    this.scale = scale;
    this.x = null;

    this.focusedMomentXPositionSubscription = focusedMomentXPosition$.subscribe(x => this.x = x);
  }

  getCurrentXPosition() {
    return this.x;
  }

  draw() {
    const buffer = this.buffer;
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
    this.focusedMomentXPositionSubscription.dispose();
  }
}
