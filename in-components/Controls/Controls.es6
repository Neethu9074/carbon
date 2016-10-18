import React from 'react';

import {controls$} from 'in-components/Controls/stores/controlsStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import Menu from 'in-components/Controls/components/Menu';
import {isWebVRActive$} from 'in-map/stores/webVRStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/Controls.less';


const block = 'in-controls';

export default connectTo({
  timelineHeight: timelineHeight$,
  isWebVRActive: isWebVRActive$.debounce(1000),
  controls: controls$
},
function Controls({controls, isWebVRActive, timelineHeight}) {
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
