import React from 'react';

import {setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';
import {isOpen$} from 'in-components/Filterbar/stores/filterbarVisibilityStore';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Controls.less';


const block = 'in-filterbar-controls';

export default connectTo({
    isOpen: isOpen$
  },
  function FilterBarControls({isOpen}) {
    return (
      <ul className={block + (isOpen ? ' ' + block + '__open' : '')}>
        {controlItem('metrics')}
        {controlItem('tags')}
        {__DEV__ ? controlItem('system') : null}
      </ul>
    );
  }
);

function controlItem(type) {
  return (
    <Tooltip content={'Show ' + type}
             align={{
               horizontal: 'left',
               vertical: 'middle'
            }}>
      <li className={block + '__control'}
          onClick={() => setActiveControl(type)}>
        <Icon type={type}
              className={block + '__icon'}/>
      </li>
    </Tooltip>
  );
}
