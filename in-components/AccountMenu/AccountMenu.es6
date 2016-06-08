import React from 'react';

import {toggleMenu} from 'in-components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AccountMenu/components/Menu';
import Icon from 'in-components/Icon';

import 'in-components/AccountMenu/AccountMenu.less';


const block = 'in-account';

export default function AccountMenu() {
  return (
    <div className={block}>
      <Menu />

      <Icon type='profile'
            className={block + '__icon'}
            onClick={toggleMenu} />
    </div>
  );
}
