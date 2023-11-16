/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error needs ts migration
import { getGroups } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';

const groups = [
  {
    groupbyTag: 'clr.target',
    tagType: 'STRING'
  },
  {
    groupbyTag: 'clr.dependency',
    tagType: 'STRING'
  }
];

describe('getGroups', () => {
  it('should return a single group when isMultiGroup is false', () => {
    const result = getGroups({
      isMultiGroup: false,
      infraExploreGrouping: groups[0]
    });

    expect(result).toEqual({
      groupKey: 'by',
      groups: groups[0]
    });
  });

  it('should return an array of unique groups when isMultiGroup is true and grouping is a single item', () => {
    const result = getGroups({ isMultiGroup: true, infraExploreGrouping: groups[0] });

    expect(result).toEqual({
      groupKey: 'groupBys',
      groups: [groups[0]]
    });
  });

  it('should filter out duplicate groups when isMultiGroup is true and grouping is an array', () => {
    const result = getGroups({
      isMultiGroup: true,
      infraExploreGrouping: [groups[0], groups[0]]
    });

    expect(result).toEqual({
      groupKey: 'groupBys',
      groups: [groups[0]]
    });
  });

  it('should filter out duplicate groups when isMultiGroup is true and grouping is an array', () => {
    const result = getGroups({
      isMultiGroup: true,
      infraExploreGrouping: [groups[0], groups[1], groups[0], groups[1], groups[0], groups[1]]
    });

    expect(result).toEqual({
      groupKey: 'groupBys',
      groups: [groups[0], groups[1]]
    });
  });

  it('should handle an empty grouping array when isMultiGroup is true', () => {
    const result = getGroups({ isMultiGroup: true, infraExploreGrouping: [] });

    expect(result).toEqual({
      groupKey: 'groupBys',
      groups: []
    });
  });
});
