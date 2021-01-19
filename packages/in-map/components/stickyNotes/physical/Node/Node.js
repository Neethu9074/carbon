/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import { getSnapshot } from 'in-stores/snapshot';
import { getSetting$ } from 'in-services/settings';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/physical/Node/Node.less';

export default createStickyNote(
  connectTo(
    {
      showHostLabels: getSetting$('map_showHostLabels')
    },
    function Node({ id, showHostLabels }) {
      if (!showHostLabels) {
        return null;
      }

      return <Label id={id} />;
    }
  )
);

const Label = connectTo(
  ({ id }) => ({
    snapshot: getSnapshot(id)
  }),
  function Label({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return <div className="in-sticky-note-node">{getLabel(snapshot)}</div>;
  }
);
