/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import GeoHeatMapPresenter from 'in-components/GeoHeatMap/GeoHeatMapPresenter';
import { pendingResult, finishedProgress } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';

export default {
  component: GeoHeatMapPresenter
};

export function Loading() {
  return <GeoHeatMapPresenter valueFormatter={number.compact} mapCode="world" height={300} result={pendingResult} />;
}

export function NoData() {
  return (
    <GeoHeatMapPresenter
      valueFormatter={number.compact}
      mapCode="world"
      height={300}
      result={{
        data: null,
        time: 1542112104261,
        errors: [
          {
            message: 'Unexpected server error',
            code: 'SERVER'
          }
        ],
        progress: finishedProgress
      }}
    />
  );
}

export function EmptyData() {
  return (
    <GeoHeatMapPresenter
      valueFormatter={number.compact}
      mapCode="world"
      height={300}
      result={{
        data: {
          items: [],
          page: 1,
          pageSize: 200,
          totalHits: 0
        },
        time: 1542112104261,
        errors: [],
        progress: finishedProgress
      }}
    />
  );
}

export function Default() {
  return (
    <GeoHeatMapPresenter
      valueFormatter={number.compact}
      mapCode="world"
      onHomeClick={action('onHomeClick')}
      onAreaClick={action('onAreaClick')}
      height={300}
      result={{
        data: {
          ca: {
            title: 'Canada',
            value: 311
          },
          cn: {
            title: 'China',
            value: 800
          },
          eg: {
            title: 'Egypt',
            value: 342
          },
          fr: {
            title: 'France',
            value: 240
          },
          jp: {
            title: 'Japan',
            value: 200
          },
          ru: {
            title: 'Russia',
            value: 100
          },
          gb: {
            title: 'United Kingdom',
            value: 320
          },
          us: {
            title: 'United States',
            value: 180
          }
        },
        time: 1542112104261,
        errors: [],
        progress: finishedProgress
      }}
    />
  );
}
