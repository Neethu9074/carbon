import TWEEN from 'tween.js';

import * as time from 'in-map/src/timeCalculations';
import eventBus from 'in-map/eventbus';


export default class AnimationController {

  constructor({onUpdate, onStop, timeToAnimate, repeat = false}) {
    this.onUpdate = onUpdate;
    this.onStop = onStop;
    this.timeToAnimate = timeToAnimate;
    this.repeat = repeat;

    this.setupAnimation();

    this.updateSubscription = eventBus.on('beginUpdate').subscribe(() => this.update());
  }

  setupAnimation() {
    const from = {v: 0.0}; // 0%
    const to = {v: 1.0}; // 100%

    this.animationInProgress = false;

    // updating from 0 to 1 in 500 ms
    const animation = new TWEEN.Tween(from).to(to, this.timeToAnimate);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onUpdate(this.onUpdate);
    animation.onComplete(() => {
      this.onStop();
    });

    if (this.repeat) {
      animation.repeat(Infinity);
    }

    this.animation = animation;
    this.animation.stop();
  }

  start() {
    // first stop to reset to-value
    this.animation.stop();

    this.animationInProgress = true;
    this.animation.start();
  }

  stop() {
    this.animationInProgress = false;
    this.animation.stop();
  }

  update() {
    if (this.animationInProgress) {
      this.animation.update(time.getNow());
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
