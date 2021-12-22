/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getAliCloudOssBuckets from 'in-forge/plugins/aliCloudOss/subscriptions/getAliCloudOssBuckets';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.aliCloudOss.bucketId'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudOssBucket.region'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'region'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudOssBucket.storageClass'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'storageClass'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudOssBucket.creationDate'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'creationDate'], missingValue);
      }
    }
  }
];

export default connectTo(
  props => ({
    buckets: timeConfig$
      .flatMap(timeConfig => getAliCloudOssBuckets({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function aliCloudOsssTable({ buckets, timeConfig }) {
    if (buckets == null || buckets.length === 0) {
      return null;
    }

    const rows = buckets.map(bucket => {
      const id = bucket.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: bucket,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aliCloudOss.bucketsList', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
