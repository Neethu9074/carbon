import React from 'react';

import { amCharts, worldLowMap, loadMapAsynchronously, setDataProvider } from 'in-new-components/AmMap/libraryWrapper';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import AmMap from 'in-new-components/AmMap/ReactWrapper';
import Card from 'in-new-components/Card';

export default function WorldMapCardPresenter({ title, countryBreakdownResult, height }) {
  let content;
  let withoutPadding = false;

  if (!countryBreakdownResult || countryBreakdownResult.progress.loading) {
    content = <InfiniteCircle height={height} />;
    withoutPadding = true;
  } else if (countryBreakdownResult.errors.length > 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else {
    content = <Content result={countryBreakdownResult} height={height} />;
    withoutPadding = true;
  }

  return (
    <Card title={title} withoutPadding={withoutPadding}>
      {content}
    </Card>
  );
}

function Content({ countryBreakdown, height }) {
  return <AmMap onDidMount={args => onDidMount({ ...args, countryBreakdown })} height={`${height}px`} />;
}

function onDidMount({ containerElement }) {
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
    setDataProvider({
      map,
      dataProvider: worldDataProvider,
      projection: 'winkel3'
    });
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
    loadMapAsynchronously(name, { minimumSuccessDelay: 1000 }).then(mapData => {
      const dataProvider = {
        map: name,
        areas: mapData.svg.g.path.map(p => ({
          id: p.id,
          title: p.title,
          value: Math.random() * 500,
          balloonText: `${p.title}: 42 calls`
        }))
      };
      setDataProvider({
        map,
        dataProvider,
        projection: 'mercator'
      });
    });
  }
}
