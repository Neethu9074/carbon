import React from 'react';

import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  stickies: stickyNotes.stream
},
function StickyNoteHoster({stickies}) {
  if (!stickies) {
    return null;
  }

  return (
    <div>
      {Object.keys(stickies).map(key => {
        const stickyDefinition = stickies[key];
        const StickyNote = stickyDefinition.type;

        return (
          <StickyNote key={key}
                      id={key}
                      eventEmitter={stickyDefinition.eventEmitter}
                      {...stickyDefinition.props} />
        );
      })}
    </div>
  );
});
