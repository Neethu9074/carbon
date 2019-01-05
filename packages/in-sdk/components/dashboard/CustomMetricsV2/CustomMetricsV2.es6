import React, { Fragment } from 'react';

import { withSiPrefixThreeDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import Chart from 'in-components/Chart';

import locals from './CustomMetricsV2.mless';

const rateFormatter = d => withSiPrefixThreeDecimalPlaces(d) + ' / sec';
const serializer = buildJsonSerializer();
const deserializer = buildJsonParser([]);

const cols = [
  {
    title: '',
    type: 'custom',
    width: 30,
    cellStyle: {
      textAlign: 'center'
    },
    disableSorting: true,
    typeArgs: {
      get(row) {
        const index = row.pinnedMetrics.indexOf(row.key);
        const isPinned = index !== -1;
        return {
          value: isPinned ? 0 : 1,
          content: (
            <Tooltip
              align="topMiddle"
              content="Pinned metrics are shown in a separate table above the custom metris. Use this to do an ad-hoc comparison between multiple custom metrics. Additionally, you can send the link to colleagues and they will see the same set of pinned metrics."
            >
              <SvgIcon
                type={isPinned ? 'pinned' : 'unpin'}
                className={isPinned ? locals.pinned : locals.unpinned}
                width={8}
                onClick={() => {
                  if (isPinned) {
                    row.setPinnedMetrics(row.pinnedMetrics.filter(v => v !== row.key));
                  } else {
                    row.setPinnedMetrics(row.pinnedMetrics.concat(row.key));
                  }
                }}
              />
            </Tooltip>
          )
        };
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    width: 90,
    typeArgs: {
      getValue(row) {
        return row.type;
      },
      getContent(type, row) {
        return (
          <Pill kind="light" color={row.color} lightenOpacity={0.1} className={locals.pill}>
            {type}
          </Pill>
        );
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Value',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metrics[0].name;
      },
      getContent(value, row) {
        return row.metrics[0].formatter(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default withUrlDependingState({
  getPathSegment: () => '/dashboard',
  getMatrixPrefix: () => 'dashboardExtension.',
  boundKeys: ['pinnedMetrics'],
  getInitialState: () => ({ pinnedMetrics: [] }),
  getParsedUrlValues: values => ({ pinnedMetrics: deserializer(values.pinnedMetrics) }),
  getSerializedUrlValues: values => ({ pinnedMetrics: serializer(values.pinnedMetrics) }),
  reducerName: 'setPinnedMetrics',
  reducer: (_, pinnedMetrics) => ({ pinnedMetrics }),
  replaceHistory: true
})(CustomMetricsV2);

function CustomMetricsV2({
  snapshot,
  timeConfig,
  titlePrefix,
  setPinnedMetrics,
  pinnedMetrics,
  countersSnapshotLocation = ['data', 'metrics.counters'],
  countersMetricPrefix = 'metrics.counters.',
  gaugesSnapshotLocation = ['data', 'metrics.gauges'],
  gaugesMetricPrefix = 'metrics.gauges.',
  histogramsSnapshotLocation = ['data', 'metrics.histograms'],
  histogramsMetricPrefix = 'metrics.histograms.',
  metersSnapshotLocation = ['data', 'metrics.meters'],
  metersMetricPrefix = 'metrics.meters.',
  timersSnapshotLocation = ['data', 'metrics.timers'],
  timersMetricPrefix = 'metrics.timers.',
  postProcessRow
}) {
  const snapshotId = snapshot.get('id');

  let rows = [];

  rows = rows.concat(
    snapshot
      .getIn(countersSnapshotLocation, emptyList)
      .toArray()
      .map(name => {
        return {
          key: `counter${name}`,
          name,
          type: 'counter',
          snapshotId,
          timeConfig,
          color: '#00CC66',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${countersMetricPrefix}${name}`,
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(gaugesSnapshotLocation, emptyList)
      .toArray()
      .map(name => {
        return {
          key: `gauge${name}`,
          name,
          type: 'gauge',
          snapshotId,
          timeConfig,
          color: '#D90368',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${gaugesMetricPrefix}${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(histogramsSnapshotLocation, emptyList)
      .toArray()
      .map(name => {
        return {
          key: `histogram${name}`,
          name,
          type: 'histogram',
          snapshotId,
          timeConfig,
          color: '#F1C40F',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${histogramsMetricPrefix}${name}.mean`,
              label: 'Mean',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${histogramsMetricPrefix}${name}.50th`,
              label: '50th',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${histogramsMetricPrefix}${name}.99th`,
              label: '99th',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(metersSnapshotLocation, emptyList)
      .toArray()
      .map(name => {
        return {
          key: `meter${name}`,
          name,
          type: 'meter',
          snapshotId,
          timeConfig,
          color: '#2274A5',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${metersMetricPrefix}${name}`,
              label: 'Rate',
              formatter: rateFormatter
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(timersSnapshotLocation, emptyList)
      .toArray()
      .map(name => {
        return {
          key: `timer${name}`,
          name,
          type: 'timer',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${timersMetricPrefix}${name}.rate`,
              label: 'Rate',
              formatter: rateFormatter
            },
            {
              name: `${timersMetricPrefix}${name}.mean`,
              label: 'Mean',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${timersMetricPrefix}${name}.50th`,
              label: '50th',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${timersMetricPrefix}${name}.99th`,
              label: '99th',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
  );

  if (postProcessRow) {
    rows.forEach(postProcessRow);
  }

  if (rows.length === 0) {
    return null;
  }

  const pinnedRows = rows.filter(r => pinnedMetrics.indexOf(r.key) !== -1);

  return (
    <Fragment>
      {pinnedRows.length > 0 && (
        <DashboardSection title={`${titlePrefix || ''} Pinned Metrics (${pinnedRows.length})`.trim()}>
          <Table cols={cols} rows={pinnedRows} getRowDetails={getDetails} maxItemsPerPage={100} initialSortColumn={2} />
        </DashboardSection>
      )}

      <DashboardSection title={`${titlePrefix || ''} Custom Metrics (${rows.length})`.trim()}>
        <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={100} initialSortColumn={2} />
      </DashboardSection>
    </Fragment>
  );
}

function getDetails(row) {
  const y1Formatter = row.metrics[0].formatter;
  const y1DataSeries = row.metrics.filter(m => m.formatter === y1Formatter);
  const y2DataSeries = row.metrics.filter(m => m.formatter !== y1Formatter);

  const y1 = {
    formatter: y1DataSeries[0].formatter,
    metrics: y1DataSeries.map(m => m.name),
    labels: y1DataSeries.map(m => m.label),
    type: 'line'
  };

  let y2 = undefined;
  if (y2DataSeries.length > 0) {
    y2 = {
      formatter: y2DataSeries[0].formatter,
      metrics: y2DataSeries.map(m => m.name),
      labels: y2DataSeries.map(m => m.label),
      type: 'line'
    };
  }

  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      margins={{
        left: 90,
        right: 90
      }}
      y1={y1}
      y2={y2}
    />
  );
}
