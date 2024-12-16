/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import {
  createGroupingTag,
  createTagFilter,
  filterTag,
  getIconBySeverity,
  getSnapshotId,
  groupAndSortTags,
  trackFilterClick,
  trackGroupClick
} from '../utils';
import {
  containerSnapshotIds,
  CRIO_SNAPSHOT_ID,
  DOCKER_ID,
  DOCKER_SNAPSHOT_ID,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM,
  LOG_RETENTION_TIME,
  LOG_SERVICE_NAME,
  restrictedTags
} from 'in-logging/queryBuilder';
import {
  ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED
} from 'in-services/tracking/eventNames';
import { LogItem, LogTag } from 'in-types';

describe('groupAndSortTags', () => {
  it('should sort infrastructure tags correctly based on containerSnapshotIds', () => {
    const mockTags: LogTag[] = [
      { name: ID_HOST, stringValue: 'host_value' },
      { name: DOCKER_SNAPSHOT_ID, stringValue: 'docker_value' },
      { name: CRIO_SNAPSHOT_ID, stringValue: 'crio_value' },
      { name: 'kubernetes.pod', stringValue: 'pod_value' }
    ];

    const result = groupAndSortTags(mockTags);

    expect(result.infrastructure).toEqual([
      { name: ID_HOST, stringValue: 'host_value' },
      { name: DOCKER_SNAPSHOT_ID, stringValue: 'docker_value' },
      { name: CRIO_SNAPSHOT_ID, stringValue: 'crio_value' }
    ]);
  });

  it('should place non-containerSnapshotIds tags at the end', () => {
    const mockTags: LogTag[] = [
      { name: ID_HOST, stringValue: 'host_value' },
      { name: DOCKER_SNAPSHOT_ID, stringValue: 'docker_value' }
    ];

    const result = groupAndSortTags(mockTags);

    expect(result.infrastructure).toEqual([
      { name: ID_HOST, stringValue: 'host_value' },
      { name: DOCKER_SNAPSHOT_ID, stringValue: 'docker_value' }
    ]);
  });
});

describe('groupAndSortTags', () => {
  it('should group tags into infrastructure, kubernetes, customTags, and other', () => {
    const tags = [
      { name: ID_HOST, stringValue: 'snapshot1' },
      { name: 'kubernetes.pod', stringValue: 'pod1' },
      { name: LOG_CUSTOM, stringValue: 'custom1' },
      { name: 'other.tag', stringValue: 'other1' }
    ] as LogTag[];

    const result = groupAndSortTags(tags);

    expect(result.infrastructure).toEqual([{ name: ID_HOST, stringValue: 'snapshot1' }]);
    expect(result.kubernetes).toEqual([{ name: 'kubernetes.pod', stringValue: 'pod1' }]);
    expect(result.customTags).toEqual([{ name: LOG_CUSTOM, stringValue: 'custom1' }]);
    expect(result.other).toEqual([{ name: 'other.tag', stringValue: 'other1' }]);
  });

  it('should unshift log retention time tag into other', () => {
    const tags = [
      { name: LOG_RETENTION_TIME, stringValue: 'retention1' },
      { name: 'other.tag', stringValue: 'other1' }
    ] as LogTag[];

    const result = groupAndSortTags(tags);

    expect(result.other[0]).toEqual({ name: LOG_RETENTION_TIME, stringValue: 'retention1' });
    expect(result.other).toHaveLength(2);
  });

  it('should sort kubernetes tags based on kubernetesTags order', () => {
    const tags = [
      { name: 'kubernetes.service', stringValue: 'service1' },
      { name: 'kubernetes.pod', stringValue: 'pod1' },
      { name: 'kubernetes.deployment', stringValue: 'deployment1' }
    ] as LogTag[];

    const result = groupAndSortTags(tags);

    expect(result.kubernetes).toEqual([
      { name: 'kubernetes.service', stringValue: 'service1' },
      { name: 'kubernetes.pod', stringValue: 'pod1' },
      { name: 'kubernetes.deployment', stringValue: 'deployment1' }
    ]);
  });
});

