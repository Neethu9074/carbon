import React from 'react';

import Particles from 'in-map/src/components/react/ProcessViewControls/components/Particles';
import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {view, types as views} from 'in-stores/view';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/ProcessViewControls/ProcessViewControls.less';


const block = 'in-logical-map-controls';

export default connectTo({
  timelineHeight: timelineHeight$,
  currentView: view,
  content: content$
},
function LogicalMapControls({content, timelineHeight, currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  let classes = block;
  if (content) {
    classes += ' ' + classes + '--right-sidebar-open';
  }

  return (
    <div className={classes}
         style={{ bottom: toPx(timelineHeight) }}>
      <Particles />
    </div>
  );
});
