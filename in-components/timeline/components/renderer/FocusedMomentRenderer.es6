import {focusedMoment$} from 'in-stores/timeline';


const color = '#9fffff';

export default class FocusedMomentRenderer {

  constructor(buffer, scale) {
    this.buffer = buffer;
    this.scale = scale;

    this.focusedMomentSubscription = focusedMoment$.subscribe(focusedMoment => this.focusedMoment = focusedMoment);
  }

  draw() {
    const focusedMoment = this.focusedMoment;
    const buffer = this.buffer;
    const scale = this.scale;
    const width = 8;

    const x = focusedMoment ?
      scale.getRange(focusedMoment) :
      scale.getRange(scale.getDomainTo());

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
    this.focusedMomentSubscription.dispose();
  }
}
