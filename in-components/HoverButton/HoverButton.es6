import React from 'react/addons';

import {getClassName} from 'in-services/react';

import Icon from '../Icon';

import './HoverButton.less';

const rpt = React.PropTypes;
const block = 'in-hover-button';

const HoverButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onClick: rpt.func.isRequired,
    icon: rpt.string.isRequired,
    className: rpt.string,
    children: rpt.any
  },

  render() {
    return (
      <button className={getClassName(this, block)}
              onClick={this.props.onClick}>
        <Icon type={this.props.icon}
              className={block + '__icon'}/>
        <span className={block + '__label'}>
          {this.props.children}
        </span>
      </button>
    );
  }
});

export default HoverButton;
