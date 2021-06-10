/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';

import { timeByMillisTwoDecimalPlaces, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import withUrlState from 'in-hoc/withUrlState';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

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
            <Tooltip align="topMiddle" content={t('in-sdk:dashboard.customMetricsV2.customMetricsContent')}>
              <SvgIcon
                type={isPinned ? 'lib_fancy_checkbox_checked' : 'lib_fancy_checkbox_unchecked'}
                className={isPinned ? locals.pinned : locals.unpinned}
                size="xxs"
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
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleType'),
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
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleValue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).name;
      },
      getContent(value, row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).formatter(value);
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
          cardTitle={t('in-sdk:dashboard.customMetricsV2.customMetricsTitlePinned', {
            pinnedPrefix: titlePrefix,
            pinnedLength: pinnedRows.length
          }).trim()}
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
        cardTitle={t('in-sdk:dashboard.customMetricsV2.customMetricsTitleCustom', {
          customPrefix: titlePrefix,
          customLength: rows.length
        }).trim()}
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

export function getDefaultRows({
  snapshot,
  timeConfig,
  setPinnedMetrics,
  pinnedMetrics,
  noExpandSubMetrics = false,
  specs = DEFAULT_SPECS
}) {
  const snapshotId = snapshot.get('id');
  const expandSubMetrics = !noExpandSubMetrics;

  const metrics = getMetricIds(snapshot, expandSubMetrics, specs).reduce((acc, id) => {
    const metric = expandMetric(id, expandSubMetrics, specs);
    if (!metric) {
      return acc;
    }
    const { i, key, name, type, color, tableMetric, label, formatter } = metric;
    acc[key] = acc[key] || {
      key,
      name,
      type,
      color,
      tableMetric,
      snapshotId,
      timeConfig,
      setPinnedMetrics,
      pinnedMetrics,
      metrics: []
    };
    acc[key].metrics.push({
      name: id,
      label,
      formatter,
      i
    });
    acc[key].metrics.sort((l, r) => l.i - r.i);
    return acc;
  }, {});

  return Object.values(metrics);
}

function getMetricIds(snapshot, expandSubMetrics, specs) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds) {
    return metricIds;
  }

  return specs.flatMap(({ prefix, path, metrics }) =>
    snapshot
      .getIn(path, emptyList)
      .flatMap(metric => metrics.map(metrics => prefix + metric + (metrics.suffix || '')))
      .toJS()
  );
}

function expandMetric(id, expandSubMetrics, specs) {
  const spec = specs.find(spec => id.startsWith(spec.prefix));
  if (!spec) return null;

  const metric = spec.metrics
    .map((metric, i) => ({ ...metric, i }))
    .find(metric => !metric.suffix || id.endsWith(metric.suffix));
  if (!metric) return null;

  const suffixLength = metric.suffix?.length ?? 0;
  const key = id.slice(0, id.length - suffixLength);
  const name = id.slice(spec.prefix.length, id.length - suffixLength);
  const { type, color, tableMetric } = spec;

  return {
    key,
    name,
    type,
    color,
    tableMetric,
    ...metric
  };
}

export const AVAILABLE_SPECS = {
  COUNTER: {
    prefix: 'metrics.counters.',
    path: ['data', 'metrics.counters'],
    type: 'counter',
    color: '#00CC66',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableCount'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  GAUGE: {
    prefix: 'metrics.gauges.',
    path: ['data', 'metrics.gauges'],
    type: 'gauge',
    color: '#D90368',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  HISTOGRAM: {
    prefix: 'metrics.histograms.',
    path: ['data', 'metrics.histograms'],
    type: 'histogram',
    color: '#F1C40F',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  EXPANDED_HISTOGRAM: {
    prefix: 'metrics.histograms.',
    path: ['data', 'metrics.histograms'],
    type: 'histogram',
    color: '#F1C40F',
    metrics: [
      {
        suffix: '.mean',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableMean'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      },
      {
        suffix: '.50th',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableP50'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      },
      {
        suffix: '.99th',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableP99'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  METER: {
    prefix: 'metrics.meters.',
    path: ['data', 'metrics.meters'],
    type: 'meter',
    color: '#2274A5',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableRate'),
        formatter: rateFormatter
      }
    ]
  },
  TIMER: {
    prefix: 'metrics.timers.',
    path: ['data', 'metrics.timers'],
    type: 'timer',
    color: '#F75C03',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  EXPANDED_TIMER: {
    prefix: 'metrics.timers.',
    path: ['data', 'metrics.timers'],
    type: 'timer',
    color: '#F75C03',
    tableMetric: 1,
    metrics: [
      {
        suffix: '.rate',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableRate'),
        formatter: rateFormatter
      },
      {
        suffix: '.mean',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableMean'),
        formatter: timeByMillisTwoDecimalPlaces
      },
      {
        suffix: '.50th',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableP50'),
        formatter: timeByMillisTwoDecimalPlaces
      },
      {
        suffix: '.99th',
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableP99'),
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  SUMMARY: {
    prefix: 'metrics.summaries.',
    path: ['data', 'metrics.summaries'],
    type: 'summary',
    color: '#f75c03',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  }
};

export const DEFAULT_SPECS = [
  AVAILABLE_SPECS.COUNTER,
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.EXPANDED_HISTOGRAM,
  AVAILABLE_SPECS.METER,
  AVAILABLE_SPECS.EXPANDED_TIMER,
  AVAILABLE_SPECS.SUMMARY
];
