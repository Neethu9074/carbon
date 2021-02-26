/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import createAwsHostForEbs from 'in-subscription/awsHostForEbs';
import { DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getLabel } from 'in-sdk/snapshot';

export default connectTo(
  props => ({
    hostSnapshot: timeConfig$
      .flatMap(timeConfig => createAwsHostForEbs({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshot)
  }),
  function HostLink({ hostSnapshot }) {
    if (!hostSnapshot) {
      return null;
    }
    return (
      <DescriptionItem title={t('in-forge:plugins.titleHost')}>
        <SnapshotLink snapshotId={hostSnapshot.get('id')}>{getLabel(hostSnapshot)}</SnapshotLink>
      </DescriptionItem>
    );
  }
);
