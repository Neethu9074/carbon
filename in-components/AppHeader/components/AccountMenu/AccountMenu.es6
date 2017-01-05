import React from 'react';

import {toggleMenu} from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import Icon from 'in-components/Icon';

import './AccountMenu.less';

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
