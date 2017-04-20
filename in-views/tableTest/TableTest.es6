import React from 'react';

import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { number } from 'in-services/formatters/number';
import { getPlural } from 'in-sdk/pluginName';
import Table from 'in-components/Table';

const rows = Object.keys(plugins).map(key => {
  return {
    key: plugins[key],
    plugin: plugins[key]
  };
});

const cols = [
  {
    title: 'Plugin',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getPlural(row.plugin);
      },
      getContent(pluginLabel) {
        return pluginLabel;
      }
    }
  },
  {
    title: 'Instances',
    type: 'metric',
    typeArgs: {
      getSnapshotId() {
        return ID_OF_PROCESSING_STATISTICS;
      },
      getMetricName(row) {
        return `plugin.${row.plugin}`;
      },
      getContent: number.compact,
      timeWindowAggregation: 'mean'
    }
  }
];

function getRowDetails(rowConfig) {
  return <strong>{rowConfig.plugin}</strong>;
}

export default function TableTest() {
  return (
    <FullscreenOverlayView overlayTimeline>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </FullscreenOverlayView>
  );
}
