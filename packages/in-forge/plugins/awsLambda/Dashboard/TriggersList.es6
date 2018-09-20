import React, { Fragment } from 'react';

import { ClickableList, ClickableSnapshotListItem } from 'in-sdk/components/sidebar/ClickableList';
import getTriggersForLambda from 'in-subscription/getTriggersForLambda';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { compareIgnoreCase } from 'in-services/util/string';
import Separator from 'in-sdk/components/sidebar/Separator';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    triggers: timeConfig$
      .flatMap(timeConfig => getTriggersForLambda({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function TriggersList({ triggers }) {
    if (!triggers || triggers.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <Separator />

        <Collapsible initiallyOpen>
          <Collapsible.Header>Triggers ({triggers.length})</Collapsible.Header>
          <Collapsible.Content>
            <ClickableList>
              {triggers.map(tg => (
                <ClickableSnapshotListItem key={tg.get('id')} snapshotId={tg.get('id')} withIcon />
              ))}
            </ClickableList>
          </Collapsible.Content>
        </Collapsible>
      </Fragment>
    );
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
