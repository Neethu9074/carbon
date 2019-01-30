import RenderScheduler from 'in-components/Chart/RenderScheduler';
import Config from 'in-components/Chart/Configuration';

const emptyDataSeries = [];

export default class Chart {
  constructor(canvas, props) {
    this.isLive = false;
    this.config = new Config(canvas, props);
    this.renderScheduler = new RenderScheduler(this);
  }

  update(props) {
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
    } else if (!isLive) {
      this.renderScheduler.atomicRender();
    } else {
      this.renderScheduler.intermediateRenderDuringUpdate();
    }

    this.isLive = isLive;
  }

  getNearestDataPointDomainForTimestamp(timestamp) {
    if (this.timeIsNotDefined(timestamp)) {
      return null;
    }

    const allDomainValues = this.config.getAllDomainValues();
    let distanceToNearestDataPoint = Number.MAX_VALUE;
    let nearestDomain = null;

    for (let i = 0; i < allDomainValues.length; i++) {
      const domain = allDomainValues[i];
      const distanceToDataPoint = Math.abs(timestamp - domain);
      if (distanceToDataPoint < distanceToNearestDataPoint) {
        nearestDomain = domain;
        distanceToNearestDataPoint = distanceToDataPoint;
      }
    }

    return nearestDomain;
  }

  collectAllDataPointsAtTime(timestamp) {
    if (this.timeIsNotDefined(timestamp)) {
      return null;
    }

    const dataPointsCollection = {};
    this.collectAllDataPointsAtTimeForAxis(timestamp, 'y1', dataPointsCollection);
    this.collectAllDataPointsAtTimeForAxis(timestamp, 'y2', dataPointsCollection);
    return dataPointsCollection;
  }

  collectAllDataPointsAtTimeForAxis(timestamp, axisName, dataPointsCollection) {
    const axis = this.config[axisName];
    if (!axis) {
      return;
    }

    for (let i = 0; i < axis.metrics.length; i++) {
      const dataSeries = axis.metrics[i];
      const dataPointAtTime = this.getDataPointAtTimeForDataSeries(timestamp, dataSeries);
      if (dataPointAtTime) {
        if (!dataPointsCollection[axisName]) {
          dataPointsCollection[axisName] = {};
        }
        dataPointsCollection[axisName][axis.labels[i]] = dataPointAtTime;
      }
    }
  }

  getDataPointAtTimeForDataSeries(timestamp, dataSeries) {
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (dataPoint[0] === timestamp) {
        return dataPoint;
      }
    }
  }

  filterDataSeries(axis) {
    const validMetrics = [];
    for (let i = 0; i < axis.metrics.length; i++) {
      validMetrics.push(this.isLabelFilteredByUser(axis.labels[i]) ? emptyDataSeries : axis.metrics[i]);
    }
    return validMetrics;
  }

  requestRender() {
    this.renderScheduler.atomicRender();
  }

  isLabelFilteredByUser(label) {
    return this.config.filteredDataSeries.has(label);
  }

  timeIsNotDefined(timestamp) {
    return timestamp == null || timestamp == undefined;
  }

  dispose() {
    this.renderScheduler.dispose();
  }
}
