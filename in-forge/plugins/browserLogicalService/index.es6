import { zeroDecimalPlacesPerSecond, msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import { addMapping } from 'in-sdk/kpi';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.browserLogicalService,
  iconSvgPath,
  tableDefinition,
  metricDefinitions,
  isNewDashboard: true,

  pluginName: {
    singular: 'Website',
    plural: 'Websites'
  },

  context: [
    {
      label: 'Websites',
      path: '/website'
    },
    {
      label: getLabel,
      path: '/website/dashboard'
    }
  ],

  chartWiggleRoom: 20000
});

addMapping(plugins.browserLogicalService, () => [
  {
    metric: 'count',
    label: 'calls/s',
    formatter: zeroDecimalPlaces,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: 'duration.mean',
    label: 'load time',
    formatter: msZeroDecimalPlaces,
    valueOnlyFormatter: msZeroDecimalPlaces
  }
]);
