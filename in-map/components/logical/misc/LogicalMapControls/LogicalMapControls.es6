import React from 'react';

import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import {toggleParticles} from 'in-map/stores/logical/particlesStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/logical/misc/LogicalMapControls/LogicalMapControls.less';


const block = 'in-logical-map-controls';

export default connectTo({
  content: content$,
  timelineHeight: timelineHeight$
},
function LogicalMapControls({content, timelineHeight}) {
  let classes = block;
  if (content) {
    classes += ' ' + classes + '--right-sidebar-open';
  }

  return (
    <div className={classes}
         style={{ bottom: toPx(timelineHeight) }}>

      <Button onClick={toggleParticles}>
        Particles
      </Button>
    </div>
  );
});
