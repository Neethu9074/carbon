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
    title: t('in-forge:plugins.host.dashboard.physicalVolumeName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.phyVol.get('pv_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.totalSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.phyVol.get('pv_total_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.usedSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.phyVol.get('pv_used_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.freeSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.phyVol.get('pv_free_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      rawPayloadWithTimestamp: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'physicalVolumes')
    };
  },
  function PhysicalVolume({ snapshot, timeConfig, rawPayloadWithTimestamp }) {
    if (!rawPayloadWithTimestamp || !rawPayloadWithTimestamp.get('raw_payload')) {
      return null;
    }

    const physicalVolumes = rawPayloadWithTimestamp.get('raw_payload', []);
    if (physicalVolumes.size === 0) {
      return null;
    }
    const rows = physicalVolumes
      .keySeq()
      .toArray()
      .map(key => {
        const phyVol = physicalVolumes.get(key);
        return {
          key: String(key),
          phyVol,
          timeConfig,
          hostSnapshot: snapshot,
          hostSnapshotId: snapshot.get('id')
        };
      });

    return (
      <Table cardTitle={t('in-forge:plugins.host.dashboard.physicalVolume')} withoutPadding cols={cols} rows={rows} />
    );
  }
);
