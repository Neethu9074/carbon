/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow, mount } from 'enzyme';
import React from 'react';

import { CarbonModal, CarbonTable, CarbonTableRow, CarbonTableHeader } from '@instana/components';

import {
  ChartTableComponent,
  createTableHeadersFromBarChart,
  createTableRowsFromBarChart,
  sortRow,
  getNextSortDirection
} from 'in-components/Chart/ChartTableComponent';

describe('ChartTableComponent', () => {
  it('renders without errors', () => {
    shallow(<ChartTableComponent />);
  });

  it('renders the table with empty params', () => {
    const chart = {
      config: {
        y1: {
          labels: [],
          metrics: [],
          formatter: []
        },
        filteredDataSeries: []
      }
    };
    const wrapper = mount(<ChartTableComponent chart={chart} openTableView setOpenTableView={() => {}} />);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
    expect(wrapper.find(CarbonTable)).toHaveLength(1);
    expect(wrapper.find(CarbonTableRow)).toHaveLength(1);
    expect(wrapper.find(CarbonTableHeader)).toHaveLength(3);
    expect(wrapper.find(CarbonTable).text()).toEqual(
      'Click to sort rows by Group header in ascending orderGroupClick to sort rows by x-value (Time) header in ascending orderx-value (Time)Click to sort rows by y-value header in ascending ordery-value'
    );
    expect(wrapper.find('thead')).toHaveLength(1);
    expect(wrapper.find('tr')).toHaveLength(1);
  });

  it('renders the table with params no formatter', () => {
    const chart = {
      config: {
        y1: {
          labels: ['1XX', '2XX'],
          metrics: [
            [
              [1729270080000, 0.0038],
              [1729270140000, 0.0063],
              [1729270200000, 0.002]
            ],
            [
              [1729270080000, 0.0048],
              [1729270140000, 0.0073],
              [1729270200000, 0.003]
            ]
          ]
        }
      }
    };
    const wrapper = mount(<ChartTableComponent chart={chart} openTableView setOpenTableView={() => {}} />);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
    expect(wrapper.find(CarbonTable)).toHaveLength(1);
    expect(wrapper.find(CarbonTableRow)).toHaveLength(7);
    expect(wrapper.find(CarbonTableHeader)).toHaveLength(3);
    expect(wrapper.find(CarbonTable).text()).toEqual(
      'Click to sort rows by Group header in ascending orderGroupClick to sort rows by x-value (Time) header in ascending orderx-value (Time)Click to sort rows by y-value header in ascending ordery-value1XX2024-10-18, 18:48:000.00381XX2024-10-18, 18:49:000.00631XX2024-10-18, 18:50:000.0022XX2024-10-18, 18:48:000.00482XX2024-10-18, 18:49:000.00732XX2024-10-18, 18:50:000.003'
    );
    expect(wrapper.find('thead')).toHaveLength(1);
    expect(wrapper.find('tr')).toHaveLength(7);
  });

  it('renders the table with params with filter and attempts to sort', () => {
    const chart = {
      config: {
        y1: {
          labels: ['1XX', '2XX'],
          metrics: [
            [
              [1729270080000, 0.0038],
              [1729270140000, 0.0063],
              [1729270200000, 0.002]
            ],
            [
              [1729270080000, 0.0048],
              [1729270140000, 0.0073],
              [1729270200000, 0.003]
            ]
          ],
          formatter: []
        },
        filteredDataSeries: new Set(['y1-1'])
      }
    };
    const wrapper = mount(<ChartTableComponent chart={chart} openTableView setOpenTableView={() => {}} />);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
    expect(wrapper.find(CarbonTable)).toHaveLength(1);
    expect(wrapper.find(CarbonTableRow)).toHaveLength(4);
    expect(wrapper.find(CarbonTableHeader)).toHaveLength(3);
    expect(wrapper.find(CarbonTable).text()).toEqual(
      'Click to sort rows by Group header in ascending orderGroupClick to sort rows by x-value (Time) header in ascending orderx-value (Time)Click to sort rows by y-value header in ascending ordery-value1XX2024-10-18, 18:48:000.00381XX2024-10-18, 18:49:000.00631XX2024-10-18, 18:50:000.002'
    );
    expect(wrapper.find('thead')).toHaveLength(1);
    expect(wrapper.find('tr')).toHaveLength(4);
    expect(wrapper.find('button').at(1)).toHaveLength(1);
    expect(wrapper.find('button.cds--table-sort--active')).toHaveLength(0);
    expect(wrapper.find('button.cds--table-sort--descending')).toHaveLength(0);
    expect(wrapper.find('button').at(1).simulate('click', {}));
    expect(wrapper.find('button.cds--table-sort--active')).toHaveLength(1);
    expect(wrapper.find('button.cds--table-sort--descending')).toHaveLength(0);
    expect(wrapper.find('button').at(1).simulate('click', {}));
    expect(wrapper.find('button.cds--table-sort--active')).toHaveLength(1);
    expect(wrapper.find('button.cds--table-sort--descending')).toHaveLength(1);
    expect(wrapper.find('button').at(1).simulate('click', {}));
    expect(wrapper.find('button.cds--table-sort--active')).toHaveLength(1);
    expect(wrapper.find('button.cds--table-sort--descending')).toHaveLength(0);
  });

  it('renders the table with params all filtered out', () => {
    const chart = {
      config: {
        y1: {
          labels: ['1XX', '2XX'],
          metrics: [
            [
              [1729270080000, 0.0038],
              [1729270140000, 0.0063],
              [1729270200000, 0.002]
            ],
            [
              [1729270080000, 0.0048],
              [1729270140000, 0.0073],
              [1729270200000, 0.003]
            ]
          ]
        },
        filteredDataSeries: new Set(['y1-1', 'y1-0'])
      }
    };
    const wrapper = mount(<ChartTableComponent chart={chart} openTableView setOpenTableView={() => {}} />);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
    expect(wrapper.find(CarbonTable)).toHaveLength(1);
    expect(wrapper.find(CarbonTableRow)).toHaveLength(1);
    expect(wrapper.find(CarbonTableHeader)).toHaveLength(3);
    expect(wrapper.find(CarbonTable).text()).toEqual(
      'Click to sort rows by Group header in ascending orderGroupClick to sort rows by x-value (Time) header in ascending orderx-value (Time)Click to sort rows by y-value header in ascending ordery-value'
    );
    expect(wrapper.find('thead')).toHaveLength(1);
    expect(wrapper.find('tr')).toHaveLength(1);
  });
});

