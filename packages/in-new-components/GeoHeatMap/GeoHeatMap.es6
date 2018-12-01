import { compose, withState, withProps } from 'recompose';

import GeoHeatMapPresenter from 'in-new-components/GeoHeatMap/GeoHeatMapPresenter';
import { isMapLoadable } from 'in-new-components/AmMap/libraryWrapper';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('mapCode', 'setMapCode', 'world'),
  connect(({ mapCode, getData }) => ({
    result: getData(mapCode === 'world' ? undefined : mapCode)
  })),
  withProps(({ canDrillDown, mapCode, setMapCode }) => ({
    onHomeClick: mapCode === 'world' ? undefined : () => setMapCode('world'),
    onAreaClick:
      mapCode === 'world' && canDrillDown
        ? newMapCode => {
            if (isMapLoadable(newMapCode)) {
              // let the Map finish zooming in on a country before switching data
              setTimeout(() => setMapCode(newMapCode), 1000);
            }
          }
        : undefined,
    projection: mapCode === 'world' ? 'winkel3' : 'mercator'
  }))
)(GeoHeatMapPresenter);
