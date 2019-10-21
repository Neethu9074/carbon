import React from 'react';

import PhysicalContent from 'in-components/MapOverlayControls/components/physicalContent';
import Menu from 'in-components/MapOverlayControls/components/Menu';
import toPx from 'in-services/formatters/toPx';

import 'in-components/MapOverlayControls/MapOverlayControls.less';

const block = 'in-map-overlaycontrols';

export default function MapOverlayControls() {
  return (
    <div
      className={block}
      style={{
        bottom: toPx(20)
      }}
    >
      <PhysicalContent />
      <Menu />
    </div>
  );
}
