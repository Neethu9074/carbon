import dropWhile from 'lodash/dropWhile';

/**
 * This class keeps track of all the data that is currently drawn or will be
 * be drawn over the course of an animation.
 *
 * As such it handles data point expiration
 */
export default class Data {

  constructor({windowSize}) {
    this.windowSize = windowSize;
    this.dataColumns = [];
  }

  addDataColumns(dataColumns) {
    // remove all old values. These should be off canvas by now!
    this.expireOldDataColumns();
    this.insertSorted(dataColumns);
  }

  expireOldDataColumns() {
    const numberOfDataColumns = this.dataColumns.length;
    // nothing to do when there is no data column yet
    if (numberOfDataColumns === 0) {
      return;
    }

    const latest = this.dataColumns[numberOfDataColumns - 1][0].x;
    const earliestPermittedTimestamp = latest - this.windowSize;

    this.dataColumns = dropWhile(
      this.dataColumns,
      dataColumn => dataColumn[0].x < earliestPermittedTimestamp
    );
  }

  insertSorted(newDataColumns) {
    newDataColumns.forEach(newDataColumn => {
      const newX = newDataColumn[0].x;

      for (let i = this.dataColumns.length - 1; i >= 0; i--) {
        const currX = this.dataColumns[i][0].x;
        if (newX > currX) {
          this.dataColumns.splice(i + 1, 0, newDataColumn);
          return;
        }
      }

      // interesting, the data column belongs at the beginning
      this.dataColumns.splice(0, 0, newDataColumn);
    });
  }

  getDataColumns() {
    return this.dataColumns;
  }
}
