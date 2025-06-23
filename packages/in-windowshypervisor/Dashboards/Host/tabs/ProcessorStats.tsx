/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface ProcessorStats {
  name: string;
  numberOfCores: number;
  numberOfLogicalProcessors: number;
  loadPercentage: number;
}

interface ProcessorStatsData {
  data: SnapshotData;
  timeConfig: TimeConfig;
}

interface TableRow {
  key: string;
  processorstats: ProcessorStats;
  timeConfig: TimeConfig;
  data: ProcessorStatsData['data'];
}

const nameColumn = {
  title: t('in-windowshypervisor:dashboards.name'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.processorstats.name;
    }
  }
};

const coresColumn = {
  title: t('in-windowshypervisor:dashboards.numberOfCores'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.processorstats.numberOfCores;
    },
    getContent: number.compact
  }
};

const logicalProcessorsColumn = {
  title: t('in-windowshypervisor:dashboards.numberOfLogicalProcessors'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.processorstats.numberOfLogicalProcessors;
    },
    getContent: number.compact
  }
};

const loadColumn = {
  title: t('in-windowshypervisor:dashboards.loadPercentage'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.processorstats.loadPercentage;
    },
    getContent: number.compact
  }
};

export default function ProcessorStatsTable({ data, timeConfig }: ProcessorStatsData) {
  const rows: TableRow[] = data.processorStats.map((processorstats: any) => ({
    key: processorstats.name,
    processorstats,
    timeConfig,
    data
  }));

  if (rows.length === 0) {
    return null;
  }

  const cols = [nameColumn, coresColumn, logicalProcessorsColumn, loadColumn];

  return (
    <Table
      cardTitle={t('in-windowshypervisor:dashboards.processorStats')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(loadColumn)}
    />
  );
}
