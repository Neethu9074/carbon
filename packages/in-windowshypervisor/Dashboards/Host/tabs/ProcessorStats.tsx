/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
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
  snapshotId: string;
}

interface TableRow {
  key: string;
  processorstats: ProcessorStats;
  data: ProcessorStatsData['data'];
  stats: SnapshotData;
}

const nameColumn = {
  title: t('in-windowshypervisor:dashboards.name'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.stats.get('name');
    }
  }
};

const coresColumn = {
  title: t('in-windowshypervisor:dashboards.numberOfCores'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.stats.get('numberOfCores');
    },
    getContent: number.compact
  }
};

const logicalProcessorsColumn = {
  title: t('in-windowshypervisor:dashboards.numberOfLogicalProcessors'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.stats.get('numberOfLogicalProcessors');
    },
    getContent: number.compact
  }
};

const loadColumn = {
  title: t('in-windowshypervisor:dashboards.loadPercentage'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.stats.get('loadPercentage');
    },
    getContent: number.compact
  }
};

const maxClockSpeedColumn = {
  title: t('in-windowshypervisor:dashboards.maxClockSpeed'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.stats.get('maxClockSpeed');
    },
    getContent: number.compact
  }
};

const ProcessorStats = function ProcessorStats({ snapshotId, timeConfig }: ProcessorStatsData) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'processorStats', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data || null == (data as SnapshotData).get('raw_payload')) {
    return null;
  }

  const TopProcessorStats: any = (data as SnapshotData).get('raw_payload');
  const rows: ProcessorStatsData[] = TopProcessorStats.toArray().map((stats: SnapshotData, index: number) => {
    return {
      key: String(index),
      stats
    };
  });

  if (rows.length === 0) {
    return null;
  }

  const cols = [nameColumn, coresColumn, logicalProcessorsColumn, loadColumn, maxClockSpeedColumn];

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
};

export default ProcessorStats;
