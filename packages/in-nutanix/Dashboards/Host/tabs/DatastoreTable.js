/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const diskStatusColumn = {
  title: t('in-nutanix:dashboards.diskStatus'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.diskStatus;
    }
  }
};
const mountPathColumn = {
  title: t('in-nutanix:dashboards.mountPath'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.mountPath;
    }
  }
};
const storageTierNameColumn = {
  title: t('in-nutanix:dashboards.storageTierName'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.storageTierName;
    }
  }
};
const availableSpaceColumn = {
  title: t('in-nutanix:dashboards.availableSpace'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.availableSpace;
    },
    getContent: bytes.detailed
  }
};

const freeSpaceColumn = {
  title: t('in-nutanix:dashboards.freeSpace'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.freeSpace;
    },
    getContent: bytes.detailed
  }
};

const usedSpaceColumn = {
  title: t('in-nutanix:dashboards.usedSpace'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.storagedisk.usedSpace;
    },
    getContent: bytes.detailed
  }
};

export default function StoragedisksTable({ data, timeConfig }) {
  const rows = [
    ...data.datastores.map(storagedisk => {
      return {
        key: storagedisk.uuid,
        storagedisk,
        timeConfig,
        data
      };
    })
  ];

  if (rows.length === 0) {
    return null;
  }

  const cols = [
    diskStatusColumn,
    mountPathColumn,
    storageTierNameColumn,
    availableSpaceColumn,
    freeSpaceColumn,
    usedSpaceColumn
  ];

  return (
    <Table
      cardTitle={t('in-nutanix:dashboards.noOfDisks')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(availableSpaceColumn)}
    />
  );
}
