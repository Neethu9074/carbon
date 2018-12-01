import { compose } from 'recompose';
import React from 'react';

import { amCharts, loadMap, getMapName } from 'in-new-components/AmMap/libraryWrapper';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { generateStableHash } from 'in-services/util/id';
import AmMap from 'in-new-components/AmMap/ReactWrapper';
import connect from 'in-hoc/connectTo';

// result must eventually resolve with data in the form of:
// {
//   code: {
//     title,
//     value
//   }
// }

export default compose(
  connect(({ mapCode }) => ({
    map: loadMap(mapCode)
  }))
)(GeoHeatMapPresenter);

function GeoHeatMapPresenter({
  onHomeClick,
  onAreaClick,
  result,
  valueFormatter,
  mapCode,
  map,
  height,
  projection = 'winkel3'
}) {
  if (!result || result.progress.loading || !map) {
    return <InfiniteCircle height={height} />;
  } else if (result.errors.length > 0) {
    return <NoDataAvailable height={height} />;
  }

  return (
    <AmMap
      // AmMap maps cannot be properly updated. Instead, we need to completely throw them away on prop changes.
      key={mapCode + generateStableHash(result.data) + projection}
      onDidMount={args =>
        onDidMount({ ...args, onHomeClick, onAreaClick, valueFormatter, projection, mapCode, map, data: result.data })
      }
      height={`${height}px`}
    />
  );
}

function onDidMount({
  containerElement,
  valueFormatter,
  mapCode,
  map: mapDefinition,
  data,
  projection,
  onHomeClick,
  onAreaClick
}) {
  const worldDataProvider = {
    map: getMapName(mapCode),
    areas: mapDefinition.svg.g.path.map(p => {
      const areaData = data[p.id.toLowerCase()];
      const value = areaData ? areaData.value : undefined;
      let balloonText = areaData ? areaData.title : p.title;
      if (value == null) {
        balloonText += ': 0';
      } else {
        balloonText += `: ${valueFormatter(value)}`;
      }
      return {
        id: p.id,
        value,
        balloonText,
        color: value == null || value === 0 ? '#ddd' : undefined
      };
    })
  };

  let min = null;
  let max = null;
  Object.keys(data).forEach(code => {
    const { value } = data[code];

    if (min == null) {
      min = value;
    } else {
      min = Math.min(min, value);
    }

    if (max == null) {
      max = value;
    } else {
      max = Math.max(max, value);
    }
  });

  const lightColor = '#ffcc00';
  const darkColor = min != null ? '#990000' : lightColor;

  const listeners = [];
  if (onHomeClick) {
    listeners.push({
      event: 'homeButtonClicked',
      method: () => onHomeClick()
    });
  }
  if (onAreaClick) {
    listeners.push({
      event: 'clickMapObject',
      method: e => {
        if (e.mapObject.id) {
          onAreaClick(e.mapObject.id);
        }
      }
    });
  }

  const map = amCharts.makeChart(
    containerElement,
    {
      type: 'map',
      theme: 'none',
      projection,
      colorSteps: 10,
      dataProvider: worldDataProvider,
      mouseWheelZoomEnabled: true,
      hideCredits: true,
      listeners,

      areasSettings: {
        autoZoom: true,
        rollOverOutlineColor: '#00B3B3',
        rollOverColor: '#DFE4E8',

        selectedColor: darkColor,
        color: lightColor,
        colorSolid: darkColor
      },

      valueLegend:
        min !== max
          ? {
              right: 10,
              minValue: valueFormatter(min),
              maxValue: valueFormatter(max)
            }
          : undefined
    },
    0
  );

  return map;
}
