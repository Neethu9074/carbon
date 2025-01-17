/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  Bins,
  createBinsArrayObject,
  formatBins,
  getMaxLabelCharsCount,
  groupBinsByFormattedValue,
  isLabelVisible,
  roundUp
} from 'in-components/HistogramChart/components/HistogramChartPresenter/utils/utils';
import { formatters } from 'in-components/HistogramChart/components/HistogramChartPresenter/utils';

const maxVisibleLabels = 5;

const largeBinsDataset = [
  [0, 0],
  [0, 108989],
  [0.0093, 0],
  [0.0103, 116840],
  [0.0182, 0],
  [0.02, 77694],
  [0.0294, 0],
  [0.0323, 46960],
  [0.0391, 0],
  [0.043, 37927],
  [0.0473, 0],
  [0.052, 33038],
  [0.0573, 0],
  [0.063, 31500],
  [0.0693, 0],
  [0.0762, 40852],
  [0.0839, 31819],
  [0.0922, 19866],
  [0.1015, 14263],
  [0.1116, 12008],
  [0.1228, 9179],
  [0.1351, 9297],
  [0.1486, 8187],
  [0.1635, 12955],
  [0.1798, 5136],
  [0.1978, 8741],
  [0.2176, 8305],
  [0.2393, 6819],
  [0.2633, 6202],
  [0.2896, 2229],
  [0.3186, 3141],
  [0.3504, 7360],
  [0.3855, 1837],
  [0.424, 1483],
  [0.4665, 1166],
  [0.5131, 1388],
  [0.5644, 721],
  [0.6209, 462],
  [0.683, 404],
  [0.7513, 492],
  [0.8264, 160],
  [0.909, 340],
  [1, 296],
  [1.1, 1],
  [null, 0]
];

