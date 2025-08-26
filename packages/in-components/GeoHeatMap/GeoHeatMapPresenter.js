/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';

import { IconButton, keyCodes } from '@instana/components';
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
  areControlsVertical = true,
  positionControlsAtTheTopOfTheCard = false,
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
  const tooltipAlignment = positionControlsAtTheTopOfTheCard ? 'bottom' : 'left';

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
          <ButtonGroup
            vertical={areControlsVertical}
            className={classNames({
              [locals.positionControlsAtTheTop]: positionControlsAtTheTopOfTheCard,
              [locals.zoom]: !positionControlsAtTheTopOfTheCard
            })}
          >
            <IconButton
              align={tooltipAlignment}
              type="lib_table_of_contents"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.openTable')}
              onClick={() => setModalOpen(prevState => !prevState)}
              isWrapperedByTooltip
              ref={modalLaunchButtonRef}
              defaultOpen={false}
              size={iconButtonSize}
              id="mapTableButton"
            />
            <IconButton
              align={tooltipAlignment}
              type="lib_actions_zoom_in"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.tooltipZoomIn')}
              onClick={handleZoomIn}
              isWrapperedByTooltip
              size={iconButtonSize}
            />
            <IconButton
              align={tooltipAlignment}
              type="lib_actions_zoom_out"
              kind="subtle"
              iconDescription={t('in-components:geoHeatMap.tooltipZoomOut')}
              onClick={handleZoomOut}
              isWrapperedByTooltip
              size={iconButtonSize}
            />
            <IconButton
              align={tooltipAlignment}
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

      if (value === null || value === undefined) {
        balloonText = `${balloonText}: ${notDefinedValue}`;
      } else {
        balloonText = `${balloonText}: ${valueFormatter(value)}`;
      }

      return {
        id: p.id,
        value,
        balloonText,
        color: value === null || value === undefined || value === 0 ? '#ddd' : undefined,
        tabIndex: areaData ? 0 : -1,
        accessible: !!areaData,
        accessibleLabel: balloonText
      };
    })
  };

  const lightColor = lightGreenToDarkGreenHex[0];
  const darkColor = Object.keys(data).length > 0 ? lightGreenToDarkGreenHex[1] : lightColor;

  // AmChart library ignores all the a11y params you set on the areas.
  // As a result, it renders role of menuitem everywhere.
  // We have to correct that manually after rendering the map
  const setAreaAccessibility = () => {
    const paths = containerElement.querySelectorAll('path[role="menuitem"]');
    paths.forEach(path => {
      const tabIndex = path.getAttribute('tabindex');

      if (tabIndex === '-1') {
        path.removeAttribute('role');
        return;
      }

      path.setAttribute('role', 'button');
    });
  };

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
    },
    {
      event: 'rendered',
      method: () => {
        setAreaAccessibility();
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

  const focusableAreas = map.dataProvider.areas.filter(area => area.tabIndex === 0);
  const lastFocusableArea = focusableAreas.at(-1);

  // This is necessary to make return key press trigger zooming into the area and
  // transitioning into detailed state view for countries like the US or Germany
  const handleKeyUp = e => {
    if (keyCodes.isReturn(e) && map.focusedItem && onAreaClick) {
      e.preventDefault();
      map.returnInitialColor(map.selectedObject);
      onAreaClick(map.focusedItem.id);
    }
  };

  // This is necessary to escape the trap focus the map weirdly implements
  const handleKeyDown = e => {
    if (keyCodes.isTab(e) && map.focusedItem?.id === lastFocusableArea?.id) {
      e.preventDefault();

      map.focusedItem = undefined;
      document.getElementById('mapTableButton')?.focus();
    }
  };

  // We attach event listeners to the whole document when the map is present,
  // because the map handles keyboard interaction in weird way.
  // Each time you focus on an area, the actual active element of the map is the body,
  // so attaching it to the actual map parent container will not do anything
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);

  // This gets called in in-components/AmMap/ReactWrapper during unmounting
  map.cleanup = () => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('keydown', handleKeyDown);
  };

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
