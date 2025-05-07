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
import { KUBECOST_EXPORT_DEPLOYMENT_COST_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { percentagePlain } from 'in-services/formatters/number';
import CsvExporter from 'in-components/CsvExporter/CsvExporter';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

let currencyType = 'USD';
interface DeploymentCostRow {
  key: string;
  snapshotId: string;
  deploymentCostList: Map<string, object>;
}

interface DeploymentProps {
  currencyCode: string;
  snapshotId: string;
  timeConfig: TimeConfig;
}
interface CSVExportProps {
  csvHeaders: Record<string, any>[];
  csvData: Record<string, any>[];
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
    title: t('in-kubernetes:dashboards.kubecost.deployment'),
    type: 'string',
    typeArgs: {
      getValue(row: DeploymentCostRow) {
        return row.deploymentCostList.get('controller');
      }
    }
  },
  {
    title: t('in-kubernetes:dashboards.kubecost.cpuCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.cpuCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.gpuCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.networkCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.pvCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.loadBalancerCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.sharedCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.totalEfficiency`;
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.ramCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.totalCost`;
      },
      getContent(row: DeploymentCostRow) {
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
      getSnapshotId(row: DeploymentCostRow) {
        return row.snapshotId;
      },
      getMetricName(row: DeploymentCostRow) {
        return `deploymentCostList.${row.key}.trend`;
      },
      getContent(row: DeploymentCostRow) {
        const trendValue = row;
        return <Badge color={colorFormatter(trendValue)}>{trendValue + '%'}</Badge>;
      },
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default function DeploymentCost({ currencyCode, snapshotId, timeConfig }: DeploymentProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'deploymentCostList', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }
  const wpList = (data as SnapshotData).get('raw_payload', []);
  currencyType = currencyCode;
  const rows: DeploymentCostRow[] = wpList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const deploymentCostList = wpList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        deploymentCostList
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-kubernetes:dashboards.kubecost.costByDeployment')}
      cols={cols}
      rows={rows}
      initialSortColumn={9}
      initialSortDirection="desc"
      CSVExportButton={CSVExportButton}
    />
  );
}

function getCurrency(value: DeploymentCostRow) {
  return `${currencyType} ${value}`;
}

const CSVExportButton = ({ csvHeaders, csvData }: CSVExportProps) => {
  const { trackCta } = useSegmentTracking();
  const headers: string[] = [];
  const cols: string[][] = [];
  csvHeaders.forEach((csvHeader: Record<string, any>) => headers.push(csvHeader.header));
  csvData.forEach((row: Record<string, any>) => {
    const arr: string[] = [];
    headers.map((header: any) => {
      if (header === t('in-kubernetes:dashboards.kubecost.deployment')) {
        return arr.push(row['id']);
      } else if (header === t('in-kubernetes:dashboards.kubecost.trend')) {
        return arr.push(row[header]?.props?.children ? row[header].props.children : ' ');
      } else {
        return arr.push(row[header]);
      }
    });
    cols.push(arr);
  });

  trackCta(KUBECOST_EXPORT_DEPLOYMENT_COST_CLICK);

  return <CsvExporter headers={headers} data={cols} fileName="deployment_cost.csv" />;
};
