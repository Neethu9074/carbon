/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getDrbdResourcesForReactor from '../subscriptions/getDrbdResourcesForReactor';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const deviceLinkCol = {
  title: t('in-forge:plugins.drbdResource.resourceName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const deviceDataCol = {
  title: t('in-forge:plugins.drbdResource.resourceRole'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'resourceRole']);
    }
  }
};

const deviceMetricsCol = {
  title: t('in-forge:plugins.drbdResource.resourcePromotionScore'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return 'resourcePromotionScore';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function ResourcesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const drbdResources = useObservable(
    getDrbdResourcesForReactor({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(drbdResource => getSnapshot(drbdResource, timeConfig))).map(drbdResources =>
            success(drbdResources)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!drbdResources?.data) {
    return null;
  }

  const rows =
    drbdResources.data.map(drbdResource => ({
      key: drbdResource.get('id'),
      snapshot: drbdResource,
      snapshotId: drbdResource.get('id'),
      timeConfig
    })) || [];

  const cols = [deviceLinkCol, deviceDataCol, deviceMetricsCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdResource.resourcesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
