/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, withPropsOnChange } from 'recompose';

import GeoHeatMapPresenter from 'in-components/GeoHeatMap/GeoHeatMapPresenter';
import { canDrillDownToMap } from 'in-components/AmMap/libraryWrapper';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('mapCode', 'setMapCode', 'world'),
  connect(({ mapCode, getData }) => ({
    result: getData(mapCode === 'world' ? undefined : mapCode)
      // For some unknown reason AmMap really hates synchronous data retrieval.
      // When not executing nextFrame(), then the following breaks the heat map:
      //
      // 1. Click on USA (states should be colored)
      // 2. Click on the home button
      // 3. Click on USA (no state is colored)
      .nextFrame()
  })),
  withPropsOnChange(['canDrillDown', 'mapCode', 'setMapCode'], ({ canDrillDown, mapCode, setMapCode }) => ({
    onHomeClick: mapCode === 'world' ? undefined : () => setMapCode('world'),
    onAreaClick:
      mapCode === 'world' && canDrillDown
        ? newMapCode => {
            if (canDrillDownToMap(newMapCode)) {
              // let the Map finish zooming in on a country before switching data
              setTimeout(() => setMapCode(newMapCode), 1000);
            }
          }
        : undefined,
    projection: mapCode === 'world' ? 'winkel3' : 'mercator'
  }))
)(GeoHeatMapPresenter);
