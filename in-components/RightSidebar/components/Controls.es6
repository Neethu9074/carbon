import React from 'react';

import {activeControl$, toggleControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import 'in-components/RightSidebar/components/Controls.less';


const block = 'in-filterbar-controls';

export default connectTo({
    activeControl: activeControl$
  },
  function FilterBarControls({activeControl}) {
    return (
      <div className={block}>
        <ControlItem type={CONTROL_TYPES.NOTIFICATIONS}
                     activeControl={activeControl}
                     tooltipText='Show Notifications.' />

        <ControlItem type={CONTROL_TYPES.METRICS}
                     activeControl={activeControl}
                     tooltipText='Show Metrics.'
                     addTopBorder={true} />

        <ControlItem type={CONTROL_TYPES.TAGS}
                     activeControl={activeControl}
                     tooltipText='Show Tags.'
                     addTopBorder={true} />

        <ControlItem type={CONTROL_TYPES.MAP_STATISTICS}
                     activeControl={activeControl}
                     tooltipText='Show Map Statistics.'
                     addTopBorder={true} />

        <br />

        <ControlItem type={CONTROL_TYPES.TABLE}
                     activeControl={activeControl}
                     tooltipText='Switch between 3D view and tabular form.' />
      </div>
    );
  }
);

function ControlItem({activeControl, type, tooltipText, addTopBorder}) {
  let classes = block + '__control';
  addTopBorder ? classes += ' ' + block + '__control--with-border' : null;
  activeControl === type ? classes += ' ' + block + '__control__active' : null;

  return (
    <Tooltip content={tooltipText}
             align='leftMiddle'>
      <div className={classes}
          onClick={() => toggleControl(type)}>
        <Icon type={type}
              className={block + '__icon'}/>
      </div>
    </Tooltip>
  );
}
