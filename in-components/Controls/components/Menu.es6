import React from 'react';

import {menuContent$} from 'in-components/Controls/stores/menuContentStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/Menu.less';


const block = 'in-controls-menu';

export default connectTo({
  timelineHeight: timelineHeight$,
  menuContent: menuContent$
},
function ControlsMenu({timelineHeight, menuContent}) {
  if (!menuContent) {
    return null;
  }

  return (
    <div className={block}
         style={{
           bottom: toPx(timelineHeight + 9)
         }}>
      {menuContent.content}
    </div>
  );
});
