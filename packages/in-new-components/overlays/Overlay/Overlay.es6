import React, { Fragment } from 'react';
import { throttle } from 'lodash';

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

  toggle = () => this.setOpen(!this.state.isOpen);
  open = () => this.setOpen(true);
  close = () => this.setOpen(false);

  /*
   * Avoid competing changes when toggling the menu. This issue occurs when the overlay
   * is open and a toggle button outside the overlay is clicked. Following this, two things
   * are happening.
   *
   * 1. The RootCloseWrapper click event will fire. Since the click is outside the overlay,
   *    this will close the overlay.
   * 2. The toggle click event fires. This will now invert the state. Since the overlay is
   *    already closed, this in turn makes it visible again.
   *
   * As a result of this, toggling would have no effect. To counteract this, we apply a
   * throttling with a very short duration. The only intention is to avoid these high
   * frequency competing updates.
   */
  setOpen = throttle(open => this.setState({ isOpen: open }), 10, {
    trailing: false
  });

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
