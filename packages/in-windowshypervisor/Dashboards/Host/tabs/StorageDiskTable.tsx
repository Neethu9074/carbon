/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface StorageDisk {
  deviceID: string;
  volumeName: string;
  freeSpace: number;
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

const deviceIDColumn = {
  title: t('in-windowshypervisor:dashboards.deviceID'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.deviceID;
    }
  }
};

const volumeNameColumn = {
  title: t('in-windowshypervisor:dashboards.volumeName'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.volumeName;
    }
  }
};

const freeSpaceColumn = {
  title: t('in-windowshypervisor:dashboards.freeSpace'),
  type: 'string',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.freeSpace;
    }
  }
};

const sizeColumn = {
  title: t('in-windowshypervisor:dashboards.size'),
  type: 'number',
  typeArgs: {
    getValue(row: TableRow) {
      return row.storagedisk.size;
    },
    getContent: bytes.detailed
  }
};

export default function StorageDisksTable({ data, timeConfig }: StorageDiskData) {
  const rows: TableRow[] = data.disks.map((storagedisk: any) => ({
    key: storagedisk.deviceID,
    storagedisk,
    timeConfig,
    data
  }));

  if (rows.length === 0) {
    return null;
  }

  const cols = [deviceIDColumn, volumeNameColumn, freeSpaceColumn, sizeColumn];

  return (
    <Table
      cardTitle={t('in-windowshypervisor:dashboards.disksAttached')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(freeSpaceColumn)}
    />
  );
}
