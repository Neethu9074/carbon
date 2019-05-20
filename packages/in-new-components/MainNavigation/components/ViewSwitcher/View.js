import React from 'react';

import SubView from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
import { evaluateClassNames } from 'in-services/util/classnames';
import { alwaysNull } from 'in-services/fixedStreams';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './View.mless';

export default connectTo(
  props => {
    if (props.isActive) {
      return {};
    }
    return {
      isActive: props.isActive$
    };
  },

  function View({
    href$,
    color,
    icon,
    label,
    children,
    isActive,
    sidebarIsExpanded,
    expandedSubMenu,
    onClick,
    onMouseEnter,
    onMouseLeave,
    setExpandedSubMenu
  }) {
    const isExpanded = expandedSubMenu === label;
    href$ = href$ || alwaysNull;

    return (
      <li
        className={evaluateClassNames({
          [locals.view]: true,
          [locals.viewWithChildren]: children,
          [locals.collapsed]: !isExpanded && !isActive && !sidebarIsExpanded,
          [locals.collapsedActive]: isActive && !sidebarIsExpanded && !children,
          [locals.collapsedActiveWithChildren]: isActive && !sidebarIsExpanded && children,
          [locals.expanded]: isExpanded,
          [locals.activeSidebarExpanded]: isActive && sidebarIsExpanded
        })}
      >
        <div
          className={locals.wrapper}
          onClick={e => {
            if (children) {
              if (sidebarIsExpanded || !isExpanded) {
                setExpandedSubMenu(isExpanded ? null : label);
              }
            } else {
              e.stopPropagation();
            }

            if (onClick) {
              onClick(e, label);
            }
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => onMouseLeave()} // don't parse the event
        >
          <Link className={locals.link} href$={href$}>
            <SvgIcon className={locals.icon} style={{ fill: color }} type={icon} width={32} height={32} />
            {sidebarIsExpanded && <span className={locals.label}>{label}</span>}
          </Link>

          {children &&
            sidebarIsExpanded && (
              <SvgIcon
                className={locals.expandIcon}
                type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                width={20}
                height={20}
              />
            )}
        </div>

        {isExpanded && sidebarIsExpanded && children && <SubView>{children}</SubView>}
      </li>
    );
  }
);
