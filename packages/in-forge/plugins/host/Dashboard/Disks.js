/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';


const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.diskName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.disk.get('diskName');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.avgDiskTransfer'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('avgDiskTransfer');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.busyPercent'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('busyPercent');
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.transferRate'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('transferRate');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.readTransfers'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('readTransfers');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.writeTransfers'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('writeTransfers');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.serviceQueueFull'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('serviceQueueFull');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.transfers'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('transfers');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.diskReads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('diskReads');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.diskWrites'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.disk.get('diskWrites');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.diskType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.disk.get('diskType');
      }
    }
  }
];



export default connectTo(
  props => {
    return {
      rawPayloadWithTimestamp: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'diskList')
    };
  },
  function Disks({ snapshot, timeConfig, rawPayloadWithTimestamp }) {
    if (!rawPayloadWithTimestamp || !rawPayloadWithTimestamp.get('raw_payload')) {
      return null;
    }

    const disks = rawPayloadWithTimestamp.get('raw_payload', []);
    if (disks.size === 0) {
      return null;
    }
    const rows = disks
      .keySeq()
      .toArray()
      .map(key => {
        const disk = disks.get(key);
        return {
          key: String(key),
          disk,
          timeConfig,
          hostSnapshot: snapshot,
          hostSnapshotId: snapshot.get('id')
        };
      });

    return (
      <Table cardTitle={t('in-forge:plugins.host.dashboard.disks')} withoutPadding cols={cols} rows={rows} />
    );
  }
);
