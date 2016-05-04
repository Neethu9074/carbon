import {timeframe$} from 'in-components/timeline/timelineStore';
import {focusedMoment$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';

const color = '#9fffff';

export default class FocusedMomentRenderer {

  constructor(buffer, scale) {
    this.buffer = buffer;
    this.scale = scale;

    this.focusedMomentSubscription = focusedMoment$.subscribe(focusedMoment => this.focusedMoment = focusedMoment);
    this.toSubscription = timeframe$.subscribe(timeframe => this.to = timeframe.to);
    this.serverTimeSubscription = serverTime$.subscribe(time => this.serverTime = time);
  }

  draw() {
    const focusedMoment = this.focusedMoment;
    const buffer = this.buffer;
    const scale = this.scale;
    const width = 8;

    let x = null;
    if (focusedMoment) {
      x = scale.getRange(focusedMoment);
    } else if (!this.to) {
      x = scale.getRange(scale.getDomainTo());
    } else {
      x = scale.getRange(this.serverTime);
    }

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
    this.serverTimeSubscription.dispose();
    this.toSubscription.dispose();
  }
}
