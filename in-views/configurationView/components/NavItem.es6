import React from 'react';

import NavItems from 'in-views/configurationView/components/NavItems';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    href: props.href$,
    isActive: props.isActive$
  };
}, React.createClass({
  displayName: 'NavItem',

  propTypes: {
    href$: React.PropTypes.any,
    href: React.PropTypes.string,
    isActive$: React.PropTypes.any,
    isActive: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.any
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  render() {
    return (
      <li>
        <a href={this.props.href}
           onClick={this.onClick}>
          {this.props.title}
        </a>

        {this.state.isExpanded && React.Children.count(this.props.children) > 0 ?
          <NavItems>
            {this.props.children}
          </NavItems>
        : null}
      </li>
    );
  },

  onClick(e) {
    if (!this.props.href) {
      e.preventDefault();
    }
    this.toggle();
  },

  toggle() {
    this.setState({isExpanded: !this.state.isExpanded});
  }
}));
