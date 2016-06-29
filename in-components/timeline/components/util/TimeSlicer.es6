// Slices time ranges into smaller chunks
// which can be accessed via a number index.
class TimeSlicer {

  // Given options for minimum and maximum timestamps
  // which express the inclusive start and inclusive
  // end point of the timerange.
  constructor(options) {
    this.min = options.min;
    this.max = options.max;

    this._buildIndex();
  }

  // Slices the current timerange into smaller chunks between
  // the given from and to range by applying the given number of slices.
  slice(fromValue, toValue, slices) {
    const factor = (toValue - fromValue) / slices;
    const index = this.index;
    const copyIndex = this.index.slice();
    this.index.splice(0, this.index.length);
    // Insert right side
    Object
      .keys(copyIndex)
      .filter(i => copyIndex[i] < fromValue)
      .forEach(i => index.push(copyIndex[i])
    );
    // Insert new bucket
    for (let i = 0; i <= slices; ++i) {
      this.index.push(fromValue + factor * i);
    }
    // Insert left side
    Object
      .keys(copyIndex)
      .filter(i => copyIndex[i] > toValue)
      .forEach(i => index.push(copyIndex[i])
    );
  }

  // Provides a timestamp value depending on the index.
  get(index) {
    return this.index[index];
  }

  // Returns the current number of slices
  size() {
    return this.index.length;
  }

  indexOf(time) {
    for (let i = 0; i < this.index.length; ++i) {
      if (this.index[i] >= time) {
        return i;
      }
    }
    return -1;
  }

  _buildIndex() {
    this.index = [];
    this.index.push(this.min);
    this.index.push(this.max);
  }
}

export default TimeSlicer;
