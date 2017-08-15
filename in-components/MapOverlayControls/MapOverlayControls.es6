import React from 'react';

import { controls$ } from 'in-components/MapOverlayControls/stores/controlsStore';
import { timelineHeight$ } from 'in-components/timeline/timelineStore';
import Menu from 'in-components/MapOverlayControls/components/Menu';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/MapOverlayControls.less';

const block = 'in-map-overlaycontrols';

export default connectTo(
  {
    timelineHeight: timelineHeight$,
    controls: controls$
  },
  function MapOverlayControls({ controls, timelineHeight }) {
    if (!controls) {
      return null;
    }
    return (
      <div
        className={block}
        style={{
          bottom: toPx(timelineHeight + 20)
        }}
      >
        {controls}
        <Menu />
      </div>
    );
  }
);
