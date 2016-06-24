import React from 'react';

import Icon from 'in-components/Icon';

import './IconOnlyCloseButton.less';


const block = 'in-icon-only-button';

export default function IconOnlyCloseButton({onClick}) {
  return (
    <Icon type='x'
          className={block}
          onClick={onClick}/>
  );
}
