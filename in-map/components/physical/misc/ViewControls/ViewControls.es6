import React from 'react';

import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import Zoom from 'in-map/components/misc/viewControlComponents/Zoom';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/physical/misc/ViewControls/ViewControls.less';


const block = 'in-physical-map-controls';

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
      <Zoom />
    </div>
  );
});
