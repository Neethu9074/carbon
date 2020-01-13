import ChartEventsManager from 'in-components/Chart/ChartEventsManager';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import Config from 'in-components/Chart/Configuration';

export default class Chart {
  constructor(canvas, props) {
    this.isLive = false;

    this.chartEventsManager = new ChartEventsManager();
    this.config = new Config(canvas, props);
    this.renderScheduler = new RenderScheduler(this);

    this.eventsSubscription = this.chartEventsManager.events$.subscribe(events => {
      this.events = events;
      this.requestRender();
    });
  }

  update(props) {
    // we need to check if the windowSize has changed in order to adjust the scale during live mode
    const hasWindowSizeChanged = this.config.timeConfig.windowSize !== props.timeConfig.windowSize;

    this.config.update(props);

    const isLive = props.timeConfig.autoRefresh;
    if (isLive && !this.isLive) {
      this.renderScheduler.startLiveMode();
    } else if (!isLive && this.isLive) {
      this.renderScheduler.stopLiveMode();
    }

    if (this.isLive !== isLive) {
      if (!isLive) {
        this.renderScheduler.atomicRender();
      }
    } else {
      this.forceUpdateRendering(hasWindowSizeChanged);
    }

    this.isLive = isLive;
  }

  requestRender() {
    this.forceUpdateRendering();
  }

  renderEvents(config) {
    this.chartEventsManager.renderEvents(this.events, config);
  }

  forceUpdateRendering(hasWindowSizeChanged = false) {
    if (!this.isLive) {
      this.renderScheduler.atomicRender();
    } else {
      if (hasWindowSizeChanged) {
        this.renderScheduler.updateWindowSizeDuringAnimation();
      }
      this.renderScheduler.intermediateRenderDuringAnimation();
    }
  }

  dispose() {
    this.renderScheduler.dispose();

    this.eventsSubscription.dispose();
    this.eventsSubscription = null;
  }
}
