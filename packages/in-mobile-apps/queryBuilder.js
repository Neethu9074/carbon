/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';

export const sessionStart = create('sessionStart');
export const viewChange = create('viewChange');
export const httpRequest = create('httpRequest');
export const custom = create('custom');

function create(beaconType) {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'FILTERING' }),
    getSuggestions: args => getSuggestions({ ...args, beaconType })
  });
}

export function getSuggestions({ name, key, timeConfig, propose, tagFilterExpression, beaconType }) {
  // Add beacon type to avoid presenting suggestions for other data sources
  tagFilterExpression = addTagFilters(tagFilterExpression, [
    {
      name: 'mobileBeacon.type',
      operator: 'EQUALS',
      value: beaconType
    }
  ]);

  const subscriptionParams = {
    timeConfig,
    tagFilterExpression,
    metrics: {
      beaconCount: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    },
    order: {
      by: 'beaconCount',
      direction: 'DESC'
    },
    pagination: {
      retrievalSize: 200
    },
    group: {
      groupbyTag: name
    }
  };

  // Note: We currently do not support suggestions based on partial key/value input
  if (propose === 'VALUES') {
    subscriptionParams.group.groupbyTagSecondLevelKey = key;
  }

  return getMobileAppBeaconGroups(subscriptionParams).map(retainGroupNames);
}

function retainGroupNames(result) {
  if (!result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      suggestions: result.data.items.map(item => JSON.parse(item.name)),
      totalHits: result.data.totalHits
    }
  };
}
