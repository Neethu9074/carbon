import React from 'react';

import { ClickableList, ClickableSnapshotListItem } from 'in-sdk/components/sidebar/ClickableList';
import getTriggersForLambda from 'in-subscription/getTriggersForLambda';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
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
  }),
  function TriggersList({ triggers }) {
    if (triggers && triggers.length > 0) {
      return (
        <div>
          <Separator />

          <Collapsible initiallyOpen>
            <Collapsible.Header>Triggers ({triggers.length})</Collapsible.Header>
            <Collapsible.Content>
              <ClickableList>
                {triggers.map(tg => (
                  <ClickableSnapshotListItem key={tg.get('id')} snapshotId={tg.get('id')}>
                    {getLabel(tg)}
                  </ClickableSnapshotListItem>
                ))}
              </ClickableList>
            </Collapsible.Content>
          </Collapsible>
        </div>
      );
    }
    return null;
  }
);