describe('createTableHeadersFromBarChart', () => {
  it('returns proper defined headers', () => {
    expect(createTableHeadersFromBarChart()).toEqual([
      { header: 'Group', key: 'label', sortDirection: 'NONE' },
      { header: 'x-value (Time)', key: 'time', sortDirection: 'NONE' },
      { header: 'y-value', key: 'value', sortDirection: 'NONE' }
    ]);
  });
});

describe('getNextSortDirection', () => {
  it('handle the cases for sort directions', () => {
    expect(getNextSortDirection('label', 'label', 'ASC')).toEqual('DESC');
    expect(getNextSortDirection('label', 'label', 'DESC')).toEqual('ASC');
    expect(getNextSortDirection('label', 'label', 'NONE')).toEqual('ASC');
    expect(getNextSortDirection('label', 'time', 'NONE')).toEqual('ASC');
    expect(getNextSortDirection('label', 'time', 'ASC')).toEqual('ASC');
    expect(getNextSortDirection('label', 'time', 'DESC')).toEqual('ASC');
    expect(getNextSortDirection('time', 'time', 'DESC')).toEqual('ASC');
    expect(getNextSortDirection('time', 'time', 'ASC')).toEqual('DESC');
  });
});

describe('createTableRowsFromBarChart', () => {
  it('general case to handle row generation without filters', () => {
    const labels = ['1XX', '2XX'];
    const metrics = [
      [
        [1729270080000, 0.0038],
        [1729270140000, 0.0063],
        [1729270200000, 0.002]
      ],
      [
        [1729270080000, 0.0048],
        [1729270140000, 0.0073],
        [1729270200000, 0.003]
      ]
    ];
    const formatter = () => {};
    const filteredDataSeries = [];
    const chart = {
      config: {
        y1: {
          labels: labels,
          metrics: metrics,
          formatter: formatter
        },
        filteredDataSeries: filteredDataSeries
      }
    };
    const result = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      }
    ];
    expect(createTableRowsFromBarChart(chart, [], 'y1')).toEqual(result);
  });

  it('general case to handle row generation with filters', () => {
    const labels = ['1XX', '2XX'];
    const metrics = [
      [
        [1729270080000, 0.0038],
        [1729270140000, 0.0063],
        [1729270200000, 0.002]
      ],
      [
        [1729270080000, 0.0048],
        [1729270140000, 0.0073],
        [1729270200000, 0.003]
      ]
    ];
    const formatter = () => {};
    const filteredDataSeries = new Set(['y1-1']);
    const chart = {
      config: {
        y1: {
          labels: labels,
          metrics: metrics,
          formatter: formatter
        },
        filteredDataSeries: filteredDataSeries
      }
    };
    const result = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      }
    ];
    expect(createTableRowsFromBarChart(chart, [], 'y1')).toEqual(result);
  });
});

describe('sortRow', () => {
  it('general cases for sorting a row', () => {
    const rows = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      }
    ];
    const rowsLabelDesc = [
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      }
    ];
    const rowsTimAsc = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      }
    ];
    const rowsTimeDesc = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      }
    ];
    const rowsValueAsc = [
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      }
    ];

    const rowsValueDesc = [
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0073,
        valueRaw: 0.0073
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:49:00',
        timeRaw: 1729270140000,
        value: 0.0063,
        valueRaw: 0.0063
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0048,
        valueRaw: 0.0048
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:48:00',
        timeRaw: 1729270080000,
        value: 0.0038,
        valueRaw: 0.0038
      },
      {
        label: '2XX',
        labelRaw: '2XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.003,
        valueRaw: 0.003
      },
      {
        label: '1XX',
        labelRaw: '1XX',
        time: '2024-10-18, 18:50:00',
        timeRaw: 1729270200000,
        value: 0.002,
        valueRaw: 0.002
      }
    ];
    expect(sortRow('label', rows, 'NONE')).toEqual(rows);
    expect(sortRow('label', rows, 'ASC')).toEqual(rows);
    expect(sortRow('label', rows, 'DESC')).toEqual(rowsLabelDesc);
    expect(sortRow('time', rows, 'NONE')).toEqual(rows);
    expect(sortRow('time', rows, 'ASC')).toEqual(rowsTimAsc);
    expect(sortRow('time', rows, 'DESC')).toEqual(rowsTimeDesc);
    expect(sortRow('value', rows, 'NONE')).toEqual(rows);
    expect(sortRow('value', rows, 'ASC')).toEqual(rowsValueAsc);
    expect(sortRow('value', rows, 'DESC')).toEqual(rowsValueDesc);
  });
});
