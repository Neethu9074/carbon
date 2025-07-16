/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { kiloBytes, number } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface StorageDisk {
  controllerType: string;
  controllerNumber: number;
  path: string;
  size: number;
}

interface StorageDiskData {
  data: SnapshotData;
  timeConfig: TimeConfig;
}

interface TableRow {
  key: string;
  storagedisk: StorageDisk;
  timeConfig: TimeConfig;
  data: StorageDiskData['data'];
}

const controllerTypeColumn = {
  title: t('in-windowshypervisor:dashboards.vm.controllerType'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.controllerType;
    }
  }
};

const controllerNumberColumn = {
  title: t('in-windowshypervisor:dashboards.vm.controllerNumber'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.controllerNumber;
    },
    getContent: number.compact
  }
};

const pathColumn = {
  title: t('in-windowshypervisor:dashboards.vm.path'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.path;
    }
  }
};

const sizeColumn = {
  title: t('in-windowshypervisor:dashboards.vm.size'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.size;
    },
    getContent: kiloBytes.detailed
  }
};

export default function StorageDisksTable({ data, timeConfig }: StorageDiskData) {
  const rows: TableRow[] = data.disks.map((storagedisk: any) => ({
    key: storagedisk.path,
    storagedisk,
    timeConfig,
    data
  }));

  if (rows.length === 0) {
    return null;
  }

  const cols = [controllerTypeColumn, controllerNumberColumn, pathColumn, sizeColumn];

  return (
    <Table
      cardTitle={t('in-windowshypervisor:dashboards.disksAttached')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(sizeColumn)}
    />
  );
}
