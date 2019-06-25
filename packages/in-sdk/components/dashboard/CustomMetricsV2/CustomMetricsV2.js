import React, { Fragment } from 'react';

import { timeByMillisTwoDecimalPlaces, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import withUrlState from 'in-hoc/withUrlState';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './CustomMetricsV2.mless';

const rateFormatter = d => withSiMultiplyPrefixThreeDecimalPlaces(d) + '/s';

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
              content="Pinned metrics are shown in a separate table above the custom metrics. Use this to do an ad-hoc comparison between multiple custom metrics. Additionally, you can send the link to colleagues and they will see the same set of pinned metrics."
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
        return row.metrics[row.tableMetric || 0].name;
      },
      getContent(value, row) {
        return row.metrics[row.tableMetric || 0].formatter(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default withUrlState({
  bind: [
    {
      path: '/dashboard',
      name: 'pinnedMetrics',
      initialState: [],
      serializer: buildJsonSerializer(),
      parser: buildJsonParser([])
    }
  ],
  resets: [
    {
      bind: [snapshotIdUrlParameter],
      reset: {
        pinnedMetrics: []
      }
    }
  ],
  reducerName: 'setPinnedMetrics',
  reducer: (_, pinnedMetrics) => ({ pinnedMetrics })
})(CustomMetricsV2);

function CustomMetricsV2(props) {
  const { titlePrefix, pinnedMetrics, postProcessRow, getRows = getDefaultRows } = props;

  const rows = getRows(props);

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
        <Table
          cardTitle={`${titlePrefix || ''} Pinned Metrics (${pinnedRows.length})`.trim()}
          withoutPadding
          cols={cols}
          rows={pinnedRows}
          getRowDetails={getDetails}
          maxItemsPerPage={20}
          initialSortColumn={2}
          showExpandAll
        />
      )}

      <Table
        cardTitle={`${titlePrefix || ''} Custom Metrics (${rows.length})`.trim()}
        withoutPadding
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
        maxItemsPerPage={20}
        initialSortColumn={2}
      />
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

function getDefaultRows({
  snapshot,
  timeConfig,
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
  metricIdExtractor = (key, value) => value,
  metricNameExtractor = (key, value) => value
}) {
  let rows = [];
  const snapshotId = snapshot.get('id');

  rows = rows.concat(
    snapshot
      .getIn(countersSnapshotLocation, emptyList)
      .map((value, key) => {
        return {
          key: `counter${metricIdExtractor(key, value)}`,
          name: metricNameExtractor(key, value),
          type: 'counter',
          snapshotId,
          timeConfig,
          color: '#00CC66',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${countersMetricPrefix}${metricIdExtractor(key, value)}`,
              label: 'Count',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces
            }
          ]
        };
      })
      .toArray()
  );

  rows = rows.concat(
    snapshot
      .getIn(gaugesSnapshotLocation, emptyList)
      .map((value, key) => {
        return {
          key: `gauge${metricIdExtractor(key, value)}`,
          name: metricNameExtractor(key, value),
          type: 'gauge',
          snapshotId,
          timeConfig,
          color: '#D90368',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${gaugesMetricPrefix}${metricIdExtractor(key, value)}`,
              label: 'Value',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces
            }
          ]
        };
      })
      .toArray()
  );

  rows = rows.concat(
    snapshot
      .getIn(histogramsSnapshotLocation, emptyList)
      .map((value, key) => {
        return {
          key: `histogram${metricIdExtractor(key, value)}`,
          name: metricNameExtractor(key, value),
          type: 'histogram',
          snapshotId,
          timeConfig,
          color: '#F1C40F',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${histogramsMetricPrefix}${metricIdExtractor(key, value)}.mean`,
              label: 'Mean',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces
            },
            {
              name: `${histogramsMetricPrefix}${metricIdExtractor(key, value)}.50th`,
              label: '50th',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces
            },
            {
              name: `${histogramsMetricPrefix}${metricIdExtractor(key, value)}.99th`,
              label: '99th',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces
            }
          ]
        };
      })
      .toArray()
  );

  rows = rows.concat(
    snapshot
      .getIn(metersSnapshotLocation, emptyList)
      .map((value, key) => {
        return {
          key: `meter${metricIdExtractor(key, value)}`,
          name: metricNameExtractor(key, value),
          type: 'meter',
          snapshotId,
          timeConfig,
          color: '#2274A5',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `${metersMetricPrefix}${metricIdExtractor(key, value)}`,
              label: 'Rate',
              formatter: rateFormatter
            }
          ]
        };
      })
      .toArray()
  );

  rows = rows.concat(
    snapshot
      .getIn(timersSnapshotLocation, emptyList)
      .map((value, key) => {
        return {
          key: `timer${metricIdExtractor(key, value)}`,
          name: metricNameExtractor(key, value),
          type: 'timer',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          tableMetric: 1,
          metrics: [
            {
              name: `${timersMetricPrefix}${metricIdExtractor(key, value)}.rate`,
              label: 'Rate',
              formatter: rateFormatter
            },
            {
              name: `${timersMetricPrefix}${metricIdExtractor(key, value)}.mean`,
              label: 'Mean',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${timersMetricPrefix}${metricIdExtractor(key, value)}.50th`,
              label: '50th',
              formatter: timeByMillisTwoDecimalPlaces
            },
            {
              name: `${timersMetricPrefix}${metricIdExtractor(key, value)}.99th`,
              label: '99th',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
      .toArray()
  );

  return rows;
}
