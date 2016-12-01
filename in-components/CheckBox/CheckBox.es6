import React from 'react';

import './CheckBox.less';


const block = 'in-checkbox';

export default function CheckBox(defaultChecked = false, onClick) {
  return (
    <input type='checkbox'
           className={block}
           defaultChecked={defaultChecked}
           onClick={onClick} />
  );
}
