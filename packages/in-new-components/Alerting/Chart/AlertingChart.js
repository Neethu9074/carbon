import AlertingChartEventsManager from './AlertingChartEventsManager';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import Config from 'in-components/Chart/Configuration';
import MouseMoveManager from './MouseMoveManager';

export default class AlertingChart {
  constructor(canvas, props) {
    this.isLive = false;

    this.config = new Config(canvas, props);

    this.chartEventsManager = new AlertingChartEventsManager();
    this.mouseMoveManager = new MouseMoveManager(canvas, this.config, this.requestRender.bind(this));

    if (props.alertsPreviewEnabled) {
      this.config.markerPaneHeight = 36;
    }

    this.renderScheduler = new RenderScheduler(this);

    this.eventsSubscription = this.chartEventsManager.alertEvents$.subscribe(alertEvents => {
      this.alertEvents = alertEvents;
      this.requestRender();
    });
  }

  update(props) {
    // we need to check if the windowSize has changed in order to adjust the scale during live mode
    const hasWindowSizeChanged = this.config.timeConfig.windowSize !== props.timeConfig.windowSize;

    this.config.update(props);

    this.chartEventsManager.refetchAlerts(props);

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
    this.chartEventsManager.renderEvents(this.alertEvents, config);
    this.mouseMoveManager.render(this.alertEvents, config);
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

    this.mouseMoveManager.dispose();
    this.mouseMoveManager = null;
  }
}
