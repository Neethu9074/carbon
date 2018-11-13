import { storiesOf } from '@storybook/react';
import React from 'react';

import { amCharts, worldLowMap, loadMapAsynchronously } from 'in-new-components/AmMap/libraryWrapper';
import AmMap from 'in-new-components/AmMap/ReactWrapper';
import Root from '../_helpers/Root';

storiesOf('Components/AmMapContainer', module).add('world map with drill down', () => <WorldMapWithDrillDown />);

function WorldMapWithDrillDown() {
  return (
    <Root>
      <AmMap onDidMount={onDidMount} />
    </Root>
  );
}

function onDidMount({containerElement}) {
  containerElement.style.width = '100%';
  containerElement.style.height = '300px';
  const worldDataProvider = {
    map: 'worldLow',
    areas: worldLowMap.svg.g.path.map(p => ({
      id: p.id,
      value: Math.random() * 500
    }))
  };

  const map = amCharts.makeChart(containerElement, {
    type: 'map',
    theme: 'light',
    projection: 'winkel3',
    colorSteps: 10,
    dataProvider: worldDataProvider,
    mouseWheelZoomEnabled: true,
    hideCredits: true,

    areasSettings: {
      autoZoom: true,
      rollOverOutlineColor: '#9a7bca',
      selectedColor: '#9a7bca',
      color: '#a791b4',
      rollOverColor: '#9a7bca'
    },

    valueLegend: {
      right: 10,
      minValue: '0 calls',
      maxValue: '32,123 calls'
    },

    listeners: [
      {
        event: 'homeButtonClicked',
        method: handleGoHome
      },
      {
        event: 'clickMapObject',
        method: handleMapObjectClick
      }
    ]
  });

  function handleGoHome() {
    map.dataProvider = worldDataProvider;
    map.setProjection('winkel3');
    map.validateNow();
  }

  function handleMapObjectClick(event) {
    if (event.mapObject.id === 'US') {
      goToMap('usa2Low');
    } else if (event.mapObject.id === 'DE') {
      goToMap('germanyLow');
    } else if (event.mapObject.id === 'RU') {
      goToMap('russiaLow');
    }
  }

  function goToMap(name) {
    loadMapAsynchronously(name, {minimumSuccessDelay: 1000})
      .then(mapData => {
        map.dataProvider = {
          map: name,
          areas: mapData.svg.g.path.map(p => ({
            id: p.id,
            title: p.title,
            value: Math.random() * 500,
            balloonText: `${p.title}: 42 calls`
          }))
        };
        map.validateData();
        map.setProjection('mercator');
        map.validateNow();
      });
  }

}
