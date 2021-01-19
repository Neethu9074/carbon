/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    stickies.forEach(stickyDefinition => {
      const StickyNote = stickyDefinition.type;
      const id = stickyDefinition.props.id;
      stickyComponents[stickyComponentsIndex++] = <StickyNote key={id} id={id} {...stickyDefinition.props} />;
    });

    return <div>{stickyComponents}</div>;
  }
);
