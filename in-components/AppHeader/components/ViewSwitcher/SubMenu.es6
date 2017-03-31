import React from 'react';

import connectTo from 'in-hoc/connectTo';

import './SubMenu.less';

const block = 'in-view-switcher-menu';

export function SubMenu({ children }) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
}

export const SubMenuItem = connectTo(
  props => {
    return {
      href: props.href$
    };
  },
  function SubMenuItem({ isActive, label, href }) {
    let classes = `${block}__link`;
    if (isActive) {
      classes += ` ${classes}--active`;
    }

    return (
      <li>
        <a className={classes} onClick={e => e.stopPropagation()} href={href}>
          {label}
        </a>
      </li>
    );
  }
);
