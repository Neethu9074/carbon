/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { amCharts, worldLowMap, centerAlignedLocationPointer } from 'in-new-components/AmMap/libraryWrapper';
import AmMap from 'in-new-components/AmMap/ReactWrapper';

import locals from './Map.mless';

export default function Map({ beacon }) {
  return (
    <AmMap
      key={`${beacon.latitude}:${beacon.longitude}`}
      onDidMount={args => onDidMount(args, beacon)}
      height={200}
      className={locals.map}
    />
  );
}

function onDidMount({ containerElement }, beacon) {
  const worldDataProvider = {
    map: 'worldLow',
    areas: worldLowMap.svg.g.path.map(p => ({
      id: p.id
    })),
    images: [
      {
        theme: 'light',
        svgPath: centerAlignedLocationPointer,
        scale: 0.15,
        color: '#031F29',
        longitude: beacon.longitude,
        latitude: beacon.latitude
      }
    ]
  };

  return amCharts.makeChart(containerElement, {
    type: 'map',
    theme: 'light',
    projection: 'winkel3',
    colorSteps: 10,
    dataProvider: worldDataProvider,
    mouseWheelZoomEnabled: true,
    hideCredits: true,
    areasSettings: {
      color: '#39BF7C',
      rollOverColor: '#58aee4'
    },
    zoomControl: {
      zoomControlEnabled: false,
      homeButtonEnabled: false
    }
  });
}
