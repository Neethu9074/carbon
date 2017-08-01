import React from 'react';

import { SubMenu } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import { alwaysNull } from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import './View.less';

const block = 'in-view-switcher-view';

export default function View({ label, href$, icon, iconSize, color, children, isActive }) {
  href$ = href$ || alwaysNull;

  let classes = block;
  if (isActive) {
    classes += ` ${classes}__active`;
  }

  return (
    <li className={classes}>
      <Link className={`${block}__link`} onClick={e => e.stopPropagation()} href$={href$}>

        <SvgIcon
          className={`${block}__icon`}
          type={icon}
          width={iconSize || 20}
          height={iconSize || 20}
          color={color || '#22d8d8'}
        />
        {label}
        {children
          ? <SvgIcon className={`${block}__expand-icon`} type="triangle_down" width={6} height={6} color={'#6B8088'} />
          : null}
      </Link>

      {children
        ? <div className={`${block}__menu`}>
            <SubMenu>
              {children}
            </SubMenu>
          </div>
        : null}
    </li>
  );
}
