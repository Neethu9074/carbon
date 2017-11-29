/* eslint-disable react/no-multi-comp, react/prop-types */
import invariant from 'invariant';
import rpt from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
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
      <div
        className={evaluateClassNames({
          [block]: true,
          [this.props.className]: this.props.className
        })}
      >
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

function Header({ isOpen, toggle, style, children, className }) {
  let classNames = evaluateClassNames({
    [`${block}__header`]: true,
    [`${className}__header`]: className
  });

  if (!open) {
    classNames = evaluateClassNames({
      [`${block}__header`]: true,
      [`${className}__header`]: className,
      [`${block}__header__closed`]: true,
      [`${className}__header__closed`]: className
    });
  }

  return (
    <div onClick={toggle} className={classNames} style={style}>
      <span>{children}</span>

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

Collapsible.Header = Header;

function Content({ isOpen, className, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={evaluateClassNames({
        [`${block}__content`]: true,
        [className]: className
      })}
    >
      {children}
    </div>
  );
}

Collapsible.Content = Content;
