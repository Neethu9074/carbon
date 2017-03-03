import React from 'react';

import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import {showSticky$} from 'in-map/stores/physical/nodesStore';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/physical/Node/Node.less';


export default createStickyNote(
  connectTo(props => {
    return {
      snapshot: getSnapshot(props.id),
      showSticky: showSticky$.distinct()
    };
  },
  function Node({showSticky, snapshot}) {
    if (!snapshot || !showSticky) {
      return null;
    }

    return (
      <div className='in-sticky-note-node'>
        {getLabel(snapshot)}
      </div>
    );
  }
));
