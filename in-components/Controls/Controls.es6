import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {controls$} from 'in-components/Controls/stores/controlsStore';
import Menu from 'in-components/Controls/components/Menu';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/Controls.less';


const block = 'in-controls';

export default connectTo({
  timelineHeight: timelineHeight$,
  controls: controls$
},
function Controls({controls, timelineHeight}) {
  if (!controls) {
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
