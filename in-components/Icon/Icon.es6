import React from 'react';

import {getClassName} from 'in-services/react';

import './Icon.less';

const rpt = React.PropTypes;

const Icon = React.createClass({
  propTypes: {
    type: rpt.string.isRequired,
    onMouseLeave: rpt.func,
    onMouseEnter: rpt.func,
    className: rpt.string,
    onClick: rpt.func,
    style: rpt.object
  },

  render() {
    let className = getClassName(this, 'icon icon-' + this.props.type);

    if (this.props.onClick) {
      className += ' icon--clickable';
      return (
        <button type='button'
                className={className}
                style={this.props.style}
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave} />
      );
    }

      return (
      <i className={className}
         style={this.props.style}
         onMouseEnter={this.props.onMouseEnter}
         onMouseLeave={this.props.onMouseLeave} />
    );
  }
});

export default Icon;
