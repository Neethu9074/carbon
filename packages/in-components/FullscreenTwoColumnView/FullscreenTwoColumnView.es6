import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import TwoColumnView from 'in-components/TwoColumnView';

export default function FullscreenTwoColumnView(props) {
  return (
    <FullscreenOverlayView>
      <TwoColumnView {...props} />
    </FullscreenOverlayView>
  );
}
