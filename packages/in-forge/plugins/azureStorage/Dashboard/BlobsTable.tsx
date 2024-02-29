/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import { getSnapshots } from 'in-stores/snapshot';
// @ts-expect-error Module needs to be translated to TS
import connectTo from 'in-hoc/connectTo';
import getBlobsForStorage from 'in-forge/plugins/azureStorage/subscriptions/getBlobsForStorage';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureStorage.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.location'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'location']);
      }
    }
  }
];

interface BlobInformationProps {
  snapshot: any;
  location: any;
  blobs: any[];
  timeConfig: TimeConfig;
}

export default connectTo(
  (props: BlobInformationProps) => ({
    blobs: timeConfig$
      .flatMap(timeConfig => getBlobsForStorage({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function BlobsTable({ blobs, timeConfig }: BlobInformationProps) {
    if (blobs == null || blobs.length === 0) {
      return null;
    }

    const rows = blobs.map((blob: any) => {
      const id = blob.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: blob,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureStorage.dashboard.blobsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
