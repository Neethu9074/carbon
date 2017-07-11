import React from 'react';

import Link from 'in-components/Link';

import './SubMenu.less';

const block = 'in-view-switcher-menu';

export function SubMenu({ children }) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
}

export function SubMenuItem({ isActive, label, href$ }) {
  let classes = `${block}__link`;
  if (isActive) {
    classes += ` ${classes}--active`;
  }

  return (
    <li>
      <Link className={classes} onClick={e => e.stopPropagation()} href$={href$}>
        {label}
      </Link>
    </li>
  );
}
