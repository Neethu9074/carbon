import React from 'react';

import NavItems from 'in-views/configurationView/components/NavItems';
import {evaluateClassNames} from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './NavItem.less';

const block = 'in-config-view-nav-item';

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
    const childCount = React.Children.count(this.props.children);

    return (
      <li className={block}>
        <a href={this.props.href}
           onClick={this.onClick}
           className={evaluateClassNames({
             [`${block}__link`]: true,
             [`${block}__link--active`]: this.props.isActive
           })}>

          {childCount > 0 ?
            <SvgIcon type={this.state.isExpanded ? 'triangle_down' : 'triangle_right'}
                     width={this.state.isExpanded ? 8 : 6}
                     className={`${block}__toggle`}/>
          : null}

          {this.props.title}
        </a>

        {this.state.isExpanded && childCount > 0 ?
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
