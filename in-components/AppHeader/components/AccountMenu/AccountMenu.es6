import React from 'react';

import {toggleMenu, isOpen$} from 'in-components/AppHeader/components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AppHeader/components/AccountMenu/components/Menu';
import {evaluateClassNames} from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo({
  isOpen: isOpen$
}, function AccountMenu({isOpen}) {
  return (
    <div className={block}>
      <Menu />

      <Button className={evaluateClassNames({
                [`${block}__icon-wrapper`]: true,
                [`${block}__icon-wrapper--active`]: isOpen
              })}
              kind='secondary'
              size='sm'
              onClick={toggleMenu}>
        <SvgIcon type='account'
                 height={13}
                 className={`${block}__icon`} />
      </Button>
    </div>
  );
});
