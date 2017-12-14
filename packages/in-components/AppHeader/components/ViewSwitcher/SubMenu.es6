import React from 'react';

import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './SubMenu.less';

const block = 'in-view-switcher-menu';

export function SubMenu({ children }) {
  return <ul className={block}>{children}</ul>;
}

export const SubMenuItem = connectTo(
  props => ({
    isActive: props.isActive$
  }),
  function SubMenuItem({ isActive, label, href$ }) {
    let classes = `${block}__link`;
    if (isActive) {
      classes += ` ${classes}--active`;
    }

    return (
      <li>
        <Link className={classes} href$={href$}>
          {label}
        </Link>
      </li>
    );
  }
);
