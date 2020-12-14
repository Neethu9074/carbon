import { create } from 'reactive-observables';

import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { WIGGLE_ROOM, ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { toServerTime, offset$ } from 'in-stores/timeOffset';
import createScale from 'in-services/scale';

export default class RenderScheduler {
  constructor(callbackHolder) {
    this.callbackHolder = callbackHolder;
    this.timeConfig = null;

    this.isLive = false;
    this.isLive$ = create().emit(this.isLive);

    this.initScale();

    this.serverTimeOffset = 0;
    this.serverTimeOffsetSubscription = offset$.nextFrame().subscribe(serverTimeOffset => {
      this.serverTimeOffset = serverTimeOffset;

      // The initial signal can be retrieved synchronously. This means that this instance's
      // update signal has never been retrieved. In those cases we *must* not force a rendering
      // as this would break this instance's contract.
      if (this.timeConfig != null) {
        this.forceRender();
      }
    });
  }

  initScale() {
    this.xScaleBackBuffer = createScale();
    this.xScaleBackBuffer.setRangeFrom(0);
    // other places like the chart overlay are not directly controlled my the scheduler but organize themselves.
    // therefore, we expose the current up-2-date scale via an observable
    this.xScaleBackBuffer$ = create().emit(this.xScaleBackBuffer);
  }

  update(timeConfig, width) {
    this.xScaleBackBuffer.setRangeTo(width);
    this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);
    this.timeConfig = timeConfig;

    // we need to check if the windowSize has changed in order to adjust the scale during live mode
    const hasWindowSizeChanged = this?.timeConfig?.windowSize !== timeConfig.windowSize;

    const isLive = timeConfig.autoRefresh;

    if (isLive && !this.isLive) {
      this.startLiveMode();
    } else if (!isLive && this.isLive) {
      this.stopLiveMode();
    }

    if (isLive && this.isLive) {
      if (hasWindowSizeChanged) {
        this.startLiveMode();
      }
      this.render();
    } else {
      this.atomicRender();
    }
    if (this.isLive !== isLive) {
      this.isLive$.emit(isLive);
    }
    this.isLive = isLive;
  }

  atomicRender() {
    const timeConfig = this.timeConfig;
    const to = timeConfig?.to ?? toServerTime(Date.now(), this.serverTimeOffset);
    const windowSize = timeConfig?.windowSize ?? 0;

    this.xScaleBackBuffer.setDomainFrom(to - windowSize);
    this.xScaleBackBuffer.setDomainTo(to);
    this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);

    this.call('atomicRender', this.getRenderProps());
  }

  forceRender() {
    if (this.isLive) {
      this.render();
    } else {
      this.atomicRender();
    }
  }

  render() {
    this.call('render', this.getRenderProps());
  }

  startLiveMode() {
    this.stopLiveMode();

    this.setXDomainToLiveMode();

    let initialRenderDone = false;
    const animate = ({ timeSinceLastAnimationDurationPassed, progress }) => {
      this.onProgress(progress);

      if (timeSinceLastAnimationDurationPassed >= ANIMATION_DURATION || !initialRenderDone) {
        this.onProgress(progress);

        this.xScaleBackBuffer.shiftDomain(timeSinceLastAnimationDurationPassed);
        this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);

        this.call('renderAfterAnimationTimePassed', this.getRenderProps());
        initialRenderDone = true;
      }
    };

    this.updateSubscription = getAnimationFramesWithAnAnimationDurationOf(ANIMATION_DURATION).subscribe(animate);
  }

  onProgress() {}

  stopLiveMode() {
    if (this.updateSubscription) {
      this.updateSubscription.dispose();
      this.updateSubscription = null;
    }
    this.call('stopLiveMode');
  }

  setXDomainToLiveMode() {
    const now = Date.now();
    const windowSize = this.timeConfig.windowSize;
    const to = toServerTime(now, this.serverTimeOffset);
    this.xScaleBackBuffer.setDomainFrom(to - windowSize - WIGGLE_ROOM);
    this.xScaleBackBuffer.setDomainTo(to - WIGGLE_ROOM);
    this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);
  }

  getRenderProps() {
    return {
      xScaleBackBuffer: this.xScaleBackBuffer
    };
  }

  call(method, args) {
    if (this.callbackHolder[method]) {
      this.callbackHolder[method](args);
    }
  }

  dispose() {
    this.stopLiveMode();

    this.serverTimeOffsetSubscription.dispose();
    this.serverTimeOffsetSubscription = null;
  }
}
