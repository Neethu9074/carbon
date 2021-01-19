/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import {
  menuContent$,
  toggleContent,
  closeCurrentMenu
} from 'in-map/components/MapOverlayControls/stores/menuContentStore';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import { view$, types } from 'in-stores/view/view';

import 'in-map/components/MapOverlayControls/components/Control.less';

const block = 'in-control';

export default connectTo(
  {
    menuContent: menuContent$
  },
  class extends React.Component {
    static displayName = 'Control';

    static propTypes = {
      type: rpt.string.isRequired,
      createMenuContent: rpt.func,
      tooltipText: rpt.string,
      className: rpt.string,
      menuContent: rpt.any,
      isActive: rpt.bool,
      onClick: rpt.func,
      id: rpt.string
    };

    componentWillUnmount() {
      // menus will be closed if this component will be unmounted. There is an edge case which is handled here:
      // if the user switches from physical to container view AND the grouping menu is open, leave it open!
      view$.once(currentView => {
        const menuContent = this.props.menuContent;
        if (!menuContent) {
          return;
        }

        if (menuContent.id === 'grouping' && (currentView === types.physical || currentView === types.container)) {
          return;
        } else {
          const id = this.props.id ? this.props.id : this.props.type;
          if (menuContent.id === id) {
            closeCurrentMenu();
          }
        }
      });
    }

    render() {
      const onClick = this.props.onClick;
      const type = this.props.type;
      const createMenuContent = this.props.createMenuContent;
      const id = this.props.id;
      const tooltipText = this.props.tooltipText;
      const className = this.props.className;
      const menuContent = this.props.menuContent;
      const isActive = this.props.isActive || (menuContent && menuContent.id === (id ? id : type));

      let controlClassName = block;
      if (isActive) {
        controlClassName += ` ${block}--active`;
      }
      if (className) {
        controlClassName += ` ${className}`;
      }

      return (
        <Tooltip content={tooltipText} align="topRight">
          <div
            className={controlClassName}
            onClick={() => {
              if (onClick) {
                onClick();
              }
              if (createMenuContent) {
                toggleContent(getMenuContent(id ? id : type, createMenuContent));
              }
            }}
          >
            <SvgIcon className={`${block}__icon`} type={type} color="#fff" />
          </div>
        </Tooltip>
      );
    }
  }
);

function getMenuContent(type, createMenuContent) {
  return {
    id: type,
    content: createMenuContent()
  };
}
