import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    snapshot: getSnapshot(ID_OF_PROCESSING_STATISTICS)
  },
  function Cockpit({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return (
      <FullscreenOverlayView overlayTimeline>
        Welcome to da cockpit! Here are reaking metrics:
      </FullscreenOverlayView>
    );
  }
);
