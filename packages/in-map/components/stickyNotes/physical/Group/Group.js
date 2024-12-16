/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonTag } from '@instana/components';

import { selectedSnapshotId, setSelectedSnapshotId } from 'in-stores/snapshot';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-map/components/stickyNotes/physical/Group/Group.mless';

export default createStickyNote(
  connectTo(
    props => {
      return {
        snapshot: getSnapshot(props.id),
        selectedId: selectedSnapshotId
      };
    },
    function Group({ snapshot, id }) {
      let label;
      if (snapshot) {
        label = getLabel(snapshot);
      } else if (id.indexOf('grouping=') === 0) {
        label = id.substr('grouping='.length);
      } else {
        return null;
      }

      return (
        <CarbonTag size="sm" className={locals.inStickyNoteButton} onClick={() => setSelectedSnapshotId(id)}>
          {label}
        </CarbonTag>
      );
    }
  )
);
