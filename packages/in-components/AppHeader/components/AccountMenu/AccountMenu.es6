import React from 'react';

import { isOpen$, toggleMenu } from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import { evaluateClassNames } from 'in-services/util/classnames';
import Gravatar from 'in-components/Gravatar';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import { user } from 'in-stores/user';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo(
  {
    isOpen: isOpen$
  },
  function AccountMenu({ isOpen }) {
    return (
      <div className={block} onClick={toggleMenu}>
        <Menu />
        <div
          className={evaluateClassNames({
            [`${block}__avatar-wrapper`]: true,
            [`${block}__avatar-wrapper--active`]: isOpen
          })}
          kind="secondary"
          size="sm"
        >
          <Gravatar className={`${block}__avatar`} email={user.email} />
        </div>
        <SvgIcon
          className={`${block}__icon`}
          type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
          width={24}
          height={34}
        />
      </div>
    );
  }
);
