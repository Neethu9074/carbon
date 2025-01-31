/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import getMobileAppCountryBreakdown from 'in-mobile-apps/subscriptions/getMobileAppCountryBreakdown';
import getMobileAppSubdivisions from 'in-mobile-apps/subscriptions/getMobileAppSubdivisions';
import GeoHeatMap from 'in-components/GeoHeatMap/GeoHeatMap';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const valueFormatter = v => t('in-mobile-apps:dashboard.numSessionStarts', { num: number.compact(v) });

export default function MobileAppGeoHeatMap({ height, tagFilters, timeConfig, canDrillDown, controlWrapperClassName }) {
  return (
    <GeoHeatMap
      canDrillDown={canDrillDown}
      getData={countryCode => getData({ countryCode, tagFilters, timeConfig })}
      height={height}
      valueFormatter={valueFormatter}
      notDefinedValue={valueFormatter(0)}
      label={t('in-mobile-apps:dashboard.numSessionStarts')}
      controlWrapperClassName={controlWrapperClassName}
    />
  );
}

function getData({ countryCode, tagFilters, timeConfig }) {
  tagFilters = tagFilters.concat({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'sessionStart'
  });

  if (countryCode) {
    return getMobileAppSubdivisions({
      timeConfig,
      tagFilters: tagFilters.concat({
        name: 'mobileBeacon.geo.countryCode',
        operator: 'EQUALS',
        stringValue: countryCode.toUpperCase()
      }),
      pagination: {
        page: 1,
        pageSize: 200
      },
      order: {
        by: 'sessions',
        direction: 'DESC'
      },
      metrics: {
        sessions: {
          metric: 'sessions',
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
            value: get(item, ['metrics', 'sessions', 0, 1])
          };
          return agg;
        }, {})
      };
    });
  }

  return getMobileAppCountryBreakdown({
    timeConfig,
    tagFilters,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'sessions',
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
          value: item.sessions
        };
        return agg;
      }, {})
    };
  });
}
