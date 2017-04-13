import React from 'react';

import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    stickies: stickyNotes.stream.debounce(250)
  },
  function StickyNoteHoster({ stickies }) {
    if (!stickies) {
      return null;
    }

    const stickyComponents = [];
    let stickyComponentsIndex = 0;
    for(let key in stickies) {
      const stickyDefinition = stickies[key];
      const StickyNote = stickyDefinition.type;
      stickyComponents[stickyComponentsIndex++] = <StickyNote key={key} id={key} {...stickyDefinition.props} />;
    }

    return (
      <div>
        {stickyComponents}
      </div>
    );
  }
);