describe('trackFilterClick', () => {
  it('should track filter click with correct parameters', () => {
    const mockTrackCTA = jest.fn();
    const mockTag = { name: 'logLevel', key: 'level' } as LogTag;

    trackFilterClick(mockTrackCTA, mockTag, 'ERROR');

    expect(mockTrackCTA).toHaveBeenCalledWith(ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED, {
      filter: { name: 'logLevel', key: 'level', value: 'ERROR' }
    });
  });
});
describe('trackGroupClick', () => {
  it('should track group click with correct parameters', () => {
    const mockTrackCTA = jest.fn();

    trackGroupClick(mockTrackCTA, 'logLevel');

    expect(mockTrackCTA).toHaveBeenCalledWith(ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED, {
      source: 'log message filter button',
      group: 'logLevel'
    });
  });
});

describe('createTagFilter', () => {
  const itemTags: LogTag[] = [
    { name: 'docker', stringValue: 'docker1', key: 'container' },
    { name: 'crio', stringValue: 'crio1', key: 'runtime' }
  ];

  it('should return a tag with only value and name when key is undefined', () => {
    const result = createTagFilter('test-value', itemTags, 'some-tag');

    expect(result).toEqual({
      name: 'some-tag',
      value: 'test-value'
    });
  });

  it('should return alternativeTag when it exists in itemTags', () => {
    const itemTags: LogTag[] = [{ name: DOCKER_ID, stringValue: 'alternativeValue', key: 'alternativeKey' }];

    const result = createTagFilter('valueToFilter', itemTags, DOCKER_SNAPSHOT_ID, 'key');

    expect(result).toEqual({
      name: DOCKER_ID,
      value: 'alternativeValue',
      key: 'alternativeKey'
    });
  });
});

describe('getSnapshotId', () => {
  const mockItem = {
    tags: [
      { name: 'kubernetes.Pod', stringValue: 'pod1' },
      { name: 'kubernetes.Node', stringValue: 'node1' }
    ]
  } as LogItem;

  it('should return stringValue if the tag is part of containerSnapshotIds, ID_HOST, or ID_PROCESS', () => {
    const containerTag = { name: containerSnapshotIds[0], stringValue: 'snapshot1' } as LogTag;
    const hostTag = { name: ID_HOST, stringValue: 'host1' } as LogTag;
    const processTag = { name: ID_PROCESS, stringValue: 'process1' } as LogTag;

    expect(getSnapshotId(containerTag, mockItem)).toBe('snapshot1');
    expect(getSnapshotId(hostTag, mockItem)).toBe('host1');
    expect(getSnapshotId(processTag, mockItem)).toBe('process1');
  });

  it('should return null if no matching kubernetes entity type is found', () => {
    const kubernetesUnknownTag = { name: 'kubernetes.Unknown' } as LogTag;
    expect(getSnapshotId(kubernetesUnknownTag, mockItem)).toBeNull();
  });

  it('should return null if tag does not match any condition', () => {
    const unknownTag = { name: 'random.tag' } as LogTag;
    expect(getSnapshotId(unknownTag, mockItem)).toBeNull();
  });
});

describe('createGroupingTag', () => {
  it('should create a grouping tag with name', () => {
    const result = createGroupingTag('logLevel');

    expect(result).toEqual({ tag: 'logLevel' });
  });

  it('should create a grouping tag with name and key', () => {
    const result = createGroupingTag('logLevel', 'level');

    expect(result).toEqual({ tag: 'logLevel', secondLevelKey: 'level' });
  });

  it('should set tagEntity to DESTINATION when name is LOG_SERVICE_NAME', () => {
    const result = createGroupingTag(LOG_SERVICE_NAME);

    expect(result).toEqual({ tag: LOG_SERVICE_NAME, tagEntity: 'DESTINATION' });
  });
});

describe('filterTag', () => {
  it('should return true if the tag is not restricted', () => {
    restrictedTags.has = jest.fn().mockReturnValue(false);
    const tag = { name: 'logLevel' } as LogTag;

    expect(filterTag(tag)).toBe(true);
  });

  it('should return false if the tag is restricted', () => {
    restrictedTags.has = jest.fn().mockReturnValue(true);
    const tag = { name: 'logLevel' } as LogTag;

    expect(filterTag(tag)).toBe(false);
  });
});

describe('getIconBySeverity', () => {
  it('should return warning icon for severity > 0', () => {
    expect(getIconBySeverity(1)).toBe('lib_help_error_warning');
  });

  it('should return error icon for severity > 5', () => {
    expect(getIconBySeverity(6)).toBe('lib_help_error_error_circle');
  });

  it('should return uncheck icon for severity 0 or less', () => {
    expect(getIconBySeverity(0)).toBe('lib_uncheck');
  });
});