describe('createBinsArrayObject', () => {
  it('with empty bins', () => {
    const bins: Bins = [];

    const result = createBinsArrayObject({ bins, maxVisibleLabels });

    expect(result).toEqual([]);
  });

  it('with a single bin', () => {
    const bins: Bins = [[0, 10]];

    const result = createBinsArrayObject({ bins, maxVisibleLabels });

    expect(result).toEqual([{ from: null, to: 0, calls: 10, tickMark: false }]);
  });

  it('with multiple bins', () => {
    const bins: Bins = [
      ['0%', 1],
      ['10,000%', 1],
      ['15,000%', 1],
      ['20,000%', 1],
      ['25,000%', 1],
      [null, 2]
    ];

    const result = createBinsArrayObject({ bins, maxVisibleLabels });

    expect(result).toEqual([
      { calls: 1, from: null, tickMark: false, to: '0%' },
      { calls: 1, from: '0%', tickMark: true, to: '10,000%' },
      { calls: 1, from: '10,000%', tickMark: true, to: '15,000%' },
      { calls: 1, from: '15,000%', tickMark: true, to: '20,000%' },
      { calls: 1, from: '20,000%', tickMark: true, to: '25,000%' },
      { calls: 2, from: '25,000%', tickMark: true, to: null }
    ]);
  });

  it('with infinity and upper bound', () => {
    const bins: any = [
      [0, 10],
      [null, 20]
    ];

    const result = createBinsArrayObject({ bins, maxVisibleLabels });

    expect(result).toEqual([
      { calls: 10, from: null, tickMark: false, to: 0 },
      { calls: 20, from: 0, tickMark: true, to: null }
    ]);
  });

  it('with large dataset', () => {
    // @ts-expect-error
    const aggregatedBins = groupBinsByFormattedValue(largeBinsDataset);
    const result = createBinsArrayObject({ bins: aggregatedBins, maxVisibleLabels });

    expect(result).toEqual([
      { calls: 108989, from: null, tickMark: false, to: 0 },
      { calls: 0, from: 0, tickMark: true, to: 0.0093 },
      { calls: 116840, from: 0.0093, tickMark: false, to: 0.0103 },
      { calls: 0, from: 0.0103, tickMark: false, to: 0.0182 },
      { calls: 77694, from: 0.0182, tickMark: false, to: 0.02 },
      { calls: 0, from: 0.02, tickMark: false, to: 0.0294 },
      { calls: 46960, from: 0.0294, tickMark: false, to: 0.0323 },
      { calls: 0, from: 0.0323, tickMark: false, to: 0.0391 },
      { calls: 37927, from: 0.0391, tickMark: false, to: 0.043 },
      { calls: 0, from: 0.043, tickMark: true, to: 0.0473 },
      { calls: 33038, from: 0.0473, tickMark: false, to: 0.052 },
      { calls: 0, from: 0.052, tickMark: false, to: 0.0573 },
      { calls: 31500, from: 0.0573, tickMark: false, to: 0.063 },
      { calls: 0, from: 0.063, tickMark: false, to: 0.0693 },
      { calls: 40852, from: 0.0693, tickMark: false, to: 0.0762 },
      { calls: 31819, from: 0.0762, tickMark: false, to: 0.0839 },
      { calls: 19866, from: 0.0839, tickMark: false, to: 0.0922 },
      { calls: 14263, from: 0.0922, tickMark: false, to: 0.1015 },
      { calls: 12008, from: 0.1015, tickMark: true, to: 0.1116 },
      { calls: 9179, from: 0.1116, tickMark: false, to: 0.1228 },
      { calls: 9297, from: 0.1228, tickMark: false, to: 0.1351 },
      { calls: 8187, from: 0.1351, tickMark: false, to: 0.1486 },
      { calls: 12955, from: 0.1486, tickMark: false, to: 0.1635 },
      { calls: 5136, from: 0.1635, tickMark: false, to: 0.1798 },
      { calls: 8741, from: 0.1798, tickMark: false, to: 0.1978 },
      { calls: 8305, from: 0.1978, tickMark: false, to: 0.2176 },
      { calls: 6819, from: 0.2176, tickMark: false, to: 0.2393 },
      { calls: 6202, from: 0.2393, tickMark: true, to: 0.2633 },
      { calls: 2229, from: 0.2633, tickMark: false, to: 0.2896 },
      { calls: 3141, from: 0.2896, tickMark: false, to: 0.3186 },
      { calls: 7360, from: 0.3186, tickMark: false, to: 0.3504 },
      { calls: 1837, from: 0.3504, tickMark: false, to: 0.3855 },
      { calls: 1483, from: 0.3855, tickMark: false, to: 0.424 },
      { calls: 1166, from: 0.424, tickMark: false, to: 0.4665 },
      { calls: 1388, from: 0.4665, tickMark: false, to: 0.5131 },
      { calls: 721, from: 0.5131, tickMark: false, to: 0.5644 },
      { calls: 462, from: 0.5644, tickMark: true, to: 0.6209 },
      { calls: 404, from: 0.6209, tickMark: false, to: 0.683 },
      { calls: 492, from: 0.683, tickMark: false, to: 0.7513 },
      { calls: 160, from: 0.7513, tickMark: false, to: 0.8264 },
      { calls: 340, from: 0.8264, tickMark: false, to: 0.909 },
      { calls: 296, from: 0.909, tickMark: false, to: 1 },
      { calls: 1, from: 1, tickMark: false, to: 1.1 },
      { calls: 0, from: 1.1, tickMark: true, to: null }
    ]);
  });
});

