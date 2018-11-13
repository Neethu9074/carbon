import { find, max, min } from 'lodash';
import React from 'react';

import { amCharts, worldLowMap, setDataProvider } from 'in-new-components/AmMap/libraryWrapper';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import AmMap from 'in-new-components/AmMap/ReactWrapper';
import { number } from 'in-services/formatters/number';
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

function Content({ countryBreakdown, height, result }) {
  return <AmMap onDidMount={args => onDidMount({ ...args, countryBreakdown, result })} height={`${height}px`} />;
}

function onDidMount({ containerElement, result }) {
  const worldDataProvider = {
    map: 'worldLow',
    areas: worldLowMap.svg.g.path.map(p => {
      const pageLoads = getCountryPageLoads(p.title, p.id);
      return {
        id: p.id,
        value: pageLoads,
        balloonText: `${p.title}: ${number.compact(pageLoads)} page loads`
      };
    })
  };

  const pageLoadCounts = result.data.items.map(i => i.pageLoads);
  const minPageLoads = min(pageLoadCounts) || 0;
  const maxPageLoads = max(pageLoadCounts) || 0;

  const lightColor = '#ffcc00';
  const darkColor = minPageLoads !== maxPageLoads ? '#990000' : lightColor;

  const map = amCharts.makeChart(
    containerElement,
    {
      type: 'map',
      theme: 'none',
      projection: 'winkel3',
      colorSteps: 10,
      dataProvider: worldDataProvider,
      mouseWheelZoomEnabled: true,
      hideCredits: true,

      areasSettings: {
        autoZoom: true,
        rollOverOutlineColor: '#990000',
        selectedColor: darkColor,
        color: lightColor,
        colorSolid: darkColor
      },

      valueLegend:
        minPageLoads !== maxPageLoads
          ? {
              right: 10,
              minValue: `0 page loads`,
              maxValue: `${number.compact(maxPageLoads)} page loads`
            }
          : undefined,

      listeners: [
        {
          event: 'homeButtonClicked',
          method: handleGoHome
        }
      ]
    },
    0
  );

  return map;

  function handleGoHome() {
    setDataProvider({
      map,
      dataProvider: worldDataProvider,
      projection: 'winkel3'
    });
  }

  function getCountryPageLoads(country, countryCode) {
    const foundItem = find(result.data.items, item => item.country === country || item.countryCode === countryCode);
    if (foundItem) {
      return foundItem.pageLoads;
    }
    return 0;
  }
}
