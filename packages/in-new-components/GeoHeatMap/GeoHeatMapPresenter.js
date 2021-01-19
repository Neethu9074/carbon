/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, pure } from 'recompose';
import React from 'react';

import { amCharts, loadMap, getMapName } from 'in-new-components/AmMap/libraryWrapper';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { lightGreenToDarkGreenHex } from 'in-services/heatMapColors';
import ButtonGroup from 'in-new-components/MapControls/ButtonGroup';
import HeatMapLegend from 'in-new-components/HeatMapLegend';
import Button from 'in-new-components/MapControls/Button';
import AmMap from 'in-new-components/AmMap/ReactWrapper';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';

import locals from './GeoHeatMapPresenter.mless';

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
  })),
  pure
)(GeoHeatMapPresenter);

function GeoHeatMapPresenter(props) {
  const { result, map, height } = props;

  if (!result || result.progress.loading || !map) {
    return <LoadingIndicator text="Loading Data" height={height} />;
  } else if (result.errors.length > 0) {
    return <NoDataAvailable height={height} />;
  }

  return (
    <Content
      // AmMap maps cannot be properly updated. Instead, we need to completely throw them away on prop changes.
      // The pure HOC will make sure that this doesn't happen exceedingly often.
      key={Math.random()}
      {...props}
    />
  );
}

function Content({
  onHomeClick,
  onAreaClick,
  result,
  valueFormatter,
  mapCode,
  map,
  height,
  projection,
  notDefinedValue,
  controlWrapperClassName
}) {
  let onZoomIn;
  let onZoomOut;
  let onHome;

  return (
    <div className={locals.wrapper} style={{ height: `${height}px` }}>
      <AmMap
        onDidMount={args => {
          const creationResult = onDidMount({
            ...args,
            onHomeClick,
            onAreaClick,
            valueFormatter,
            notDefinedValue,
            projection,
            mapCode,
            map,
            data: result.data
          });

          onZoomIn = creationResult.onZoomIn;
          onZoomOut = creationResult.onZoomOut;
          onHome = creationResult.onHome;

          return creationResult.map;
        }}
        height={`${height}px`}
      />

      <Legend data={result.data} valueFormatter={valueFormatter} />

      <div className={controlWrapperClassName}>
        <Tooltip content="Reset view" align="leftMiddle">
          <Button icon="lib_home" className={locals.home} onClick={() => onHome()} />
        </Tooltip>

        <ButtonGroup vertical className={locals.zoom}>
          <Tooltip content="Zoom in" align="leftMiddle">
            <Button appendBottom icon="lib_actions_zoom_in" onClick={() => onZoomIn()} />
          </Tooltip>
          <Tooltip content="Zoom out" align="leftMiddle">
            <Button appendTop icon="lib_actions_zoom_out" onClick={() => onZoomOut()} />
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
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
  onAreaClick,
  notDefinedValue
}) {
  const dataProvider = {
    map: getMapName(mapCode),
    areas: mapDefinition.svg.g.path.map(p => {
      const areaData = data[p.id.toLowerCase()];
      const value = areaData ? areaData.value : undefined;
      let balloonText = areaData ? areaData.title : p.title;
      if (value == null) {
        balloonText += `: ${notDefinedValue}`;
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

  const lightColor = lightGreenToDarkGreenHex[0];
  const darkColor = Object.keys(data).length > 0 ? lightGreenToDarkGreenHex[1] : lightColor;
  const listeners = [
    {
      event: 'clickMapObject',
      method: e => {
        // disable the ugly selected color that cannot really be configured.
        map.returnInitialColor(map.selectedObject);
        if (onAreaClick && e.mapObject.id) {
          onAreaClick(e.mapObject.id);
        }
      }
    }
  ];

  const map = amCharts.makeChart(
    containerElement,
    {
      type: 'map',
      theme: 'none',
      projection,
      colorSteps: 10,
      dataProvider,
      hideCredits: true,
      listeners,

      mouseWheelZoomEnabled: true,
      zoomControl: {
        homeButtonEnabled: false,
        zoomControlEnabled: false
      },

      areasSettings: {
        autoZoom: true,
        rollOverOutlineColor: '#17A1E6',
        rollOverColor: '#74c7f1',

        color: lightColor,
        colorSolid: darkColor
      }
    },
    0
  );

  const onZoomIn = () => map.zoomIn();
  const onZoomOut = () => map.zoomOut();
  const onHome = () => {
    map.selectObject(dataProvider);
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return {
    map,
    onZoomIn,
    onZoomOut,
    onHome
  };
}

function Legend({ data, valueFormatter }) {
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

  if (min === max) {
    return null;
  }

  return (
    <HeatMapLegend
      className={locals.legend}
      valueFrom={valueFormatter(min)}
      valueTo={valueFormatter(max)}
      colorFrom={lightGreenToDarkGreenHex[0]}
      colorTo={lightGreenToDarkGreenHex[1]}
    />
  );
}