describe('groupBinsByFormattedValue', () => {
  it('multiple keys with duplicated values', () => {
    const bins: Bins = [
      [0, 0],
      [0, 1],
      [0, 0],
      [0, 1],
      [0, 1],
      [0, 2],
      [0, 20],
      [0, 30],
      [0, 5],
      [1, 2]
    ];

    const result = groupBinsByFormattedValue(bins);

    expect(result).toEqual([
      [0, 60],
      [1, 2]
    ]);
  });

  it('multiple keys with duplicated and non-duplicated values', () => {
    const bins: Bins = [
      [1, 10],
      [2, 20],
      [3, 30],
      [2, 20],
      [1, 5],
      [3, 10]
    ];

    const result = groupBinsByFormattedValue(bins);

    expect(result).toEqual([
      [1, 15],
      [2, 40],
      [3, 40]
    ]);
  });

  it('single key with unique values', () => {
    const bins: Bins = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ];

    const result = groupBinsByFormattedValue(bins);

    expect(result).toEqual([[0, 15]]);
  });

  it('empty input array', () => {
    const bins: Bins = [];

    const result = groupBinsByFormattedValue(bins);

    expect(result).toEqual([]);
  });

  it('with large dataset', () => {
    // @ts-expect-error
    const result = groupBinsByFormattedValue(largeBinsDataset);

    expect(result).toEqual([
      [0, 108989],
      [0.0093, 0],
      [0.0103, 116840],
      [0.0182, 0],
      [0.02, 77694],
      [0.0294, 0],
      [0.0323, 46960],
      [0.0391, 0],
      [0.043, 37927],
      [0.0473, 0],
      [0.052, 33038],
      [0.0573, 0],
      [0.063, 31500],
      [0.0693, 0],
      [0.0762, 40852],
      [0.0839, 31819],
      [0.0922, 19866],
      [0.1015, 14263],
      [0.1116, 12008],
      [0.1228, 9179],
      [0.1351, 9297],
      [0.1486, 8187],
      [0.1635, 12955],
      [0.1798, 5136],
      [0.1978, 8741],
      [0.2176, 8305],
      [0.2393, 6819],
      [0.2633, 6202],
      [0.2896, 2229],
      [0.3186, 3141],
      [0.3504, 7360],
      [0.3855, 1837],
      [0.424, 1483],
      [0.4665, 1166],
      [0.5131, 1388],
      [0.5644, 721],
      [0.6209, 462],
      [0.683, 404],
      [0.7513, 492],
      [0.8264, 160],
      [0.909, 340],
      [1, 296],
      [1.1, 1],
      [null, 0]
    ]);
  });

  it('with percentage', () => {
    const result = groupBinsByFormattedValue([
      [0, 3921447],
      ['0.01%', 15],
      ['0.02%', 9],
      ['0.03%', 6],
      ['0.04%', 16],
      ['0.05%', 6],
      ['0.06%', 6],
      ['0.07%', 11],
      ['0.08%', 6],
      ['0.09%', 5],
      ['0.10%', 5],
      ['0.11%', 8],
      ['0.12%', 11],
      ['0.13%', 10],
      ['0.15%', 7],
      ['0.16%', 20],
      ['0.18%', 24],
      ['0.20%', 42],
      ['0.22%', 106],
      ['0.24%', 116],
      ['0.27%', 170],
      ['0.29%', 171],
      ['0.32%', 133],
      ['0.36%', 178],
      ['0.39%', 196],
      ['0.43%', 263],
      ['0.48%', 355],
      ['0.52%', 232],
      ['0.58%', 483],
      ['0.64%', 1290],
      ['0.70%', 1427],
      ['0.77%', 485],
      ['0.85%', 97],
      ['0.93%', 58],
      ['1.03%', 316206],
      ['1.13%', 30],
      ['1.24%', 24],
      ['1.37%', 22],
      ['1.50%', 10],
      ['1.66%', 15],
      ['1.82%', 21],
      ['2.00%', 79462],
      ['2.20%', 3],
      ['2.43%', 4],
      ['2.67%', 5],
      ['2.94%', 23],
      ['3.23%', 62732],
      ['3.55%', 5],
      ['3.91%', 18],
      ['4.30%', 33686],
      ['4.73%', 12],
      ['5.20%', 17063],
      ['5.73%', 12],
      ['6.30%', 18342],
      ['6.93%', 15],
      ['7.62%', 16748],
      ['8.39%', 14019],
      ['9.22%', 13739],
      ['10.15%', 10070],
      ['11.16%', 8865],
      ['12.28%', 8447],
      ['13.51%', 6252],
      ['14.86%', 5048],
      ['16.35%', 9484],
      ['17.98%', 5125],
      ['19.78%', 10850],
      ['21.76%', 11384],
      ['23.93%', 9730],
      ['26.33%', 13990],
      ['28.96%', 8495],
      ['31.86%', 10595],
      ['35.04%', 11426],
      ['38.55%', 4951],
      ['42.40%', 9227],
      ['46.65%', 6939],
      ['51.31%', 7864],
      ['56.44%', 6587],
      ['62.09%', 6813],
      ['68.30%', 2888],
      ['75.13%', 2497],
      ['82.64%', 1296],
      ['90.90%', 1146],
      ['100.00%', 1394],
      ['110.00%', 2886],
      ['121.00%', 2149],
      ['133.10%', 2442],
      ['146.41%', 2001],
      ['161.05%', 2447],
      ['177.15%', 1918],
      ['194.87%', 2205],
      ['214.35%', 1384],
      ['235.79%', 510],
      ['259.37%', 199],
      ['285.31%', 107],
      ['313.84%', 46],
      ['345.22%', 59],
      ['379.75%', 36],
      ['417.72%', 50],
      ['459.49%', 33],
      ['505.44%', 43],
      ['555.99%', 28],
      ['611.59%', 19],
      ['672.75%', 3],
      [null, 1]
    ]);

    expect(result).toEqual([
      [0, 3921447],
      ['0.01%', 15],
      ['0.02%', 9],
      ['0.03%', 6],
      ['0.04%', 16],
      ['0.05%', 6],
      ['0.06%', 6],
      ['0.07%', 11],
      ['0.08%', 6],
      ['0.09%', 5],
      ['0.10%', 5],
      ['0.11%', 8],
      ['0.12%', 11],
      ['0.13%', 10],
      ['0.15%', 7],
      ['0.16%', 20],
      ['0.18%', 24],
      ['0.20%', 42],
      ['0.22%', 106],
      ['0.24%', 116],
      ['0.27%', 170],
      ['0.29%', 171],
      ['0.32%', 133],
      ['0.36%', 178],
      ['0.39%', 196],
      ['0.43%', 263],
      ['0.48%', 355],
      ['0.52%', 232],
      ['0.58%', 483],
      ['0.64%', 1290],
      ['0.70%', 1427],
      ['0.77%', 485],
      ['0.85%', 97],
      ['0.93%', 58],
      ['1.03%', 316206],
      ['1.13%', 30],
      ['1.24%', 24],
      ['1.37%', 22],
      ['1.50%', 10],
      ['1.66%', 15],
      ['1.82%', 21],
      ['2.00%', 79462],
      ['2.20%', 3],
      ['2.43%', 4],
      ['2.67%', 5],
      ['2.94%', 23],
      ['3.23%', 62732],
      ['3.55%', 5],
      ['3.91%', 18],
      ['4.30%', 33686],
      ['4.73%', 12],
      ['5.20%', 17063],
      ['5.73%', 12],
      ['6.30%', 18342],
      ['6.93%', 15],
      ['7.62%', 16748],
      ['8.39%', 14019],
      ['9.22%', 13739],
      ['10.15%', 10070],
      ['11.16%', 8865],
      ['12.28%', 8447],
      ['13.51%', 6252],
      ['14.86%', 5048],
      ['16.35%', 9484],
      ['17.98%', 5125],
      ['19.78%', 10850],
      ['21.76%', 11384],
      ['23.93%', 9730],
      ['26.33%', 13990],
      ['28.96%', 8495],
      ['31.86%', 10595],
      ['35.04%', 11426],
      ['38.55%', 4951],
      ['42.40%', 9227],
      ['46.65%', 6939],
      ['51.31%', 7864],
      ['56.44%', 6587],
      ['62.09%', 6813],
      ['68.30%', 2888],
      ['75.13%', 2497],
      ['82.64%', 1296],
      ['90.90%', 1146],
      ['100.00%', 1394],
      ['110.00%', 2886],
      ['121.00%', 2149],
      ['133.10%', 2442],
      ['146.41%', 2001],
      ['161.05%', 2447],
      ['177.15%', 1918],
      ['194.87%', 2205],
      ['214.35%', 1384],
      ['235.79%', 510],
      ['259.37%', 199],
      ['285.31%', 107],
      ['313.84%', 46],
      ['345.22%', 59],
      ['379.75%', 36],
      ['417.72%', 50],
      ['459.49%', 33],
      ['505.44%', 43],
      ['555.99%', 28],
      ['611.59%', 19],
      ['672.75%', 3],
      [null, 1]
    ]);
  });
});

