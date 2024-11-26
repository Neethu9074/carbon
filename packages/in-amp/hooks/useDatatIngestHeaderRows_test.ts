/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import useDatatIngestHeaderRows, { getDataIngestTableHeaderCell } from 'in-amp/hooks/useDatatIngestHeaderRows';

jest.mock('in-i18n', () => ({
  t: jest.fn((key: string) => key)
}));

describe('in-amp/components/DataIngestTable.js', () => {
  it('Check if data table has correct values.', () => {
    const dataTable = {
      //Dec 2023
      1701388800000: {
        standard: {
          entitled: 50,
          configured: 129,
          budgetPerUnit: 348966092800
        },
        essentials: {
          entitled: 10,
          configured: 5,
          budgetPerUnit: 53687091200
        },
        additional: 0,
        consumed: 8888786300090,
        timestamp: 1701388800000
      }
    };
    const { result } = renderHook(() => useDatatIngestHeaderRows(dataTable, ''));
    const [header, rows] = result.current;

    expect(header).toEqual([
      { header: 'in-amp:components.dataIngestTable.row', key: 'row' },
      { header: '', key: 'title' },
      { header: 'in-amp:components.dataIngestTable.unit', key: 'unit' },
      { header: '', key: 'offering' },
      getDataIngestTableHeaderCell(+Object.keys(dataTable)[0]),
      { header: 'in-amp:components.dataIngestTable.calculation', key: 'calculation' }
    ]);
    expect(rows).toEqual([
      {
        id: '1',
        row: 1,
        unit: 'MVS',
        title: 'in-amp:components.dataIngestTable.entitledNumberOfMVS',
        offering: 'Standard',
        calculation: '',
        [Object.keys(dataTable)[0]]: 50
      },
      {
        id: '2',
        row: 2,
        unit: 'MVS',
        title: '',
        offering: 'Essentials',
        calculation: '',
        [Object.keys(dataTable)[0]]: 10
      },
      {
        id: '3',
        row: 3,
        unit: 'MVS',
        title: 'in-amp:components.dataIngestTable.actualAverage',
        offering: 'Standard',
        calculation: '',
        [Object.keys(dataTable)[0]]: 129
      },
      {
        id: '4',
        row: 4,
        unit: 'MVS',
        title: '',
        offering: 'Essentials',
        calculation: '',
        [Object.keys(dataTable)[0]]: 5
      },
      {
        id: '5',
        row: 5,
        unit: 'MVS',
        title: 'in-amp:components.dataIngestTable.onDemandNumber',
        offering: 'Standard',
        calculation: '(3)-(1)',
        [Object.keys(dataTable)[0]]: 79
      },
      {
        id: '6',
        row: 6,
        unit: 'MVS',
        title: '',
        offering: 'Essentials',
        calculation: '(4)-(2) - ((1)-(3))',
        [Object.keys(dataTable)[0]]: 0
      },
      {
        id: '7',
        row: 7,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.dataIngestFairUseEntitlement',
        offering: 'Standard',
        calculation: '',
        [Object.keys(dataTable)[0]]: 325
      },
      {
        id: '8',
        row: 8,
        unit: 'GB',
        title: '',
        offering: 'Essentials',
        calculation: '',
        [Object.keys(dataTable)[0]]: 50
      },
      {
        id: '9',
        row: 9,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.totalDataIngestFairUseEntitlement',
        offering: 'Standard',
        calculation: '(1)x(7)',
        [Object.keys(dataTable)[0]]: 16250
      },
      {
        id: '10',
        row: 10,
        unit: 'GB',
        title: '',
        offering: 'Essentials',
        calculation: '(2)x(8)',
        [Object.keys(dataTable)[0]]: 500
      },
      {
        id: '11',
        row: 11,
        unit: 'GB',
        title: '',
        offering: 'Total',
        calculation: '(9)+(10)',
        [Object.keys(dataTable)[0]]: 16750
      },
      {
        id: '12',
        row: 12,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.dataIngestAddOnEntitlement',
        offering: '',
        calculation: 'in-amp:components.dataIngestTable.totalAmountPurchased',
        [Object.keys(dataTable)[0]]: 0
      },
      {
        id: '13',
        row: 13,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.dataIngestEntitlementFromOnDemand',
        offering: 'Total',
        calculation: '(5)x(7)+(6)x(8)',
        [Object.keys(dataTable)[0]]: 25675
      },
      {
        id: '14',
        row: 14,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.totalDataIngestEntitlement',
        offering: 'Total',
        calculation: '(11)+(12)+(13)',
        [Object.keys(dataTable)[0]]: 42425
      },
      {
        id: '15',
        row: 15,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.actualDataIngest',
        offering: 'Total',
        calculation: '',
        [Object.keys(dataTable)[0]]: 8278
      },
      {
        id: '16',
        row: 16,
        unit: 'GB',
        title: 'in-amp:components.dataIngestTable.onDemandDataIngest',
        offering: 'Total',
        calculation: '(15)-(14)',
        [Object.keys(dataTable)[0]]: 0
      }
    ]);
  });
});
