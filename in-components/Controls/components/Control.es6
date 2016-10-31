import React from 'react';

import {menuContent$, toggleContent} from 'in-components/Controls/stores/menuContentStore';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/Control.less';


const block = 'in-control';

export default connectTo({
  menuContent: menuContent$
},
function Control({onClick, type, id, isActive, menuContent, createMenuContent, tooltipText, className}) {
  isActive = isActive || (menuContent && menuContent.id === (id ? id : type));

  let controlClassName = block;
  if (isActive) {
    controlClassName += ` ${block}--active`;
  }
  if (className) {
    controlClassName += ` ${className}`;
  }

  return (
    <Tooltip content={tooltipText}
             align='topRight'>

      <div className={controlClassName}
           onClick={() => {
             if (onClick) {
               onClick();
             }
             if (createMenuContent) {
               toggleContent(getMenuContent(id ? id : type, createMenuContent));
             }
           }}>
        <SvgIcon type={type}
                 width={14}
                 height={14}
                 color='#fff' />
      </div>
    </Tooltip>
  );
});

function getMenuContent(type, createMenuContent) {
  return {
    id: type,
    content: createMenuContent()
  };
}
