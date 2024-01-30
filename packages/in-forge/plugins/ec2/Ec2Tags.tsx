/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

//@ts-expect-error
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { t } from 'in-i18n';
import { useObservable } from '@instana/hooks';
import { getEc2Tags, getSnapshot } from 'in-stores/snapshot';
import { hasError, isLoading, success } from 'in-services/util/result';
import { just } from '@instana/observables';
import { pendingResult } from 'in-services/fixedObjects';

export function Ec2Tags({snapshotId: ec2SnapshotId}: {snapshotId: string}){
  const ec2TagsSnapshot = useObservable(
    getEc2Tags(ec2SnapshotId).flatMap(result =>
      result
        ? getSnapshot(result).map(data => success(data))
        : just(pendingResult)
    ),
    [ec2SnapshotId]
  ) ?? pendingResult;

  if(isLoading(ec2TagsSnapshot) || hasError(ec2TagsSnapshot)){
    return null;
  }
  const tags = ec2TagsSnapshot.data.get('data');

  return <KeyValueOverlay header={t('in-forge:plugins.ec2.tags')} data={tags} />;
}
