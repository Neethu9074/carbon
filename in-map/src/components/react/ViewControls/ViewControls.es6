import React from 'react';

import AutoLayout from 'in-map/src/components/react/ViewControls/components/AutoLayout';
import Particles from 'in-map/src/components/react/ViewControls/components/Particles';
import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import Zoom from 'in-map/src/components/react/ViewControls/components/Zoom';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/ViewControls/ViewControls.less';


const block = 'in-map-controls';

export default connectTo({
  timelineHeight: timelineHeight$,
  content: content$
},
function LogicalMapControls({content, timelineHeight}) {
  let classes = block;
  if (content) {
    classes += ' ' + classes + '--right-sidebar-open';
  }

  return (
    <div className={classes}
         style={{ bottom: toPx(timelineHeight) }}>
      <AutoLayout />
      <Particles />
      <Zoom />
    </div>
  );
});
