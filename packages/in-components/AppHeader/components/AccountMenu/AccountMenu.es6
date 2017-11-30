import React from 'react';

import { isOpen$, toggleMenu } from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import { evaluateClassNames } from 'in-services/util/classnames';
import Gravatar from 'in-components/Gravatar';
import Button from 'in-components/Button';
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
      <div className={block}>
        <Menu />
        <Button
          className={evaluateClassNames({
            [`${block}__avatar-wrapper`]: true,
            [`${block}__avatar-wrapper--active`]: isOpen
          })}
          kind="secondary"
          size="sm"
          onClick={toggleMenu}
        >
          <Gravatar className={`${block}__avatar`} email={user.email} />
        </Button>
      </div>
    );
  }
);
