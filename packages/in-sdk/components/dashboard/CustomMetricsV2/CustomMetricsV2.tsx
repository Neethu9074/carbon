/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment, useCallback } from 'react';
import { Map } from 'immutable';

import { Result, TimeConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { timeByMillisTwoDecimalPlaces, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { beeinstanaHistogramsEnabled } from 'in-services/featureFlags';
import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import { getInfraGranularity } from 'in-stores/metric/metric';
import Table from 'in-sdk/components/dashboard/Table';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './CustomMetricsV2.mless';

const rateFormatter = (d: number) => withSiMultiplyPrefixThreeDecimalPlaces(d) + '/s';
const beeInstanaMinimumRollupMillis = 10000;

interface CustomMetricProps {
  specs: MetricsSpec[];
  timeConfig: TimeConfig;
  snapshot: Map<string, any>;
  titlePrefix?: string;
  postProcessRow?: () => void;
  getRows?: (p: GetRowsProps) => Row[];
  customColumns?: any;
}

interface GetRowsProps extends CustomMetricProps {
  metricIdsResult: Result<string[]>;
  pinnedMetrics: string[];
  setPinnedMetrics: (pinnedMetrics: string[]) => void;
}

interface MetricsSpecs {
  [key: string]: MetricsSpec;
}

interface MetricsSpec {
  prefix: string;
  type: string;
  color: string;
  metrics: MetricSpec[];
  tableMetric?: number;
}

interface MetricSpec {
  label: string;
  formatter: (v: number) => string;
  suffix?: string;
}

interface Metric extends MetricSpec {
  name: string;
  i: number;
}

interface Row {
  key: string;
  name: string;
  type: string;
  color: string;
  tableMetric: number;
  snapshotId: string;
  timeConfig: TimeConfig;
  rollup?: number;
  metrics: Metric[];
  pinnedMetrics: string[];
  setPinnedMetrics: (p: string[]) => void;
}

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
      get(row: Row) {
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
      getValue(row: Row) {
        return row.type;
      },
      getContent(type: string, row: Row) {
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
      getValue(row: Row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-sdk:dashboard.customMetricsV2.customMetricsTitleValue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).name;
      },
      getContent(value: number, row: Row) {
        return (row.metrics[row.tableMetric] || row.metrics[0]).formatter(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      },
      getTimeConfig(row: Row) {
        return row.timeConfig;
      },
      getRollup(row: Row) {
        return row.rollup;
      }
    }
  }
];

const bind = [
  {
    path: '/dashboard',
    name: 'pinnedMetrics',
    initialState: [],
    serializer: buildJsonSerializer(),
    parser: buildJsonParser([])
  }
];

const resets = [
  {
    bind: [snapshotIdUrlParameter],
    reset: {
      pinnedMetrics: []
    }
  }
];

export default function CustomMetricsV2(props: CustomMetricProps) {
  const { titlePrefix, postProcessRow, getRows = getDefaultRows, customColumns, timeConfig, snapshot } = props;

  const snapshotId = snapshot.get('id');

  const [{ pinnedMetrics }, setState] = useUrlState<{ pinnedMetrics: string[] }>({
    bind,
    resets
  });

  const setPinnedMetrics = useCallback(pinnedMetrics => setState({ pinnedMetrics }), [setState]);

  const metricIdsResult = useMetricIds({ snapshotId, timeConfig });

  const rows = getRows({ metricIdsResult, pinnedMetrics, setPinnedMetrics, ...props });

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
          cols={customColumns ? customColumns : cols}
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
        cols={customColumns ? customColumns : cols}
        rows={rows}
        getRowDetails={getDetails}
        maxItemsPerPage={20}
        initialSortColumn={2}
      />
    </Fragment>
  );
}

function getDetails(row: Row) {
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
      minRollup={adjustMetricRollup(row.type, row.name, getInfraGranularity(row.timeConfig))}
      y1={y1}
      y2={y2}
    />
  );
}

export function getDefaultRows({
  snapshot,
  timeConfig,
  metricIdsResult,
  setPinnedMetrics,
  pinnedMetrics,
  specs = DEFAULT_SPECS
}: GetRowsProps) {
  const snapshotId = snapshot.get('id');
  const defaultRollup = getInfraGranularity(timeConfig);

  const metrics =
    metricIdsResult.data?.reduce<{ [key: string]: Row }>((acc, id) => {
      const metric = expandMetric(id, specs);
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
        rollup: adjustMetricRollup(metric.type, metric.name, defaultRollup),
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
    }, {}) || {};

  return Object.values(metrics);
}

function expandMetric(id: string, specs: MetricsSpec[]) {
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


/*
 * Adjusts the metric rollup if necessary
 * to enable the retrieval of histogram metrics
 * that are stored only in BeeInstana. Returns
 * undefined if the rollup does not need to
 * be changed.
 */
function adjustMetricRollup(
  metricType: string,
  metricName: string,
  defaultRollup: number): number | undefined {

    if (beeinstanaHistogramsEnabled && defaultRollup < beeInstanaMinimumRollupMillis) {
      if (metricType === "histogram" && nativeBeeInstanaHistogram(metricName)) {
        return beeInstanaMinimumRollupMillis;
      }
    }
  return;
}

/*
 * Returns true if a histogram metric is stored
 * natively in BeeInstana. Native histograms
 * do not include _bucket, _sum, or _count as
 * part of the metric name.
 */
function nativeBeeInstanaHistogram(metricName: string): boolean {
  const nonNativeMetrics = ["_bucket","_count","_sum","_mean","_gcount","_gsum"];
  const metricSplit = metricName.split("{");
  if (metricSplit.length > 0) {
    let index = metricSplit[0].lastIndexOf("_");
    if (index === -1 ||
      !nonNativeMetrics.includes(metricSplit[0].substr(index))) {
      return true;
    }
  }
  return false;
}

export const AVAILABLE_SPECS: MetricsSpecs = {
  COUNTER: {
    prefix: 'metrics.counters.',
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
    type: 'summary',
    color: '#f75c03',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  GENERIC: {
    prefix: '',
    type: 'generic',
    color: '#2274A5',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
  },
  SUM: {
    prefix: 'metrics.sums.',
    type: 'sum',
    color: '#2274A5',
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
  AVAILABLE_SPECS.SUMMARY,
  AVAILABLE_SPECS.SUM
];
