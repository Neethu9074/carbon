/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error needs TS migration
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { KUBECOST_EXPORT_NAMESPACE_COST_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { percentagePlain } from 'in-services/formatters/number';
import CsvExporter from 'in-components/CsvExporter/CsvExporter';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

let currencyType = 'USD';
interface NamespaceCostRow {
  key: string;
  snapshotId: string;
  namespaceCostList: Map<string, object>;
}

interface NamespaceProps {
  currencyCode: string;
  snapshotId: string;
  timeConfig: TimeConfig;
}
interface CSVExportProps {
  csvHeaders: Record<string, any>[];
  csvData: Record<string, any>[];
}

export const colorFormatter = function Color(value: number | object) {
  if (typeof value === 'number') {
    if (value > 0) {
      return themes.default.ids.color.option.red['500'];
    } else if (value < 0) {
      return themes.default.ids.color.option.green['500'];
    } else {
      return themes.default.ids.color.option.neutral['400'];
    }
  }
  return themes.default.ids.color.option.neutral['400'];
};

const cols = [
  {
    title: t('in-kubernetes:dashboards.kubecost.namespace'),
    type: 'string',
    typeArgs: {
      getValue(row: NamespaceCostRow) {
        return row.namespaceCostList.get('namespace');
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.cpuCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.cpuCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.gpuCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.gpuCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.networkCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.networkCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.pvCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.pvCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.loadBalancerCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.loadBalancerCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.sharedCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.sharedCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.totalEfficiency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.totalEfficiency`;
      },
      getContent: percentagePlain.detailed,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.ramCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.ramCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.totalCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.totalCost`;
      },
      getContent(row: NamespaceCostRow) {
        return getCurrency(row);
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.trend'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NamespaceCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: NamespaceCostRow) {
        return `namespaceCostList.${row.key}.trend`;
      },
      getContent(row: NamespaceCostRow) {
        // BeeInstana doesn't support negative values, so we subtract the 1000 offset (added by the sensor) to normalize the values for display.
        const isValidNumber = typeof row === 'number';
        const adjustedtrendValue = isValidNumber ? row - 1000 : row;

        if (!isValidNumber) return '-';

        return <Badge color={colorFormatter(adjustedtrendValue)}>{adjustedtrendValue + '%'}</Badge>;
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default function NamespaceCost({ currencyCode, snapshotId, timeConfig }: NamespaceProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'namespaceCostList', timeConfig),
    [snapshotId, timeConfig]
  );

  if (!data) {
    return null;
  }
  const wpList = (data as SnapshotData).get('raw_payload', []);
  currencyType = currencyCode;
  const rows: NamespaceCostRow[] = wpList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const namespaceCostList = wpList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        namespaceCostList
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-kubernetes:dashboards.kubecost.namespaceCumulativeCost')}
      cols={cols}
      rows={rows}
      initialSortColumn={9}
      initialSortDirection="desc"
      CSVExportButton={CSVExportButton}
    />
  );
}

function getCurrency(value: NamespaceCostRow) {
  return `${currencyType} ${value}`;
}
const CSVExportButton = ({ csvHeaders, csvData }: CSVExportProps) => {
  const { trackCta } = useSegmentTracking();
  const headers: string[] = csvHeaders.map(csvHeader => csvHeader.header);
  const cols: string[][] = [];

  const namespaceHeader = t('in-kubernetes:dashboards.kubecost.namespace');
  const trendHeader = t('in-kubernetes:dashboards.kubecost.trend');

  csvData.forEach((row: Record<string, any>) => {
    const arr: string[] = headers.map(header => {
      if (header === namespaceHeader) {
        return row.id;
      } else if (header === trendHeader) {
        return row[header]?.props?.children ?? ' ';
      } else {
        return row[header];
      }
    });
    cols.push(arr);
  });

  trackCta(KUBECOST_EXPORT_NAMESPACE_COST_CLICK);

  return <CsvExporter headers={headers} data={cols} fileName="namespace_cost.csv" />;
};
