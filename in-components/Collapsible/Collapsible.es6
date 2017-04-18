/* eslint-disable react/no-multi-comp, react/prop-types */
import invariant from 'invariant';
import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/react';
import SvgIcon from 'in-components/SvgIcon';

import './Collapsible.less';

const block = 'in-collapsible';

class Collapsible extends React.PureComponent {
  static propTypes = {
    children: rpt.array.isRequired,
    initiallyOpen: rpt.bool,
    className: rpt.string
  };

  state = {
    open: this.props.initiallyOpen
  };

  render() {
    const children = this.props.children;
    invariant(children.length === 2, 'A collapsible must have exactly two child elements: Header and Content');

    const isOpen = this.state.open;
    const header = children[0].props;
    const contentProps = children[1].props;
    return (
      <div className={getClassName(this, block)}>
        <Header className={header.className} style={header.style} toggle={this.toggle} isOpen={isOpen}>
          {header.children}
        </Header>

        <Content isOpen={isOpen} className={contentProps.className}>
          {contentProps.children}
        </Content>
      </div>
    );
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  };
}

export default Collapsible;

class Header extends React.Component {
  static propTypes = {
    children: rpt.any.isRequired,
    className: rpt.string,
    style: rpt.object,
    toggle: rpt.func,
    isOpen: rpt.bool
  };

  render() {
    const isOpen = this.props.isOpen;
    let className = getClassName(this, block, '__header');
    if (!isOpen) {
      className += ' ' + getClassName(this, block, '__header__closed');
    }

    return (
      <div onClick={this.props.toggle} className={className} style={this.props.style}>

        <span>{this.props.children}</span>

        <SvgIcon
          type={isOpen ? 'triangle_down' : 'triangle_right'}
          className={block + '__toggle'}
          color="#6B8088"
          height={6}
          width={6}
        />
      </div>
    );
  }
}

Collapsible.Header = Header;

class Content extends React.Component {
  static propTypes = {
    children: rpt.any.isRequired,
    isOpen: rpt.bool,
    className: rpt.string
  };

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    let classes = `${block}__content`;

    if (this.props.className) {
      classes = `${classes} ${this.props.className}`;
    }

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

Collapsible.Content = Content;
