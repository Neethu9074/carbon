import invariant from 'invariant';
import find from 'lodash/find';

export default class Queue {

  constructor(numberOfSeries) {
    invariant(numberOfSeries > 0, 'There needs to be at least one series.');

    this.series = [];
    for (let i = 0; i < numberOfSeries; i++) {
      this.series[i] = [];
    }
  }

  addDataPoint(seriesIndex, dataPoint) {
    invariant(
      0 <= seriesIndex && seriesIndex < this.series.length,
      'The provided seriesIndex is not acceptable.'
    );

    this.series[seriesIndex].push(dataPoint);
  }

  /**
   * Get all the new data points that are included in all series.
   * @returns {DataPoint[][]}
   */
  get() {
    // Avoid costly operations when the following holds true. This generally
    // happens when the chart is being constructed
    if (!this.isAtLeastOneDataPointInEverySeries()) {
      return [];
    }

    const firstSeries = this.series[0];
    const newDataPoints = [];
    const xValuesThatAppearedInAllDataPoints = [];

    firstSeries.forEach(dataPoint => {
      const dataPoints = this.getDataPointsFromAllSeries(dataPoint.x);
      if (this.isDataPointInAllSeries(dataPoints)) {
        newDataPoints.push(dataPoints);
        xValuesThatAppearedInAllDataPoints.push(dataPoint.x);
      }
    });

    // remove all data points that are being returned by this method
    const filterPredicate = dataPoint => {
      return xValuesThatAppearedInAllDataPoints.indexOf(dataPoint.x) === -1;
    };
    this.series = this.series.map(eachSeries => {
      return eachSeries.filter(filterPredicate);
    });

    return newDataPoints;
  }

  isAtLeastOneDataPointInEverySeries() {
    for (let i = 0, len = this.series.length; i < len; i++) {
      if (this.series[i].length === 0) {
        return false;
      }
    }
    return true;
  }

  getDataPointsFromAllSeries(x) {
    const predicate = dataPoint => dataPoint.x === x;
    const dataPoints = [];
    for (let i = 0, numberOfSeries = this.series.length; i < numberOfSeries; i++) {
      dataPoints[i] = find(this.series[i], predicate);
    }
    return dataPoints;
  }

  isDataPointInAllSeries(dataPoints) {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      if (dataPoints[i] === undefined) {
        return false;
      }
    }
    return true;
  }
}
