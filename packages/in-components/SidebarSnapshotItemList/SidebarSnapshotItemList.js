/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { ClickableList, ClickableSnapshotListItem } from 'in-sdk/components/sidebar/ClickableList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { sortByLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, subscription }) => ({
    items: timeConfig$
      .flatMap(timeConfig => subscription({ snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sortByLabel))
  }),
  function SidebarSnapshotItemList({ label, items }) {
    if (!items || items.length === 0) {
      return null;
    }

    return (
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {label} ({items.length})
        </Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {items.map(item => (
              <ClickableSnapshotListItem key={item.get('id')} snapshotId={item.get('id')} withIcon />
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
