/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fromJS } from 'immutable';
import React from 'react';

import { SummaryData } from 'in-linux-kvm-hypervisor/Dashboards/Host/tabs/Summary';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-linux-kvm-hypervisor:dashboards.storagePoolName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.storagePools.get('name');
      }
    }
  },
  {
    title: t('in-linux-kvm-hypervisor:dashboards.storagePoolState'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.storagePools.get('state');
      }
    }
  },
  {
    title: t('in-linux-kvm-hypervisor:dashboards.storageMemoryAvailable'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.storagePools.get('totalStorageMemoryAvailable');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-linux-kvm-hypervisor:dashboards.storageMemoryUsed'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.storagePools.get('totalStorageMemoryUsed');
      },
      getContent: bytes.compact
    }
  }
];

export default function StorageRepositoryTable({ data: hostSnapshot, timeConfig }: SummaryData) {
  hostSnapshot = fromJS(hostSnapshot);
  const rows = hostSnapshot
    .getIn(['storagePool'], emptyMap)
    .map((storagePools: any, name: any) => {
      return {
        key: name,
        name,
        storagePools,
        snapshotId: hostSnapshot.get('id'),
        timeConfig
      };
    })
    .valueSeq()
    .toArray();
  return <Table cardTitle={t('in-linux-kvm-hypervisor:storagePools')} withoutPadding cols={cols} rows={rows} />;
}
