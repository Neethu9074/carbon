import React from 'react';

import {toggleMenu} from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import Gravatar from 'in-components/Gravatar';
import Button from 'in-components/Button';
import {user} from 'in-stores/user';

import './AccountMenu.less';

const block = 'in-account';

export default function AccountMenu() {
  return (
    <div className={block}>
      <Menu />

      <Button className={`${block}__avatar-wrapper`}
              kind='secondary'
              size='sm'
              onClick={toggleMenu}>

        <Gravatar className={`${block}__avatar`}
                  email={user.email} />
      </Button>
    </div>
  );
}
