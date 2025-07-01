/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.volumeGroupName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('volume_group_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_type');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeMountPoint'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_mount_point') || 'N/A';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_state') || 'UNKNOWN';
      }
    }
  }
];

export default function LogicalVolumes({ snapshot, timeConfig }) {
  const logicalVolumes = snapshot.getIn(['data', 'logicalVolumes']);

  if (!logicalVolumes || logicalVolumes.isEmpty()) {
    return null;
  }

  const rows = logicalVolumes.valueSeq().map((logVol, index) => ({
    key: `lv-${index}-${logVol.get('logical_volume_name')}`,
    logVol,
    timeConfig,
    hostSnapshot: snapshot,
    hostSnapshotId: snapshot.get('id')
  })).toArray();

  return (
    <Table cardTitle={t('in-forge:plugins.host.dashboard.logicalVolume')} withoutPadding cols={cols} rows={rows} />
  );
}
