import React from 'react';

import {menuContent$, toggleContent} from 'in-components/Controls/stores/menuContentStore';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/Control.less';


const block = 'in-control';

export default connectTo({
  menuContent: menuContent$
},
function Control({iconSize, onClick, type, isActive, menuContent, createMenuContent}) {
  isActive = isActive || (menuContent && menuContent.id === type);
  return (
    <div className={block}
         onClick={() => {
           if (onClick) {
             onClick();
           }
           if (createMenuContent) {
             toggleContent(getMenuContent(type, createMenuContent));
           }
         }}>
      <SvgIcon type={type}
               width={iconSize}
               height={iconSize}
               color={isActive ? '#9fffff' : '#7b8e96'} />
    </div>
  );
});

function getMenuContent(type, createMenuContent) {
  return {
    id: type,
    content: createMenuContent()
  };
}
