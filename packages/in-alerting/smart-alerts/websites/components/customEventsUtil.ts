/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { WebsitePaginatedBeaconGroupsItem } from '@instana/types';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { number } from 'in-services/formatters/number';

export function getEventName(item: WebsitePaginatedBeaconGroupsItem): string {
  let label = item.name;
  // We do the below parsing as the back-end is sending name property as json wrapped in string.
  // Ref Code https://github.ibm.com/instana/backend/blob/cd654045c239c68baacc5bd424c3ec81975ac102/appdata-reader/src/main/java/com/instana/application/datareader/command/website/GetWebsiteBeaconGroupsCommandHandler.java#L417-L417
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
  return getWebsitePaginatedBeaconGroups({
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
      groupbyTag: 'beacon.customEvent.name',
      groupbyTagEntity: NOT_APPLICABLE
    },
    metrics: {
      occurrencesAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      usersAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}