describe('isLabelVisible', () => {
  it('maxVisibleLabels having 0 as value', () => {
    const expected = [false, true, false, false, false, false, false, false, false, true];
    const result = [];
    const totalBuckets = 10;
    const maxVisibleLabels = 0;

    for (let i = 0; i < totalBuckets; i++) {
      result.push(isLabelVisible({ bucketIndex: i, totalBuckets, maxVisibleLabels }));
    }

    expect(result).toEqual(expected);
  });

  it('maxVisibleLabels having 1 as value', () => {
    const expected = [false, true, false, false, false, false, false, false, false, true];
    const result = [];
    const totalBuckets = 10;
    const maxVisibleLabels = 1;

    for (let i = 0; i < totalBuckets; i++) {
      result.push(isLabelVisible({ bucketIndex: i, totalBuckets, maxVisibleLabels }));
    }

    expect(result).toEqual(expected);
  });

  it('maxVisibleLabels having 5 as value', () => {
    const expected = [false, true, true, false, true, false, true, false, true, true];
    const result = [];
    const totalBuckets = 10;
    const maxVisibleLabels = 5;

    for (let i = 0; i < totalBuckets; i++) {
      result.push(isLabelVisible({ bucketIndex: i, totalBuckets, maxVisibleLabels }));
    }

    expect(result).toEqual(expected);
  });

  it('maxVisibleLabels greater than or equal to totalBuckets', () => {
    const expected = [false, true, true, true, true];
    const result = [];
    const totalBuckets = 5;
    const maxVisibleLabels = 7;

    for (let i = 0; i < totalBuckets; i++) {
      result.push(isLabelVisible({ bucketIndex: i, totalBuckets, maxVisibleLabels }));
    }

    expect(result).toEqual(expected);
  });
});

