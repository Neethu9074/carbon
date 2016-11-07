import React from 'react';

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
function View({label, href, icon, iconSize, color, children, isActive}) {
  let classes = block;
  if (isActive) {
    classes += ` ${classes}__active`;
  }

  return (
    <li className={classes}>
      <a className={`${block}__link`}
         onClick={e => e.stopPropagation()}
         href={href}>

        <SvgIcon className={`${block}__icon`}
                 type={icon}
                 width={iconSize || 20}
                 height={iconSize || 20}
                 color={color || '#22d8d8'} />
        {label}
        {children
          ? <SvgIcon className={`${block}__expand-icon`}
                     type='triangle_down'
                     width={6}
                     height={6}
                     color={'#6B8088'} />
          : null
        }
      </a>

      {(children)
        ? <div className={`${block}__menu`}>
            <SubMenu>
              {children}
            </SubMenu>
          </div>
        : null
      }
    </li>
  );
});
