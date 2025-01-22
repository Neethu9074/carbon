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
import { percentagePlain } from 'in-services/formatters/number';
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

export const colorFormatter = function Color(value: object | undefined | null) {
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        return 'mean';
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
        const trendValue = row;
        return <Badge color={colorFormatter(trendValue)}>{trendValue + '%'}</Badge>;
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NamespaceCost({ currencyCode, snapshotId, timeConfig }: NamespaceProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'namespaceCostList'), [snapshotId]);

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
    />
  );
}

function getCurrency(value: NamespaceCostRow) {
  return `${currencyType} ${value}`;
}
