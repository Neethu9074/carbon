import { create, combineLatest } from 'reactive-observables';

import { amCharts, worldLowMap, loadMapAsynchronously, setDataProvider } from 'in-new-components/AmMap/libraryWrapper';

export default function createWorldMapController(containerElement, { getDataByCountry$, canDrillDown = false }) {
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
    dataProvider: {
      map: 'worldLow'
    },
    mouseWheelZoomEnabled: true,
    hideCredits: true,

    areasSettings: {
      autoZoom: true,
      rollOverOutlineColor: '#00B3B3',
      selectedColor: '#DFE4E8',
      color: '#a791b4',
      rollOverColor: '#DFE4E8'
    },

    valueLegend: {
      right: 10,
      minValue: '0 calls',
      maxValue: '32,123 calls'
    },

    listeners
  });

  function handleGoHome() {
    data$.emit({ name: 'worldLow', projection: 'winkel3', mapData: worldLowMap });
    selectedCountry$.emit(null);
  }

  function handleMapObjectClick(event) {
    if (event.mapObject.id === 'US') {
      goToMap('usa2Low');
    } else if (event.mapObject.id === 'DE') {
      goToMap('germanyLow');
    } else if (event.mapObject.id === 'RU') {
      goToMap('russiaLow');
    }

    function goToMap(name) {
      selectedCountry$.emit(name);
      loadMapAsynchronously(name, { minimumSuccessDelay: 1000 }).then(mapData =>
        data$.emit({ name, projection: 'mercator', mapData: mapData })
      );
    }
  }

  const data$ = create();

  const selectedCountry$ = create();
  selectedCountry$.emit(null);

  const properties$ = create();

  let dataSubscription;

  dataSubscription = combineLatest([
    data$,
    combineLatest([properties$, selectedCountry$]).flatMap(([properties, selectedCountry]) =>
      getDataByCountry$(properties, selectedCountry).map(mapCountryBreakdownResult)
    )
  ]).subscribe(([{ name, mapData, projection }, countryBreakdownData]) => {
    const dataProvider = {
      map: name,
      areas: getData(mapData, countryBreakdownData)
    };
    setDataProvider({
      map,
      dataProvider,
      projection
    });
  });

  function updateData(props) {
    properties$.emit(props);
  }

  function dispose() {
    if (dataSubscription) {
      dataSubscription.dispose();
    }
  }

  handleGoHome();

  return {
    updateData,
    dispose
  };
}

function getData(mapData, countryBreakdownData) {
  const countryDataMap = {};
  for (let i = 0; i < mapData.svg.g.path.length; i++) {
    const p = mapData.svg.g.path[i];
    countryDataMap[p.id] = p;
  }

  return (countryBreakdownData.items || [])
    .map(item => {
      const countryDefinition = countryDataMap[item.countryCode];
      if (!countryDefinition) {
        return null;
      }

      const value = item.pageLoads;
      return {
        id: countryDefinition.id,
        title: countryDefinition.title,
        value,
        balloonText: `${countryDefinition.title}: ${value} calls`
      };
    })
    .filter(Boolean);
}

function mapCountryBreakdownResult(countryBreakdownResult) {
  return countryBreakdownResult.data;
}
