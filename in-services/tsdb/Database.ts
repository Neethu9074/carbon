import {getSortedIndex} from './binarySearch';
import TimeSeries from './TimeSeries';
import {Point} from './types';

interface TimeSeriesIterationState {
  name: string;
  timeSeries: TimeSeries<number>;
  current: number;
  from: number;
  to: number;
}

export default class Database {

  series: {[name: string]: TimeSeries<number>};

  constructor() {
    this.series = {};
  }

  addPoint(timeSeriesName: string, time: number, value: number) {
    this.getSeries(timeSeriesName)
      .addPoint(time, value);
  }

  getSeries(timeSeriesName: string) {
    let timeSeries = this.series[timeSeriesName];
    if (!timeSeries) {
      timeSeries = new TimeSeries<number>(timeSeriesName);
      this.series[timeSeriesName] = timeSeries;
    }
    return timeSeries;
  }

  /**
   * Merge multiple time-series into a single multivariate time-series.
   * Retain timestamps with incomplete values.
   *
   * @param {string[]} timeSeries The name of the time series which should be
   *   combined.
   * @param {number} from The timestamp from which to start
   *   combining (inclusive).
   * @param {number} to The timestamp at which to stop
   *   combining (inclusive).
   */
  getUnion(timeSeries: string[], from: number, to: number) {
    const seriesIterationState: TimeSeriesIterationState[] = timeSeries
      .map(name => {
        const series = this.getSeries(name);
        const sFrom = getSortedIndex(series.times, from);
        return {
          name,
          timeSeries: series,
          current: sFrom,
          from: sFrom,
          to: Math.min(
            getSortedIndex(series.times, to),
            series.times.length - 1
          )
        };
      });

    let processing = true;
    const result: Point<number>[][] = [];

    while (processing) {
      const smallest = this.getSmallestFromTimeSeries(seriesIterationState);
      const values = this.getValueFromAllTimeSeries(seriesIterationState, smallest);
      result.push(values);
      processing = this.isAtLeastOneTimeseriesProcessingUnfinished(seriesIterationState);
    }

    return result;
  }

  getSmallestFromTimeSeries(timeSeries: TimeSeriesIterationState[]) {
    let smallest = Number.MAX_VALUE;
    timeSeries.forEach(series => {
      if (series.current <= series.to) {
        smallest = Math.min(smallest, series.timeSeries.times[series.current]);
      }
    });
    return smallest;
  }

  getValueFromAllTimeSeries(timeSeries: TimeSeriesIterationState[], x: number) {
    const values: Point<number>[] = [];

    timeSeries.forEach(series => {
      let y: number;
      if (series.timeSeries.times[series.current] === x) {
        y = series.timeSeries.values[series.current];
        series.current++;
      } else {
        y = undefined;
      }
      values.push({
        x: x,
        y
      });
    });

    return values;
  }

  isAtLeastOneTimeseriesProcessingUnfinished(timeSeries: TimeSeriesIterationState[]) {
    for (let i = 0, len = timeSeries.length; i < len; i++) {
      const series = timeSeries[i];
      if (series.current <= series.to) {
        return true;
      }
    }
    return false;
  }
}
