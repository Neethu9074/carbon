/* eslint-env mocha */

import {expect} from 'chai';

import Data from './Data';

describe('Chart.Data', () => {

  let data;

  it('should initially be empty', () => {
    data = new Data({windowSize: 10});
    expect(data.getDataColumns().length).to.equal(0);
  });

  it('should permit the addition of values', () => {
    data = new Data({windowSize: 10});

    const column0 = newDataColumn(0, 0);
    const column1 = newDataColumn(1, 1);
    data.addDataColumns([column0, column1]);

    const dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(2);
    expect(dataColumns[0]).to.equal(column0);
    expect(dataColumns[1]).to.equal(column1);
  });

  it('should sort added values', () => {
    data = new Data({windowSize: 10});
    const column0 = newDataColumn(0, 0);
    const column1 = newDataColumn(1, 1);
    const column2 = newDataColumn(2, 2);

    data.addDataColumns([column2, column0]);
    data.addDataColumns([column1]);

    const dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(3);
    expect(dataColumns[0]).to.equal(column0);
    expect(dataColumns[1]).to.equal(column1);
    expect(dataColumns[2]).to.equal(column2);
  });

  it('should expire old values on add', () => {
    data = new Data({windowSize: 10});
    const column0 = newDataColumn(0, 0);
    const column10 = newDataColumn(10, 1);
    const column11 = newDataColumn(11, 2);
    const column12 = newDataColumn(12, 3);

    data.addDataColumns([column0]);
    let dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(1);
    expect(dataColumns[0]).to.equal(column0);

    data.addDataColumns([column10]);
    dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(2);
    expect(dataColumns[0]).to.equal(column0);
    expect(dataColumns[1]).to.equal(column10);

    // important: when 11 comes into the data, 0 is still visible to the other,
    // but will be transitioned out. 0 falls out on the next add.
    data.addDataColumns([column11]);
    dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(3);
    expect(dataColumns[0]).to.equal(column0);
    expect(dataColumns[1]).to.equal(column10);
    expect(dataColumns[2]).to.equal(column11);

    data.addDataColumns([column12]);
    dataColumns = data.getDataColumns();
    expect(dataColumns.length).to.equal(3);
    expect(dataColumns[0]).to.equal(column10);
    expect(dataColumns[1]).to.equal(column11);
    expect(dataColumns[2]).to.equal(column12);
  });

  function newDataColumn(x, y) {
    return [
      {
        x,
        y
      },
      {
        x,
        y: y + 1
      }
    ];
  }
});
