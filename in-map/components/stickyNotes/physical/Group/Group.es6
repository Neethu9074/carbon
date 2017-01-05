import React from 'react';

import {selectedSnapshotId, setSelectedSnapshotId} from 'in-stores/snapshot';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import {showSticky$} from 'in-map/stores/physical/groupsStore';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/physical/Group/Group.less';


export default createStickyNote(
  connectTo(props => {
    return {
      snapshot: getSnapshot(props.id),
      selectedId: selectedSnapshotId,
      showSticky: showSticky$.distinct()
    };
  },
  function Group({selectedId, showSticky, snapshot, id}) {
    if (!snapshot || !showSticky) {
      return null;
    }

    const c = getColorPool('groups').getColorRGB(id);
    const backgroundColor = selectedId === id ?
      '#fff' :
      'rgb(' + ((c.r * 255) | 0) + ',' + ((c.g * 255) | 0) + ',' + ((c.b * 255) | 0) + ')';

    return (
      <div className='in-sticky-note-group'
           onClick={() => setSelectedSnapshotId(id)}
           style={{backgroundColor}}>
        {getLabel(snapshot)}
      </div>
    );
  }
));
