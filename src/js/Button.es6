'use strict';

import React from 'react';
import invariant from 'invariant';

const Button = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    submit: React.PropTypes.bool,
    onClick: React.PropTypes.func
  },

  render() {
    const className = 'btn btn-primary';

    if (this.props.onClick) {
      return (
        <button className={className}
                onClick={this.props.onClick}>
          {this.props.children}
        </button>
      );
    } else if (this.props.type) {
      return (
        <button className={className}
                type={this.props.type}>
          {this.props.children}
        </button>
      );
    } else {
      return (
        <a className={className}
           href={this.props.href}>
          {this.props.children}
        </a>
      );
    }
  }
});

export default Button;
