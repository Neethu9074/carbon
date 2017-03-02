import React from 'react';

import {controls$} from 'in-components/MapOverlayControls/stores/controlsStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import Menu from 'in-components/MapOverlayControls/components/Menu';
import {isWebVRActive$} from 'in-map/stores/webVRStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/MapOverlayControls.less';


const block = 'in-map-overlaycontrols';

export default connectTo({
  isWebVRActive: isWebVRActive$.debounce(1000),
  timelineHeight: timelineHeight$,
  controls: controls$
},
function MapOverlayControls({controls, isWebVRActive, timelineHeight}) {
  if (!controls || isWebVRActive) {
    return null;
  }

  return (
    <div className={block}
         style={{
           bottom: toPx(timelineHeight + 20)
         }}>
      {controls}
      <Menu />
    </div>
  );
});
