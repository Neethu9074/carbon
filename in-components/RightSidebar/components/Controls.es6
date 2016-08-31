import React from 'react';

import {activeControl$, toggleControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {isOpen$} from 'in-components/notificationCenter/Center/stores/notificationCenterVisibilityStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import {isTableVisible$} from 'in-components/tableView/stores/visibility';
import {view, types as views} from 'in-stores/view';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import 'in-components/RightSidebar/components/Controls.less';


const block = 'in-filterbar-controls';

export default connectTo({
    false: isOpen$,
    isTableViewOpen: isTableVisible$,
    activeControl: activeControl$,
    currentView: view,
    isOpen: content$
  },
  function FilterBarControls({isOpen, activeControl, isNotificationCenterOpen, isTableViewOpen, currentView}) {
    return (
      <div className={block + (isOpen ? ' ' + block + '__open' : '')}>
        {currentView === views.physical
          ? <ControlItem type={CONTROL_TYPES.METRICS}
                         activeControl={activeControl}
                         tooltipText='Show Metrics.' />
          : null
        }

        {currentView === views.physical
          ? <ControlItem type={CONTROL_TYPES.TAGS}
                         activeControl={activeControl}
                         tooltipText='Show Tags.'
                         addTopBorder={true} />
          : null
        }

        {__DEV__ ?
          <ControlItem type={CONTROL_TYPES.MAP_STATISTICS}
                       activeControl={activeControl}
                       tooltipText='DEV ONLY FEATURE. INGORE IT'
                       addTopBorder={true} />
          : null
        }

        {__DEV__ ?
          <ControlItem type={CONTROL_TYPES.EVENT_CENTER}
                       activeControl={activeControl}
                       tooltipText='DEV ONLY FEATURE. INGORE IT'
                       isActive={isNotificationCenterOpen}
                       addTopBorder={true} />
          : null
        }

        {__DEV__ ?
          <ControlItem type={CONTROL_TYPES.ICONS}
                       activeControl={activeControl}
                       tooltipText='DEV ONLY FEATURE. INGORE IT'
                       addTopBorder={true} />
          : null
        }

        {__DEV__ ?
          <ControlItem type={CONTROL_TYPES.LAYOUT}
                       activeControl={activeControl}
                       tooltipText='DEV ONLY FEATURE. INGORE IT'
                       addTopBorder={true} />
          : null
        }

        <br />

        {currentView === views.physical
          ? <ControlItem type={CONTROL_TYPES.TABLE}
                         activeControl={activeControl}
                         isActive={isTableViewOpen}
                         tooltipText='Switch between 3D view and tabular form.' />
          : null
        }
      </div>
    );
  }
);

function ControlItem({activeControl, type, tooltipText, addTopBorder, isActive}) {
  let classes = block + '__control';
  addTopBorder ? classes += ' ' + block + '__control--with-border' : null;
  (isActive || activeControl === type) ? classes += ' ' + block + '__control__active' : null;

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
