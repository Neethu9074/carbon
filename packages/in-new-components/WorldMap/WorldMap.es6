import React from 'react';

import { amCharts, worldLowMap, loadMapAsynchronously, setDataProvider } from 'in-new-components/AmMap/libraryWrapper';
import getElementDimensions from 'in-hoc/getElementDimensions';
import AmMap from 'in-new-components/AmMap/ReactWrapper';

import locals from './WorldMap.mless';

export default getElementDimensions(
  class WorldMap extends React.Component {
    static displayName = 'WorldMap';

    onDidMount = ({ containerElement }) => {
      const canDrillDown = !!this.props.canDrillDown;

      const worldDataProvider = {
        map: 'worldLow',
        areas: worldLowMap.svg.g.path.map(p => ({
          id: p.id,
          value: Math.random() * 500
        }))
      };

      const listeners = [
        {
          event: 'homeButtonClicked',
          method: handleGoHome
        }
      ];
      if (canDrillDown) {
        listeners.push({
          event: 'clickMapObject',
          method: handleMapObjectClick
        });
      }

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

        listeners
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
    };

    componentWillUnmount() {}

    render() {
      return (
        <div className={locals.wrapper}>
          <AmMap onDidMount={this.onDidMount} height={this.props.height || this.props.customHeight} />
        </div>
      );
    }
  }
);
