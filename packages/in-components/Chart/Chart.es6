import Config from 'in-components/Chart/Configuration';

import renderTickLines from 'in-components/Chart/renderer/tickLines';
import renderTicks from 'in-components/Chart/renderer/ticks';
import clearRender from 'in-components/Chart/renderer/clear';
import renderAxis from 'in-components/Chart/renderer/axis';

export default class Chart {
  constructor(canvas) {
    this.config = new Config(canvas, this.render.bind(this));
  }

  update(props) {
    this.config.update(props);
    this.config.requestRender();
  }

  render() {
    /* eslint-disable strict, no-console */
    // console.log('------ render ------------------------------------');
    // console.log(this.config);
    /* eslint-enable strict, no-console */

    clearRender(this.config);
    renderTickLines(this.config);

    this.renderAxisMetrics('y1');
    this.renderAxisMetrics('y2');

    this.clearOverdraw();

    renderAxis(this.config);
    renderTicks(this.config);
  }

  renderAxisMetrics(axisName) {
    const config = this.config;
    const axis = config[axisName];
    if (!axis) {
      return;
    }

    if (axis.valuesNeedToBeStacked || axis.valuesDependOnEachOther) {
      axis.renderer.render({
        axis,
        metrics: axis.metrics,
        colors: axis.colors,
        scale: config.scales[axisName],
        config
      });
    } else {
      for (let i = 0; i < axis.metrics.length; i++) {
        const dataSeries = axis.metrics[i];
        if (dataSeries.length === 0) {
          continue;
        }
        axis.renderer.render({
          axis,
          index: i,
          dataSeries: axis.metrics[i],
          color: axis.colors[i],
          scale: config.scales[axisName],
          config
        });
      }
    }
  }

  clearOverdraw() {
    this.config.clearTopOverdraw();
    this.config.clearBottomOverdraw();
    this.config.clearLeftOverdraw();
    this.config.clearRightOverdraw();
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

  timeIsNotDefined(timestamp) {
    return timestamp == null || timestamp == undefined;
  }

  dispose() {
    this.config.dispose();
  }
}
