/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import createDataHolder from './dataHolder';
import { column } from './testUtil';

describe('data', () => {
  let data;

  beforeEach(() => {
    data = createDataHolder({
      timewindowMillis: 1000,
      numberOfSeries: 3
    });
  });

  it('must not contain any data columns initially', () => {
    expect(data.getDataColumns()).to.deep.equal([]);
  });

  it('must insert new data columns', () => {
    const newColumns = [
      column([
        [0, 3],
        [0, 2],
        [0, 1]
      ])
    ];
    data.insertSorted(newColumns);
    expect(data.getDataColumns()).to.deep.equal(newColumns);
  });

  it('must support data columns with missing data points', () => {
    const newColumns = [column([[0, 3], undefined, [0, 1]])];
    data.insertSorted(newColumns);
    expect(data.getDataColumns()).to.deep.equal(newColumns);
  });

  it('must merge data columns and overwrite previously missing data points', () => {
    data.insertSorted([column([[0, 3], undefined, [0, 1]])]);
    data.insertSorted([column([null, [0, 4], null])]);
    expect(data.getDataColumns()).to.deep.equal([
      column([
        [0, 3],
        [0, 4],
        [0, 1]
      ])
    ]);
  });

  it('must merge by overwriting previously existing values', () => {
    data.insertSorted([
      column([
        [0, 3],
        [0, 2],
        [0, 1]
      ])
    ]);
    data.insertSorted([column([null, [0, 4], null])]);
    expect(data.getDataColumns()).to.deep.equal([
      column([
        [0, 3],
        [0, 4],
        [0, 1]
      ])
    ]);
  });

  it('must add new data columns to the beginning', () => {
    data.insertSorted([
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ])
    ]);
    data.insertSorted([column([null, [0, 4], null])]);
    expect(data.getDataColumns()).to.deep.equal([
      column([null, [0, 4], null]),
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ])
    ]);
  });

  it('must add new data columns to the end', () => {
    data.insertSorted([
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ])
    ]);
    data.insertSorted([column([null, [2, 4], null])]);
    expect(data.getDataColumns()).to.deep.equal([
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ]),
      column([null, [2, 4], null])
    ]);
  });

  it('must add new data columns inbetween', () => {
    data.insertSorted([
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ]),
      column([
        [3, 4],
        [3, 5],
        [3, 6]
      ])
    ]);
    data.insertSorted([column([null, [2, 4], null])]);
    expect(data.getDataColumns()).to.deep.equal([
      column([
        [1, 3],
        [1, 2],
        [1, 1]
      ]),
      column([null, [2, 4], null]),
      column([
        [3, 4],
        [3, 5],
        [3, 6]
      ])
    ]);
  });

  it('must add even when the first data point is undefined', () => {
    const newColumns = [column([undefined, [0, 3], [0, 1]])];
    data.insertSorted(newColumns);
    expect(data.getDataColumns()).to.deep.equal(newColumns);
  });

  describe('expireDataPointsOlderThan', () => {
    it('must remove old data points', () => {
      data.insertSorted([
        column([
          [1, 3],
          [1, 2],
          [1, 1]
        ]),
        column([
          [2, 4],
          [2, 5],
          [2, 6]
        ]),
        column([
          [3, 4],
          [3, 5],
          [3, 6]
        ])
      ]);

      data.expireDataPointsOlderThan(3);
      expect(data.getDataColumns()).to.deep.equal([
        column([
          [3, 4],
          [3, 5],
          [3, 6]
        ])
      ]);
    });

    it('must not do anything when no data point needs to be removed', () => {
      data.insertSorted([
        column([
          [3, 3],
          [3, 2],
          [3, 1]
        ]),
        column([
          [4, 4],
          [4, 5],
          [4, 6]
        ]),
        column([
          [5, 4],
          [5, 5],
          [5, 6]
        ])
      ]);

      data.expireDataPointsOlderThan(3);
      expect(data.getDataColumns().length).to.equal(3);
    });
  });
});
