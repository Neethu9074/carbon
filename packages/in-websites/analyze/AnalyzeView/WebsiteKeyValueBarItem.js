/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import KeyValueBarOverlayBehavior from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayBehavior';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-components/overlays/Overlay';

export default function WebsiteKeyValueBarItem(props) {
  const { timeConfig, tagFilters, tag, key } = props;

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

  function getKeySuggestions(timeConfig, tagFilters, tag) {
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
  }

  function getValueSuggestions(timeConfig, tagFilters, tag, key) {
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

  return (
    <Overlay
      withoutWrapper
      content={KeyValueBarOverlayBehavior}
      serializeFilter
      getKeySuggestions={getKeySuggestions(timeConfig, tagFilters, tag)}
      getValueSuggestions={getValueSuggestions(timeConfig, tagFilters, tag, key)}
      props={props}
      align="bottomMiddle"
    >
      {overlayProps => (
        <Content
          serializeFilter
          {...props}
          getKeySuggestions={getKeySuggestions(timeConfig, tagFilters, tag)}
          getValueSuggestions={getValueSuggestions(timeConfig, tagFilters, tag, key)}
          {...overlayProps}
        />
      )}
    </Overlay>
  );
}

const Content = forwardRef(function Content(props, ref) {
  const { label, toggle, isOpen, tagFilters, tag } = props;
  const hasFilters = tagFilters.reduce((agg, f) => agg || f.name === tag, false);

  return (
    <BarItem showArrow isOpen={isOpen} active={isOpen || hasFilters} onClick={toggle} ref={ref}>
      {label}
    </BarItem>
  );
});
