import React from 'react';

import { SubMenu } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import { alwaysNull } from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './View.less';

const block = 'in-view-switcher-view';

export default connectTo(
  props => {
    return {
      isActive: props.isActive$
    };
  },
  function View({ href$, icon, label, iconSize, children, isActive }) {
    href$ = href$ || alwaysNull;

    let classes = block;
    if (isActive) {
      classes += ` ${classes}__active`;
    }

    return (
      <li className={classes}>
        <Link className={`${block}__link`} href$={href$}>
          <SvgIcon className={`${block}__icon`} type={icon} width={iconSize || 32} height={iconSize || 32} />
          <span className={`${block}__label`}>{label}</span>
        </Link>

        {children ? (
          <div className={`${block}__menu`}>
            <SubMenu>{children}</SubMenu>
          </div>
        ) : null}
      </li>
    );
  }
);
