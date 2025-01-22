/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  findDuplicatedMetricsLabels,
  getUniqueMetricsLabels,
  removeDuplicatesFromArrayObjects
} from 'in-custom-dashboards/widgets/Chart/util';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';

interface Props extends Pick<Metric, 'label'> {
  metric: string;
}

interface Item {
  value: number;
  label: string;
}

describe('findDuplicatedMetricsLabels', () => {
  it('should return an empty array for an empty input', () => {
    const metrics: Partial<Metric>[] = [];
    const duplicatedLabels = findDuplicatedMetricsLabels(metrics);
    expect(duplicatedLabels).toEqual([]);
  });

  it('should return an empty array when no labels are duplicated', () => {
    const metrics: Partial<Metric>[] = [{ label: 'label1' }, { label: 'label2' }, { label: 'label3' }];
    const duplicatedLabels = findDuplicatedMetricsLabels(metrics);
    expect(duplicatedLabels).toEqual([]);
  });

  it('should return duplicated labels', () => {
    const metrics: Partial<Metric>[] = [{ label: 'Used' }, { label: 'Used' }, { label: 'Used' }];
    const duplicatedLabels = findDuplicatedMetricsLabels(metrics);
    expect(duplicatedLabels).toEqual(['Used']);
  });

  it('should handle labels with leading/trailing spaces as unique labels', () => {
    const metrics: Partial<Metric>[] = [
      { label: ' label1 ' },
      { label: 'label2 ' },
      { label: 'label1' },
      { label: ' label3' },
      { label: 'label2' }
    ];
    const duplicatedLabels = findDuplicatedMetricsLabels(metrics);
    expect(duplicatedLabels).toEqual([]);
  });

  it('should handle empty labels as unique labels', () => {
    const metrics: Partial<Metric>[] = [{ label: '' }, { label: 'label1' }, { label: '' }];
    const duplicatedLabels = findDuplicatedMetricsLabels(metrics);
    expect(duplicatedLabels).toEqual([]);
  });
});

describe('getUniqueMetricsLabels', () => {
  it('should return an empty array for an empty input', () => {
    const metrics: Props[] = [];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual([]);
  });

  it('should return unique labels when no duplicates are present', () => {
    const metrics: Props[] = [
      { label: 'label1', metric: 'metric1' },
      { label: 'label2', metric: 'metric2' },
      { label: 'label3', metric: 'metric3' }
    ];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual(['label1', 'label2', 'label3']);
  });

  it('should handle duplicated labels', () => {
    const metrics: Props[] = [
      { label: 'label1', metric: 'memory.used' },
      { label: 'label2', metric: 'metric2' },
      { label: 'label1', metric: 'cpu.used' },
      { label: 'label4', metric: 'metric4' }
    ];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual(['label1 (Memory)', 'label2', 'label1 (Cpu)', 'label4']);
  });

  it('should not modify empty labels', () => {
    const metrics: Props[] = [
      { label: '', metric: 'metric1' },
      { label: '', metric: 'metric2' }
    ];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual(['', '']);
  });

  it('should not modify labels without duplicates', () => {
    const metrics: Props[] = [
      { label: 'label1', metric: 'metric1' },
      { label: 'label2', metric: 'metric2' }
    ];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual(['label1', 'label2']);
  });

  it('should not modify labels if has more than one word', () => {
    const metrics: Props[] = [
      { label: 'Memory Used', metric: 'metric1' },
      { label: 'Memory Used', metric: 'metric2' }
    ];
    const uniqueLabels = getUniqueMetricsLabels(metrics);
    expect(uniqueLabels).toEqual(['Memory Used', 'Memory Used']);
  });
});

describe('removeDuplicatesFromArrayObjects', () => {
  const items = [
    { value: 1, label: 'Item 1' },
    { value: 2, label: 'Item 2' },
    { value: 1, label: 'Item 1' },
    { value: 3, label: 'Item 3' }
  ];

  it('should remove duplicates based on single property', () => {
    const propKeys: Array<keyof Item> = ['value'];
    const uniqueItems = removeDuplicatesFromArrayObjects(items, propKeys);

    expect(uniqueItems).toEqual([
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' }
    ]);
  });

  it('should remove duplicates based on multiple properties', () => {
    const propKeys: Array<keyof Item> = ['value', 'label'];
    const uniqueItems = removeDuplicatesFromArrayObjects(items, propKeys);

    expect(uniqueItems).toEqual([
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' }
    ]);
  });

  it('should handle an empty array', () => {
    const propKeys: Array<keyof Item> = ['value'];
    const uniqueItems = removeDuplicatesFromArrayObjects([], propKeys);

    expect(uniqueItems).toEqual([]);
  });

  it('should handle an array with no duplicates', () => {
    const propKeys: Array<keyof Item> = ['value', 'label'];
    const uniqueItems = removeDuplicatesFromArrayObjects(
      [
        { value: 4, label: 'Item 4' },
        { value: 5, label: 'Item 5' },
        { value: 6, label: 'Item 6' }
      ],
      propKeys
    );

    expect(uniqueItems).toEqual([
      { value: 4, label: 'Item 4' },
      { value: 5, label: 'Item 5' },
      { value: 6, label: 'Item 6' }
    ]);
  });

  it('should handle empty property values', () => {
    const itemsWithEmptyValue: Item[] = [
      { value: 1, label: '' },
      { value: 2, label: 'Item 2' },
      { value: 1, label: '' },
      { value: 3, label: 'Item 3' }
    ];
    const propKeys: Array<keyof Item> = ['label'];
    const uniqueItems = removeDuplicatesFromArrayObjects(itemsWithEmptyValue, propKeys);

    expect(uniqueItems).toEqual([
      { value: 1, label: '' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' }
    ]);
  });
});
