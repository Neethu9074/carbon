/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import getWebsiteCountryBreakdown from 'in-websites/subscriptions/getWebsiteCountryBreakdown';
import getWebsiteSubdivisions from 'in-websites/subscriptions/getWebsiteSubdivisions';
import { number } from 'in-services/formatters/number';
import GeoHeatMap from 'in-new-components/GeoHeatMap';

const valueFormatter = v => `${number.compact(v)} page loads`;

export default function WebsiteGeoHeatMap({ height, tagFilters, timeConfig, canDrillDown, controlWrapperClassName }) {
  return (
    <GeoHeatMap
      canDrillDown={canDrillDown}
      getData={countryCode => getData({ countryCode, tagFilters, timeConfig })}
      height={height}
      valueFormatter={valueFormatter}
      notDefinedValue={valueFormatter(0)}
      controlWrapperClassName={controlWrapperClassName}
    />
  );
}

function getData({ countryCode, tagFilters, timeConfig }) {
  tagFilters = tagFilters.concat({
    name: 'beacon.type',
    operator: 'EQUALS',
    stringValue: 'pageLoad'
  });

  if (countryCode) {
    return getWebsiteSubdivisions({
      timeConfig,
      tagFilters: tagFilters.concat({
        name: 'beacon.geo.countryCode',
        operator: 'EQUALS',
        stringValue: countryCode.toUpperCase()
      }),
      pagination: {
        page: 1,
        pageSize: 200
      },
      order: {
        by: 'pageLoads',
        direction: 'DESC'
      },
      metrics: {
        pageLoads: {
          metric: 'pageLoads',
          aggregation: 'SUM'
        }
      }
    }).map(result => {
      if (result.data == null) {
        return null;
      }

      return {
        ...result,
        data: result.data.items.reduce((agg, item) => {
          agg[`${item.countryCode}-${item.subdivisionCode}`.toLowerCase()] = {
            title: item.subdivision,
            value: get(item, ['metrics', 'pageLoads', 0, 1])
          };
          return agg;
        }, {})
      };
    });
  }

  return getWebsiteCountryBreakdown({
    timeConfig,
    tagFilters,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'pageLoads',
      direction: 'DESC'
    }
  }).map(result => {
    if (result.data == null) {
      return null;
    }

    return {
      ...result,
      data: result.data.items.reduce((agg, item) => {
        agg[item.countryCode.toLowerCase()] = {
          title: item.country,
          value: item.pageLoads
        };
        return agg;
      }, {})
    };
  });
}
