import React from 'react';

import { isOpen$, toggleMenu } from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import { evaluateClassNames } from 'in-services/util/classnames';
import { uiNeedsRefresh$ } from 'in-services/uiClientVersion';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './AccountMenu.mless';

export default connectTo(
  {
    isOpen: isOpen$,
    uiNeedsRefresh: uiNeedsRefresh$
  },
  function AccountMenu({ isOpen, uiNeedsRefresh }) {
    return (
      <div>
        <Menu />
        <div
          className={evaluateClassNames({
            [locals.block]: true,
            [`${locals.block}__expanded`]: isOpen
          })}
          onClick={toggleMenu}
        >
          {uiNeedsRefresh && <div className={locals.notificationDot} />}
          <SvgIcon className={locals.avatar} type="lib_menu_account" width={32} height={32} />
          <SvgIcon className={locals.icon} type="lib_arrow_drop_down" width={24} height={34} />
        </div>
      </div>
    );
  }
);
