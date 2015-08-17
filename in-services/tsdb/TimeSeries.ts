import {getSortedIndex} from './binarySearch';
import {Timestamp} from './types';

export default class TimeSeries<TYPE_OF_VALUE> {

  id: string;
  times: Timestamp[];
  values: TYPE_OF_VALUE[];

  constructor(id: string) {
    this.id = id;

    this.times = [];
    this.values = [];
  }

  addPoint(time: Timestamp, value: TYPE_OF_VALUE) {
    const index = getSortedIndex(this.times, time);

    // pushing a value into an array is insanely more performant then splicing it.
    // Appending values to the end it the most common case for point addition, we should
    // therefore optimize for it!
    if (index >= this.times.length) {
      this.times.push(time);
      this.values.push(value);
    } else {
      this.times.splice(index, 0, time);
      this.values.splice(index, 0, value);
    }
  }

}
