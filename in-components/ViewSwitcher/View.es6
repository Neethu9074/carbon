import React from 'react';

import {toggleExpandedView} from 'in-components/ViewSwitcher/stores/expandedViewStore';
import {SubMenu} from 'in-components/ViewSwitcher/SubMenu';
import {alwaysNull} from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './View.less';


const block = 'in-view-switcher-view';

export default connectTo(props => {
  return {
    href: props.href$ ? props.href$ : alwaysNull
  };
},
function View({label, href, icon, color, children, isActive, isExpanded}) {
  let classes = block;
  if (isActive || isExpanded) {
    classes += ` ${classes}__active`;
  }

  return (
    <li className={classes}>
      <a className={`${block}__link`}
         onClick={e => {
           e.stopPropagation();
           toggleExpandedView(label);
         }}
         href={href}>

        <SvgIcon className={`${block}__icon`}
                 type={icon}
                 width={16}
                 height={16}
                 color={color || '#22d8d8'} />
        {label}
      </a>
      {(children && isExpanded)
        ? <SubMenu>
            {children}
          </SubMenu>
        : null
      }
    </li>
  );
});
