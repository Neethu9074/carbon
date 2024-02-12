/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

//@ts-expect-error
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { hasError, isLoading, success } from 'in-services/util/result';
import { getEc2Tags, getSnapshot } from 'in-stores/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export function Ec2Tags({
  snapshotId: ec2SnapshotId,
  deprecatedTags
}: {
  snapshotId: string;
  deprecatedTags: Map<string, string>;
}) {
  const ec2TagsSnapshot =
    useObservable(
      getEc2Tags(ec2SnapshotId).flatMap(result =>
        result ? getSnapshot(result).map(data => success(data)) : just(pendingResult)
      ),
      [ec2SnapshotId]
    ) ?? pendingResult;

  if (isLoading(ec2TagsSnapshot) || hasError(ec2TagsSnapshot)) {
    return null;
  }
  const ec2Tags = ec2TagsSnapshot.data.get('data')?.get('tags');
  const tags = ec2Tags?.size > 0 ? ec2Tags : deprecatedTags;

  return <KeyValueOverlay header={t('in-forge:plugins.ec2.tags')} data={tags} />;
}
