/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import invariant from 'invariant';
import rpt from 'prop-types';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import locals from './Collapsible.mless';

interface CollapsibleProps {
  children: React.ReactNode[];
  initiallyOpen?: boolean;
  onOpen?: () => void;
}

interface HeaderProps {
  isOpen: boolean;
  toggle: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface ContentProps {
  isOpen: boolean;
  children: React.ReactNode;
}

class Collapsible extends React.PureComponent<CollapsibleProps> {
  static propTypes = {
    children: rpt.array.isRequired,
    initiallyOpen: rpt.bool,
    onOpen: rpt.func
  };

  state: { open: boolean } = {
    open: this.props.initiallyOpen ?? false
  };
  static Content: any; // quirk, to support <Collapsible.Content>
  static Header: any; // quirk, to support <Collapsible.Header>

  render() {
    const children = this.props.children;
    invariant(children.length === 2, 'A collapsible must have exactly two child elements: Header and Content');

    const isOpen = this.state.open;
    const header = (children[0] as ReactElement)?.props as HeaderProps;
    const contentProps = (children[1] as ReactElement)?.props as ContentProps;
    return (
      <div className={isOpen ? locals.collapsibleOpen : locals.collapsibleClosed}>
        <Header style={header.style} toggle={this.toggle} isOpen={isOpen}>
          {header.children}
        </Header>

        <Content isOpen={isOpen}>{contentProps.children}</Content>
      </div>
    );
  }

  toggle = () => {
    if (this.props.onOpen && !this.state.open) {
      this.props.onOpen();
    }
    this.setState((prevState: { open: boolean }) => ({ open: !prevState.open }));
  };
}

export default Collapsible;

function Header({ isOpen, toggle, style, children }: HeaderProps) {
  return (
    <div onClick={toggle} className={locals.header} style={style}>
      <span>{children}</span>

      <SvgIcon
        type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        className={locals.toggle}
        color={themes.default.ids.color.option.neutral['700']}
      />
    </div>
  );
}

Collapsible.Header = Header;

function Content({ isOpen, children }: ContentProps) {
  if (!isOpen) {
    return null;
  }

  return <div className={locals.content}>{children}</div>;
}

Collapsible.Content = Content;
