/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import getParentProcess from 'in-subscription/getParentProcess';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    process: timeConfig$
      .flatMap(timeConfig => getParentProcess({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
  }),
  function ParentProcess({ process }) {
    if (!process) {
      return null;
    }

    return (
      <DescriptionItem title={t('in-forge:plugins.process.parentProcess')}>
        <SnapshotLink snapshotId={process.get('id')}>{getLabel(process)}</SnapshotLink>
      </DescriptionItem>
    );
  }
);
