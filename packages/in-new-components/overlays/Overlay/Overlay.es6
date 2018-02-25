import React, { Fragment } from 'react';

import OverlayMounter from 'in-new-components/overlays/OverlayMounter';

import { emptyObject } from 'in-services/fixedObjects';

// Usage:
// <Overlay content={Component} props={{}} autoOpen wrapperStyle wrapperClassName kind="tooltip">
//   ({isOpen, close, open, toggle}) => <div></div>
// </Overlay>

export default class Overlay extends React.Component {
  state = {
    isOpen: false
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  refSetter = r => (this.wrapper = r);

  render() {
    const {
      autoOpen,
      wrapperStyle,
      wrapperClassName,
      withoutWrapper,
      withoutArrow,
      kind,
      children: Content,
      props = emptyObject,
      content: OverlayContent
    } = this.props;
    const { isOpen } = this.state;

    let content;
    if (withoutWrapper) {
      content = (
        <Content
          isOpen={isOpen}
          toggle={this.toggle}
          open={this.open}
          close={this.close}
          {...props}
          refSetter={this.refSetter}
        />
      );
    } else {
      content = (
        <div
          style={wrapperStyle}
          className={wrapperClassName}
          onMouseEnter={autoOpen ? this.open : undefined}
          onMouseLeave={autoOpen ? this.close : undefined}
          ref={this.refSetter}
        >
          <Content isOpen={isOpen} toggle={this.toggle} open={this.open} close={this.close} {...props} />
        </div>
      );
    }

    return (
      <Fragment>
        {isOpen && (
          <OverlayMounter
            content={OverlayContent}
            props={{
              ...props,
              close: this.close
            }}
            relativeTo={this.wrapper}
            kind={kind}
            close={this.close}
            withoutArrow={withoutArrow}
          />
        )}
        {content}
      </Fragment>
    );
  }
}
