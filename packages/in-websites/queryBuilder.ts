/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DEFAULT_MAX_EXPRESSION_DEPTH } from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

export const pageLoad = create('pageLoad');
export const pageChange = create('pageChange');
export const resourceLoad = create('resourceLoad');
export const httpRequest = create('httpRequest');
export const error = create('error');
export const custom = create('custom');

function create(beaconType) {
  return createQueryBuilder({
    maxExpressionDepth: DEFAULT_MAX_EXPRESSION_DEPTH,
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'FILTERING' }),
    getSuggestions: args => getSuggestions({ ...args, beaconType })
  });
}

export function getSuggestions({ name, key, timeConfig, propose, tagFilterExpression, beaconType, dataSource }) {
  // Add beacon type to avoid presenting suggestions for other data sources
  tagFilterExpression = addTagFilters(tagFilterExpression, [
    {
      name: 'beacon.type',
      operator: 'EQUALS',
      // We support dataSource for compatibility with the analyze wrapper
      value: beaconType || dataSource
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

  return getWebsiteBeaconGroups(subscriptionParams).map(retainGroupNames);
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
