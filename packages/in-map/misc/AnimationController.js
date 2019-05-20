import { Animation, CubicEasing } from 'koijs';

import { eventBus } from 'in-map/services/eventBus';

const easing = new CubicEasing('inOut');

export default class AnimationController {
  constructor({ onUpdate, onStop, timeToAnimate, repeat = false }) {
    this.repeat = repeat;
    this.onStop = onStop;
    this.onUpdate = onUpdate;
    this.timeToAnimate = timeToAnimate;

    this.setupAnimation();
  }

  setupAnimation() {
    const animation = new Animation({
      from: { v: 0.0 }, // 0%
      to: { v: 1.0 }, // 100%,
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
    if (this.animationInProgress) {
      return;
    }

    this.updateSubscription = eventBus.on('update').subscribe(dt => this.update(dt));
    this.animationInProgress = true;
    this.animation.start();
  }

  stop() {
    if (!this.animationInProgress) {
      return;
    }

    this.disposeUpdate();

    this.animationInProgress = false;
    this.animation.stop();
  }

  update(dt) {
    if (this.animationInProgress) {
      this.animation.updater.update(dt * 1000);
    }
  }

  disposeUpdate() {
    if (this.updateSubscription) {
      this.updateSubscription.dispose();
      this.updateSubscription = null;
    }
  }

  dispose() {
    this.disposeUpdate();

    this.timeToAnimate = null;
    this.onUpdate = null;
    this.repeat = null;
    this.onStop = null;
  }
}
