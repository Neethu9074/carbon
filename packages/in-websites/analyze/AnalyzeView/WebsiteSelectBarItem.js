/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import SelectBarItem from 'in-analyze/components/filterBar/SelectBarItem';

export default function WebsiteSelectBarItem(props) {
  return (
    <SelectBarItem
      {...props}
      getSuggestions={({ timeConfig, tagFilters, tag }) => {
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
      }}
    />
  );
}

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
