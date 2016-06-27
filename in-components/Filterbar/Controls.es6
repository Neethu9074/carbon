import React from 'react';

import {toggleTableViewVisibility, isTableVisible$} from 'in-components/tableView/stores/visibility';
import {activeControl$, setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';
import {isOpen$, close} from 'in-components/Filterbar/stores/filterbarVisibilityStore';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Controls.less';


const block = 'in-filterbar-controls';

export default connectTo({
    isTableVisible: isTableVisible$,
    activeControl: activeControl$,
    isOpen: isOpen$
  },
  function FilterBarControls({isOpen, isTableVisible, activeControl}) {
    return (
      <div className={block + (isOpen ? ' ' + block + '__open' : '')}>
        {controlItem(activeControl,
          'metrics',
          'Show Metrics.',
          () => setActiveControl('metrics'))}

        {controlItem(activeControl,
          'tags',
          'Show Tags.',
          () => setActiveControl('tags'), true)}

        {__DEV__ ? controlItem(activeControl,
          'system',
          'Show map statistics',
          () => setActiveControl('system'), true) : null}
        <br/>

        {controlItem(activeControl,
          'menue',
          'Switch between 3D view and tabular form.',
          () => {
            toggleTableViewVisibility();
            if (!isTableVisible) {
              close();
            }
          }
        )}
      </div>
    );
  }
);

function controlItem(activeControl, type, tooltipText, onClick, addTopBorder) {
  let classes = block + '__control';
  addTopBorder ? classes += ' ' + block + '__control--with-border' : null;
  activeControl === type ? classes += ' ' + block + '__control__active' : null;

  return (
    <Tooltip content={tooltipText}
             align='leftMiddle'>
      <div className={classes}
          onClick={onClick}>
        <Icon type={type}
              className={block + '__icon'}/>
      </div>
    </Tooltip>
  );
}
