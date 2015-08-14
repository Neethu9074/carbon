import {getSortedIndex} from './binarySearch';

export default class TimeSeries {

  name: string;
  times: number[];
  values: number[];

  constructor(name: string) {
    this.name = name;

    this.times = [];
    this.values = [];
  }

  addPoint(time: number, value: number) {
    const index = getSortedIndex(this.times, time);
    this.times.splice(index, 0, time);
    this.values.splice(index, 0, value);
  }

}
