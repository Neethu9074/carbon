/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fromJS } from 'immutable';
import React from 'react';

import { SummaryData } from 'in-xenserver/Dashboards/VM/tabs/Summary';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-xenserver:dashboards.storageRepository.name'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.storageRepository.get('nameLabel');
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.storageRepository.type'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.storageRepository.get('type');
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.storageRepository.virtualAllocation'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.storageRepository.get('virtualAllocation');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-xenserver:dashboards.storageRepository.physicalUtilisation'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.storageRepository.get('physicalUtilisation');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-xenserver:dashboards.storageRepository.physicalSize'),
    type: 'number',
    typeArgs: {
      getValue(row: any) {
        return row.storageRepository.get('physicalSize');
      },
      getContent: bytes.compact
    }
  }
];

export default function StorageRepositoryTable({ data: hostSnapshot, timeConfig }: SummaryData) {
  hostSnapshot = fromJS(hostSnapshot);
  const rows = hostSnapshot
    .getIn(['sr'], emptyMap)
    .map((storageRepository: any, name: any) => {
      return {
        key: name,
        name,
        storageRepository,
        snapshotId: hostSnapshot.get('id'),
        timeConfig
      };
    })
    .valueSeq()
    .toArray();
  return <Table cardTitle={t('in-xenserver:dashboards.storageRepositories')} withoutPadding cols={cols} rows={rows} />;
}
