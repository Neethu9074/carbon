import React from 'react';

import { isOpen$, toggleMenu } from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo(
  {
    isOpen: isOpen$
  },
  function AccountMenu({ isOpen }) {
    return (
      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}__expanded`]: isOpen
        })}
        onClick={toggleMenu}
      >
        <Menu />
        <SvgIcon className={`${block}__avatar`} type="lib_menu_account" width={32} height={32} />
        <SvgIcon className={`${block}__icon`} type="lib_arrow_drop_down" width={24} height={34} />
      </div>
    );
  }
);
