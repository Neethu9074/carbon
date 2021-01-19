/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withProps } from 'recompose';

import KeyValueBarItemBehavior from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarItemBehavior';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';

export default withProps({
  serializeFilter: true,
  getKeySuggestions: ({ timeConfig, tagFilters, tag }) => {
    return getWebsiteBeaconGroups({
      timeConfig: timeConfig,
      tagFilters: tagFilters,
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
        groupbyTag: tag
      }
    }).map(mapData);
  },
  getValueSuggestions: ({ timeConfig, tagFilters, tag, key }) => {
    return getWebsiteBeaconGroups({
      timeConfig: timeConfig,
      tagFilters: tagFilters,
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
        groupbyTag: tag,
        groupbyTagSecondLevelKey: key
      }
    }).map(mapData);
  }
})(KeyValueBarItemBehavior);

function mapData(result) {
  if (!result.data) {
    return result;
  }

  return {
    progress: result.progress,
    errors: result.errors,
    time: result.time,
    data: result.data.items.map(item => JSON.parse(item.name))
  };
}
