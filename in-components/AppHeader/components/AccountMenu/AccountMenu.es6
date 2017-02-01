import React from 'react';

import {toggleMenu} from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import unknown from 'in-components/AppHeader/components/AccountMenu/unknown.png';
import getGravatarUrl from 'in-services/subscription/gravatar';
import {user} from 'in-stores/user';
import {onImageLoad} from 'in-services/image';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo({
  avatarUrl: getGravatarUrl(user.email)
    .flatMap(url => onImageLoad(url))
}, function AccountMenu({avatarUrl}) {
  return (
    <div className={block}>
      <Menu />

      <Button className={`${block}__avatar-wrapper`}
              kind='secondary'
              size='sm'
              onClick={toggleMenu}>

        {avatarUrl ?
          <img src={avatarUrl}
               alt={`Avatar for ${user.email} from gravatar.com.`}
               className={`${block}__avatar`} />
        : null}

        {!avatarUrl ?
          <img src={unknown}
               alt={`Fallback avatar for ${user.email}.`}
               className={`${block}__avatar`} />
        : null}

      </Button>
    </div>
  );
});
