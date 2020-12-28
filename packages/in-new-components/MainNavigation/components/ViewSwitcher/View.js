import classNames from 'classnames';
import React from 'react';

import SubView from 'in-new-components/MainNavigation/components/ViewSwitcher/SubView';
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
    icon,
    label,
    children,
    isActive,
    sidebarIsExpanded,
    expandedSubMenu,
    onClick,
    onMouseEnter,
    onMouseLeave,
    renderContent,
    setExpandedSubMenu,
    id
  }) {
    const isExpanded = label && expandedSubMenu === label;
    href$ = href$ || alwaysNull;

    return (
      <li
        className={classNames({
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
          <Link id={id} className={locals.link} href$={href$}>
            {renderContent ? (
              renderContent(sidebarIsExpanded)
            ) : (
              <>
                <SvgIcon className={locals.icon} type={icon} size="l" />
                {sidebarIsExpanded && <span className={locals.label}>{label}</span>}
              </>
            )}
          </Link>

          {children && sidebarIsExpanded && (
            <SvgIcon
              className={locals.expandIcon}
              type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              size="s"
            />
          )}
        </div>

        {isExpanded && sidebarIsExpanded && children && <SubView>{children}</SubView>}
      </li>
    );
  }
);
