/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-multi-comp, react/prop-types */
import invariant from 'invariant';
import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import theme from 'in-themes';

import locals from './Collapsible.mless';

class Collapsible extends React.PureComponent {
  static propTypes = {
    children: rpt.array.isRequired,
    initiallyOpen: rpt.bool,
    onOpen: rpt.func
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
      <div className={isOpen ? locals.collapsibleOpen : locals.collapsibleClosed}>
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
    if (this.props.onOpen && !this.state.open) {
      this.props.onOpen();
    }
    this.setState({ open: !this.state.open });
  };
}

export default Collapsible;

function Header({ isOpen, toggle, style, children }) {
  return (
    <div onClick={toggle} className={locals.header} style={style}>
      <span>{children}</span>

      <SvgIcon
        type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        className={locals.toggle}
        color={theme.lib.colors.N700Medium}
      />
    </div>
  );
}

Collapsible.Header = Header;

function Content({ isOpen, children }) {
  if (!isOpen) {
    return null;
  }

  return <div className={locals.content}>{children}</div>;
}

Collapsible.Content = Content;
