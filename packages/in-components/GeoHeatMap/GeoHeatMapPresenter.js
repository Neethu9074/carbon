/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useCallback } from 'react';

import { IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { amCharts, canDrillDownToMap, getMapName, loadMap } from 'in-components/AmMap/libraryWrapper';
import { GeoHeatMapTableViewModal } from 'in-components/GeoHeatMap/GeoHeatMapTableViewModal';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { lightGreenToDarkGreenHex } from 'in-themes/heatMapColors';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ButtonGroup from 'in-components/MapControls/ButtonGroup';
import HeatMapLegend from 'in-components/HeatMapLegend';
import AmMap from 'in-components/AmMap/ReactWrapper';
import { t } from 'in-i18n';

import locals from './GeoHeatMapPresenter.mless';

// result of the getData property must eventually resolve with data in the form of:
// {
//   code: {
//     title,
//     value
//   }
// }

export default function GeoHeatMapPresenter(props) {
  const { height, getData, canDrillDown } = props;
  const [mapCode, setMapCode] = useState('world');

  const result = useObservable(
    ([mapCode]) =>
      getData(mapCode === 'world' ? undefined : mapCode)
        // For some unknown reason AmMap really hates synchronous data retrieval.
        // When not executing nextFrame(), then the following breaks the heat map:
        //
        // 1. Click on USA (states should be colored)
        // 2. Click on the home button
        // 3. Click on USA (no state is colored)
        .nextFrame(),
    [mapCode]
  );

  const map = useObservable(([mapCode]) => loadMap(mapCode), [mapCode]);

  if (!result || result?.progress?.loading || !map || !result.data) {
    return <LoadingIndicator text={t('in-components:geoHeatMap.loadingIndicatorLoadingData')} height={height} />;
  } else if (result.errors.length > 0) {
    return <NoDataAvailable height={height} />;
  }

  const onHomeClick = () => setMapCode('world');
  const onAreaClick = newMapCode => {
    if (mapCode !== 'world' || !canDrillDown) return;
    if (canDrillDownToMap(newMapCode)) {
      // let the Map finish zooming in on a country before switching data
      setTimeout(() => setMapCode(newMapCode), 1000);
    }
  };

  return (
    <Content
      // AmMap maps cannot be properly updated. Instead, we need to completely throw them away on prop changes.
      // The pure HOC will make sure that this doesn't happen exceedingly often.
      map={map}
      key={Math.random()}
      setMapCode={setMapCode}
      mapCode={mapCode}
      result={result}
      onHomeClick={onHomeClick}
      onAreaClick={onAreaClick}
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
  notDefinedValue,
  controlWrapperClassName,
  label
}) {
  const { pathname } = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [mapControls, setMapControls] = useState(null);
  const modalLaunchButtonRef = useRef(null);

  const projection = mapCode === 'world' ? 'winkel3' : 'mercator';
  const isItGeographyTab = pathname === '/websiteMonitoring/website/geography';
  const iconButtonSize = isItGeographyTab ? 'normal' : 'compact';

  const handleZoomIn = () => {
    if (mapControls?.onZoomIn) {
      mapControls.onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapControls?.onZoomOut) {
      mapControls.onZoomOut();
    }
  };

  const handleHome = () => {
    if (mapControls?.onHome) {
      mapControls.onHome();
    }
  };

  // By default, the Carbon modal is supposed to have a launcherButtonRef prop that would handle
  // the focus after closing automatically. However, it does not work properly in React 17
  // when fowarding the ref. It introduces a race condition in their code and the result is that the button
  // has the focus on initial render and not on modal close only. The workaround is quite simple and is
  // to handle focus manually, which is what we are doing below. At the same time, the launcherButtonRef prop works fine
  // in React 18, so we can change the approach from manual focus to using a dedicated prop when we upgrade to React 18.
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    modalLaunchButtonRef?.current.focus();
  }, []);

  return (
    <>
      <GeoHeatMapTableViewModal modalOpen={modalOpen} rawData={result.data} onRequestClose={handleModalClose} />

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

            setMapControls({
              onZoomIn: creationResult.onZoomIn,
              onZoomOut: creationResult.onZoomOut,
              onHome: creationResult.onHome
            });

            return creationResult.map;
          }}
          height={`${height}px`}
        />

        <Legend data={result.data} valueFormatter={valueFormatter} label={label} />

        <div className={controlWrapperClassName}>
          <ButtonGroup vertical className={locals.zoom}>
            <IconButton
              align="left"
              type="lib_table_of_contents"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.openTable')}
              onClick={() => setModalOpen(prevState => !prevState)}
              isWrapperedByTooltip
              ref={modalLaunchButtonRef}
              defaultOpen={false}
              size={iconButtonSize}
            />
            <IconButton
              align="left"
              type="lib_actions_zoom_in"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.tooltipZoomIn')}
              onClick={handleZoomIn}
              isWrapperedByTooltip
              size={iconButtonSize}
            />
            <IconButton
              align="left"
              type="lib_actions_zoom_out"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.tooltipZoomOut')}
              onClick={handleZoomOut}
              isWrapperedByTooltip
              size={iconButtonSize}
            />
            <IconButton
              align="left"
              type="lib_home"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.tooltipResetView')}
              onClick={handleHome}
              isWrapperedByTooltip
              size={iconButtonSize}
            />
          </ButtonGroup>
        </div>
      </div>
    </>
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

function Legend({ data, label }) {
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
      valueFrom={min}
      valueTo={max}
      label={label}
      colorFrom={lightGreenToDarkGreenHex[0]}
      colorTo={lightGreenToDarkGreenHex[1]}
    />
  );
}
