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

  let iconClass = `${block}__expand-icon`;
  if (isExpanded) {
    iconClass += ` ${iconClass}--expanded`;
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
                 width={20}
                 height={20}
                 color={color || '#22d8d8'} />
        {label}
        {children
          ? <SvgIcon className={iconClass}
                     type='triangle_down'
                     width={6}
                     height={6}
                     color={'#6B8088'} />
          : null
        }
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
