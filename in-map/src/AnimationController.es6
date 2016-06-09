import {Animation, CubicEasing} from 'koijs';

import * as time from 'in-map/src/timeCalculations';
import eventBus from 'in-map/eventbus';


const easing = new CubicEasing('inOut');

export default class AnimationController {

  constructor({onUpdate, onStop, timeToAnimate, repeat = false}) {
    this.repeat = repeat;
    this.onStop = onStop;
    this.onUpdate = onUpdate;
    this.timeToAnimate = timeToAnimate;

    this.setupAnimation();

    this.updateSubscription = eventBus.on('beginUpdate').subscribe(() => this.update());
  }

  setTimeToAnimate(value) {
    this.animation.setAnimationTime(500 + value / 2);
  }

  setupAnimation() {
    const animation = new Animation({
      from: {v: 0.0}, // 0%
      to: {v: 1.0},   // 100%,
      easing,
      autoUpdate: false,
      animationTime: this.timeToAnimate,
      repeating: this.repeat ? Infinity : null
    });
    animation.onUpdate(progress => this.onUpdate(progress.v));
    if (this.onStop) {
      animation.onStop(() => this.onStop());
    }

    this.animationInProgress = false;
    this.animation = animation;
  }

  start() {
    this.animationInProgress = true;
    this.animation.start();
  }

  stop() {
    this.animationInProgress = false;
    this.animation.stop();
  }

  update() {
    if (this.animationInProgress) {
      this.animation.updater.update(time.getDeltaTime() * 1000);
    }
  }

  dispose() {
    this.updateSubscription.dispose();
    this.updateSubscription = null;

    this.timeToAnimate = null;
    this.onUpdate = null;
    this.repeat = null;
    this.onStop = null;
  }
}
