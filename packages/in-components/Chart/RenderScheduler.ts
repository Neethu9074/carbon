/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Disposable, Subject } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { WIGGLE_ROOM, ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { toServerTime, offset$ } from 'in-stores/timeOffset';
import createScale, { ScaleType } from 'in-services/scale';
import { Nullish } from 'in-types';

export interface RenderProps {
  xScaleBackBuffer: ScaleType;
}

export interface Renderable {
  atomicRender: (props: RenderProps) => void;
  render: (props: RenderProps) => void;
  renderAfterAnimationTimePassed: (props: RenderProps) => void;

  stopLiveMode: () => void;
}

interface AnimateProps {
  timeSinceLastAnimationDurationPassed: number;
  progress: number;
}

export default class RenderScheduler<CallbackHolderType extends Partial<Renderable>> {
  callbackHolder: CallbackHolderType;
  timeConfig: TimeConfig | Nullish;
  isLive: boolean;
  isLive$: Subject<boolean>;
  wiggleRoom: number;
  serverTimeOffset: number;
  serverTimeOffsetSubscription: Disposable | Nullish;

  xScaleBackBuffer: ScaleType;
  xScaleBackBuffer$: Subject<ScaleType>;

  updateSubscription: Disposable | Nullish;

  constructor(callbackHolder: CallbackHolderType) {
    this.callbackHolder = callbackHolder;
    this.timeConfig = null;

    this.isLive = false;
    this.isLive$ = create<boolean>().emit(this.isLive);
    this.wiggleRoom = WIGGLE_ROOM;

    this.xScaleBackBuffer = createScale();
    this.xScaleBackBuffer.setRangeFrom(0);
    // other places like the chart overlay are not directly controlled by the scheduler but organize themselves.
    // therefore, we expose the current up-2-date scale via an observable
    this.xScaleBackBuffer$ = create<ScaleType>().emit(this.xScaleBackBuffer);

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

  update(timeConfig: TimeConfig, width: number, wiggleRoom?: number) {
    this.xScaleBackBuffer.setRangeTo(width);
    this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);
    this.timeConfig = timeConfig;
    if (wiggleRoom) {
      this.wiggleRoom = wiggleRoom;
    }

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
    const to = timeConfig?.to ?? toServerTime(Date.now(), this.serverTimeOffset) - this.wiggleRoom;
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
    const animate = ({ timeSinceLastAnimationDurationPassed, progress }: AnimateProps) => {
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

  // @ts-expect-error Expecting unused parameter error here, but since this is a dummy method it is ok
  onProgress(progress: number) {}

  stopLiveMode() {
    if (this.updateSubscription) {
      this.updateSubscription.dispose();
      this.updateSubscription = null;
    }
    this.call('stopLiveMode');
  }

  setXDomainToLiveMode() {
    const now = Date.now();
    const windowSize = this.timeConfig?.windowSize ?? 0;
    const to = toServerTime(now, this.serverTimeOffset) - this.wiggleRoom;
    this.xScaleBackBuffer.setDomainFrom(to - windowSize);
    this.xScaleBackBuffer.setDomainTo(to);
    this.xScaleBackBuffer$.emit(this.xScaleBackBuffer);
  }

  getRenderProps() {
    return {
      xScaleBackBuffer: this.xScaleBackBuffer
    };
  }

  call<Method extends keyof Renderable>(method: Method, args?: Parameters<Renderable[Method]>[0]) {
    if (this.callbackHolder[method]) {
      this.callbackHolder[method]?.(args!);
    }
  }

  dispose() {
    this.stopLiveMode();

    this.serverTimeOffsetSubscription?.dispose();
    this.serverTimeOffsetSubscription = null;
  }
}
