import {Animation, CubicEasing} from 'koijs';

import {eventBus} from 'in-map/services/eventBus';


const easing = new CubicEasing('inOut');

export default class AnimationController {

  constructor({onUpdate, onStop, timeToAnimate, repeat = false}) {
    this.repeat = repeat;
    this.onStop = onStop;
    this.onUpdate = onUpdate;
    this.timeToAnimate = timeToAnimate;

    this.setupAnimation();

    this.updateSubscription = eventBus.on('update').subscribe(dt => this.update(dt));
  }

  setTimeToAnimate(value) {
    this.animation.setAnimationTime(250 + value * 0.75);
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

  update(dt) {
    if (this.animationInProgress) {
      this.animation.updater.update(dt * 1000);
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
