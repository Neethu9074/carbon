import React from 'react';

import {menuContent$, toggleContent, closeCurrentMenu} from 'in-components/MapOverlayControls/stores/menuContentStore';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/Control.less';


const block = 'in-control';
const rpt = React.PropTypes;

export default connectTo({
  menuContent: menuContent$
},
React.createClass({

  displayName: 'Control',

  propTypes: {
    type: rpt.string.isRequired,
    createMenuContent: rpt.func,
    tooltipText: rpt.string,
    className: rpt.string,
    menuContent: rpt.any,
    isActive: rpt.bool,
    onClick: rpt.func,
    id: rpt.string
  },

  componentWillUnmount() {
    const menuContent = this.props.menuContent;
    const id = this.props.id ? this.props.id : this.props.type;
    if (menuContent && menuContent.id === id) {
      closeCurrentMenu();
    }
  },

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
      <Tooltip content={tooltipText}
               align='topRight'>
        <div className={controlClassName}
             onClick={() => {
               if (onClick) {
                 onClick();
               }
               if (createMenuContent) {
                 toggleContent(getMenuContent(id ? id : type, createMenuContent));
               }
             }}>
          <SvgIcon className={`${block}__icon`}
                   type={type}
                   width={16}
                   height={16}
                   color='#fff' />
        </div>
      </Tooltip>
    );
  }
}));

function getMenuContent(type, createMenuContent) {
  return {
    id: type,
    content: createMenuContent()
  };
}
