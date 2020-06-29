import DoubleBufferRenderScheduler from 'in-components/Chart/DoubleBufferRenderScheduler';
import AlertingChartEventsClusterManager from './AlertingChartEventsClusterManager';
import AlertingChartEventsManager from './AlertingChartEventsManager';
import Config from 'in-components/Chart/Configuration';

export default class AlertingChart {
  constructor(canvas, props) {
    this.isLive = false;

    this.config = new Config(canvas, props);

    this.chartEventsManager = new AlertingChartEventsManager();
    this.alertingChartEventsClusterManager = new AlertingChartEventsClusterManager(
      canvas,
      this.config,
      this.requestRender.bind(this)
    );

    if (props.alertsPreviewEnabled) {
      this.config.markerPaneHeight = 36;
    }

    this.renderScheduler = new DoubleBufferRenderScheduler(this);

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
    this.alertingChartEventsClusterManager.render(this.alertEvents, config);
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

    this.alertingChartEventsClusterManager.dispose();
    this.alertingChartEventsClusterManager = null;
  }
}
