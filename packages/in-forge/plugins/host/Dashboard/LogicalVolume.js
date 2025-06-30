/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
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
        return row.logVol.get('logical_volume_mount_point');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.logicalVolumeState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.logVol.get('logical_volume_state');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      rawPayloadWithTimestamp: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'logicalVolumes')
    };
  },
  function LogicalVolumes({ snapshot, timeConfig, rawPayloadWithTimestamp }) {
    if (!rawPayloadWithTimestamp || !rawPayloadWithTimestamp.get('raw_payload')) {
      return null;
    }

    const logicalVolumes = rawPayloadWithTimestamp.get('raw_payload', []);
    if (logicalVolumes.size === 0) {
      return null;
    }

    const rows = logicalVolumes
      .keySeq()
      .toArray()
      .map(key => {
        const logVol = logicalVolumes.get(key);
        return {
          key: String(key),
          logVol,
          timeConfig,
          hostSnapshot: snapshot,
          hostSnapshotId: snapshot.get('id')
        };
      });

    return (
      <Table cardTitle={t('in-forge:plugins.host.dashboard.logicalVolume')} withoutPadding cols={cols} rows={rows} />
    );
  }
);
