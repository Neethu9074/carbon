import React from 'react';

import {toggleExpandedView} from 'in-components/ViewSwitcher/stores/expandedViewStore';
import connectTo from 'in-hoc/connectTo';

import './SubMenu.less';


const block = 'in-view-switcher-menu';

export function SubMenu({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}

export const SubMenuItem = connectTo(props => {
  return {
    href: props.href$
  };
},
function SubMenuItem({label, href}) {
  return (
    <a className={`${block}__link`}
       onClick={e => {
         e.stopPropagation();
         toggleExpandedView(null);
       }}
       href={href}>
      {label}
    </a>
  );
});
