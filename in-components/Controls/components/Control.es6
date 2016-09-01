import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import 'in-components/Controls/components/Control.less';


const block = 'in-control';

export default function Control({iconSize, onClick, type, isActive}) {
  return (
    <div className={block}
         onClick={onClick}>
      <SvgIcon type={type}
               width={iconSize}
               height={iconSize}
               color={isActive ? '#9fffff' : '#7b8e96'} />
    </div>
  );
}