describe('getMaxLabelCharsCount', () => {
  it('bins with different labels', () => {
    const bins: Bins = [
      [0, 3921447],
      ['611.59%', 19],
      ['672.75%', 3],
      [null, 1]
    ];

    const result = getMaxLabelCharsCount(bins);

    expect(result).toEqual(9);
  });

  it('empty bins', () => {
    const bins: Bins = [];

    const result = getMaxLabelCharsCount(bins);

    expect(result).toEqual(0);
  });

  it('single bin with long label', () => {
    const bins: Bins = [['100.000.000.000.000.000%', 1]];

    const result = getMaxLabelCharsCount(bins);

    expect(result).toEqual(24);
  });
});

describe('formatBins', () => {
  it('empty array', () => {
    const bins: Bins = [];
    const formatter = {
      name: 'percentage',
      type: 'compact',
      applyFormatter: formatters.percentage.compact
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([]);
  });

  it('with non-values', () => {
    const bins: Bins = [
      [10, 5],
      [20, 10],
      [30, 3]
    ];
    const formatter = {
      name: 'percentage',
      type: 'compact',
      applyFormatter: formatters.percentage.compact
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['1,000%', 5],
      ['2,000%', 10],
      ['3,000%', 3]
    ]);
  });

  it('with special cases - number 42 formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'number',
      type: 'compact',
      applyFormatter: formatters.number.compact
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0', 0],
      ['0', 3455374],
      ['1', 0],
      ['1', 35295],
      ['1', 7010],
      ['1', 10575],
      ['1', 4945],
      ['1', 10],
      [null, 0]
    ]);
  });

  it('with special cases - number 42.12 formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'number',
      type: 'detailed',
      applyFormatter: formatters.number.detailed
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0.00', 0],
      ['0.00', 3455374],
      ['0.01', 0],
      ['0.02', 35295],
      ['0.09', 7010],
      ['0.10', 10575],
      ['0.11', 4945],
      ['0.43', 10],
      [null, 0]
    ]);
  });

  it('with special cases - bytes e.g. 3MiB formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'bytes',
      type: 'compact',
      applyFormatter: formatters.bytes.compact
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0 B', 0],
      ['0 B', 3455374],
      ['1 B', 0],
      ['1 B', 35295],
      ['1 B', 7010],
      ['1 B', 10575],
      ['1 B', 4945],
      ['1 B', 10],
      [null, 0]
    ]);
  });

  it('with special cases - bytes e.g. 3.00MiB formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'bytes',
      type: 'detailed',
      applyFormatter: formatters.bytes.detailed
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0.00 B', 0],
      ['0.00 B', 3455374],
      ['0.01 B', 0],
      ['0.02 B', 35295],
      ['0.09 B', 7010],
      ['0.10 B', 10575],
      ['0.11 B', 4945],
      ['0.43 B', 10],
      [null, 0]
    ]);
  });

  it('with special cases - milliseconds e.g. 42ms formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'millis',
      type: 'compact',
      applyFormatter: formatters.millis.compact
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0ms', 0],
      ['0ms', 3455374],
      ['1ms', 0],
      ['1ms', 35295],
      ['1ms', 7010],
      ['1ms', 10575],
      ['1ms', 4945],
      ['1ms', 10],
      [null, 0]
    ]);
  });

  it('with special cases - milliseconds e.g. 42.15ms formatter', () => {
    const bins: Bins = [
      [0, 0],
      [0, 3455374],
      [0.0093, 0],
      [0.0103, 35295],
      [0.0839, 7010],
      [0.0922, 10575],
      [0.1015, 4945],
      [0.424, 10],
      [null, 0]
    ];
    const formatter = {
      name: 'millis',
      type: 'detailed',
      applyFormatter: formatters.millis.detailed
    };

    const result = formatBins({ bins, formatter });

    expect(result).toEqual([
      ['0.00ms', 0],
      ['0.00ms', 3455374],
      ['0.01ms', 0],
      ['0.02ms', 35295],
      ['0.09ms', 7010],
      ['0.10ms', 10575],
      ['0.11ms', 4945],
      ['0.43ms', 10],
      [null, 0]
    ]);
  });
});

describe('roundUp', () => {
  it('rounding up to 0 decimal places', () => {
    const value = 3.14;
    const decimalPlaces = 0;

    const result = roundUp({ value, decimalPlaces });

    expect(result).toEqual(4);
  });

  it('rounding up to 2 decimal places', () => {
    const value = 3.14159;
    const decimalPlaces = 2;

    const result = roundUp({ value, decimalPlaces });

    expect(result).toEqual(3.15);
  });

  it('rounding up negative values', () => {
    const value = -1.234;
    const decimalPlaces = 2;

    const result = roundUp({ value, decimalPlaces });

    expect(result).toEqual(-1.23);
  });

  it('rounding up a whole number', () => {
    const value = 6;
    const decimalPlaces = 1;

    const result = roundUp({ value, decimalPlaces });

    expect(result).toEqual(6);
  });

  it('rounding up to large decimal number of decimals', () => {
    const value = 1.23456789;
    const decimalPlaces = 8;

    const result = roundUp({ value, decimalPlaces });

    expect(result).toEqual(1.23456789);
  });
});
