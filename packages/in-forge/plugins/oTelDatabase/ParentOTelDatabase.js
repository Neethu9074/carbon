/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import getParentOTelDatabase from 'in-subscription/getParentOTelDatabase';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    oTelDatabase: timeConfig$
      .flatMap(timeConfig => getParentOTelDatabase({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
  }),
  function ParentOTelDatabase({ oTelDatabase }) {
    if (!oTelDatabase) {
      return null;
    }

    return (
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.parentOTelDatabase')}>
        <SnapshotLink snapshotId={oTelDatabase.get('id')}>{getLabel(oTelDatabase)}</SnapshotLink>
      </DescriptionItem>
    );
  }
);
