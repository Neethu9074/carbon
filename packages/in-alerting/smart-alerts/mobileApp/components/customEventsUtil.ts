/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MobileAppPaginatedBeaconGroupsItem, TagFilterExpression, TimeConfig } from '@instana/types';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { number } from 'in-services/formatters/number';

export function getEventName(item: MobileAppPaginatedBeaconGroupsItem): string {
  let label = item.name;
  // We do the below parsing as the back-end is sending name property as json wrapped in string.

  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }
  return label;
}

export function getMetricCount(
  metric: { [index: string]: number[][] },
  shouldBeFormatted: boolean = false
): string | number {
  if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    return shouldBeFormatted ? number.compact(metric[0][1]) : metric[0][1];
  }

  return valueMissingPlaceholder;
}

export function getTableData({
  timeConfig,
  tagFilterExpression
}: {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}) {
  return getMobileAppPaginatedBeaconGroups({
    tagFilterExpression,
    timeConfig,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'occurrencesAgg',
      direction: 'DESC',
      collation: 'en-US'
    },
    group: {
      groupbyTag: 'mobileBeacon.customEvent.name'
    },
    metrics: {
      occurrencesAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      usersAgg: {
        metric: 'uniqueUsers',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}
