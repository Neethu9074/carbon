/* eslint-disable react/no-multi-comp, react/prop-types */
import invariant from 'invariant';
import React from 'react/addons';

import {getClassName} from 'in-services/react';

import Icon from '../Icon';

import './Collapsible.less';

const rpt = React.PropTypes;
const block = 'in-collapsible';

const Collapsible = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.array.isRequired,
    initiallyOpen: rpt.bool,
    className: rpt.string
  },

  getInitialState() {
    return {
      open: this.props.initiallyOpen
    };
  },

  render() {
    invariant(
      this.props.children.length === 2,
      'A collapsible must have exactly two child elements: Header and Content'
    );

    const isOpen = this.state.open;
    const header = this.props.children[0].props;
    const contentProps = this.props.children[1].props;
    return (
      <div className={getClassName(this, block)}>
        <Header className={header.className}
                style={header.style}
                toggle={this.toggle}
                isOpen={isOpen}>
          {header.children}
        </Header>

        <Content isOpen={isOpen}>
          {contentProps.children}
        </Content>
      </div>
    );
  },

  toggle() {
    this.setState({ open: !this.state.open });
  }
});

export default Collapsible;

const Header = React.createClass({
  propTypes: {
    children: rpt.any.isRequired,
    style: rpt.object,
    toggle: rpt.func,
    isOpen: rpt.bool
  },

  render() {
    const isOpen = this.props.isOpen;
    let className = getClassName(this, block, '__header');
    if (!isOpen) {
      className += ' ' + getClassName(this, block, '__header__closed');
    }

    return (
      <div onClick={this.props.toggle}
           className={className}
           style={this.props.style}>

        <span>{this.props.children}</span>

        <Icon type={isOpen ? 'close' : 'open'}
              className={block + '__toggle'} />
      </div>
    );
  }
});
Collapsible.Header = Header;

const Content = React.createClass({
  propTypes: {
    children: rpt.any.isRequired,
    isOpen: rpt.bool
  },

  render() {
    if (!this.props.isOpen) {
      return null;
    }
    return (
      <div className={block + '__content'}>
        {this.props.children}
      </div>
    );
  }
});
Collapsible.Content = Content;
