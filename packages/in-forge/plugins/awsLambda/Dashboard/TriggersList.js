/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ClickableList, ClickableSnapshotListItem } from 'in-sdk/components/sidebar/ClickableList';
import getTriggersForLambdaVersion from 'in-subscription/getTriggersForLambdaVersion';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    triggers: timeConfig$
      .flatMap(timeConfig => getTriggersForLambdaVersion({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function TriggersList({ triggers }) {
    if (!triggers || triggers.length === 0) {
      return null;
    }

    return (
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.awsLambda.headerTriggersCount', { len: triggers.length })}
        </Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {triggers.map(tg => (
              <ClickableSnapshotListItem key={tg.get('id')} snapshotId={tg.get('id')} withIcon />
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
