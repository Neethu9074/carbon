import React from 'react';

import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import Metric from 'in-views/cockpit/components/Metric';
import MetricValue from 'in-components/MetricValue';
import { getPlural } from 'in-sdk/pluginName';

const sortedShortPluginIds = Object.keys(plugins)
  .map(key => plugins[key])
  .sort((a, b) => compareIgnoreCase(getPlural(a), getPlural(b)));

export default function PluginUsage({ pluginIdFilter }) {
  const pluginIds = sortedShortPluginIds.filter(pluginIdFilter);

  return (
    <div>
      {pluginIds.map(pluginId =>
        <Metric label={getPlural(pluginId)} key={pluginId} pluginId={pluginId}>
          <MetricValue
            snapshotId={ID_OF_PROCESSING_STATISTICS}
            metric={`plugin.${pluginId}`}
            formatter={zeroDecimalPlaces}
          />
        </Metric>
      )}
    </div>
  );
}
