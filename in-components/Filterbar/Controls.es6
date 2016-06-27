import React from 'react';

import {toggleTableViewVisibility, isTableVisible$} from 'in-components/tableView/stores/visibility';
import {setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';
import {isOpen$, close} from 'in-components/Filterbar/stores/filterbarVisibilityStore';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Controls.less';


const block = 'in-filterbar-controls';

export default connectTo({
    isTableVisible: isTableVisible$,
    isOpen: isOpen$
  },
  function FilterBarControls({isOpen, isTableVisible}) {
    return (
      <ul className={block + (isOpen ? ' ' + block + '__open' : '')}>
        {controlItem('metrics', 'Show Metrics.', () => setActiveControl('metrics'))}
        {controlItem('tags', 'Show Tags.', () => setActiveControl('tags'))}
        {__DEV__ ? controlItem('system', 'Show map statistics.') : null}

        <br/>

        {controlItem('menue', 'Switch between 3D view and tabular form.', () => {
          toggleTableViewVisibility();
          if (!isTableVisible) {
            close();
          }
        })}
      </ul>
    );
  }
);

function controlItem(type, tooltipText, onClick) {
  return (
    <Tooltip content={tooltipText}
             align='leftMiddle'>
      <li className={block + '__control'}
          onClick={onClick}>
        <Icon type={type}
              className={block + '__icon'}/>
      </li>
    </Tooltip>
  );
}
