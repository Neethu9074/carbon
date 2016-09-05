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
function Control({iconSize, onClick, type, id, isActive, menuContent, createMenuContent, tooltipText}) {
  isActive = isActive || (menuContent && menuContent.id === (id ? id : type));
  return (
    <Tooltip content={tooltipText}
             align='topRight'>

      <div className={block}
           onClick={() => {
             if (onClick) {
               onClick();
             }
             if (createMenuContent) {
               toggleContent(getMenuContent(id ? id : type, createMenuContent));
             }
           }}>
        <SvgIcon type={type}
                 width={iconSize}
                 height={iconSize}
                 color={isActive ? '#9fffff' : '#7b8e96'} />
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
