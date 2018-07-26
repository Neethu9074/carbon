import { create, just, timeout } from 'reactive-observables';
import React, { Fragment } from 'react';
import { throttle } from 'lodash';

import OverlayMounter from 'in-new-components/overlays/OverlayMounter';
import { identifyOverlay } from 'in-new-components/overlays/dom';
import { generateUniqueShortId } from 'in-services/util/id';

import { emptyObject } from 'in-services/fixedObjects';

// Usage:
// <Overlay content={Component} props={{}} autoOpen wrapperStyle wrapperClassName kind="tooltip">
//   ({isOpen, close, open, toggle}) => <div></div>
// </Overlay>

export default class Overlay extends React.Component {
  state = {
    isOpen: false,
    id: generateUniqueShortId()
  };

  toggle = () => this.setOpen(!this.state.isOpen);
  open = () => this.setOpen(true);
  close = () => this.setOpen(false);
  delayedAutoOpenStateChange$ = create();

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

  delayedOpen = () => this.delayedAutoOpenStateChange$.emit(true);
  delayedClose = () => this.delayedAutoOpenStateChange$.emit(false);

  refSetter = r => {
    this.wrapper = r;
    const parentOverlayDomNode = identifyOverlay(r);
    if (parentOverlayDomNode) {
      this.parentOverlay = parentOverlayDomNode.dataset.overlayId;
    }
  };

  componentDidMount() {
    this.delayedOpenSubscription = this.delayedAutoOpenStateChange$
      .flatMap(open => {
        if (open) {
          return just(true);
        }
        return timeout(500).map(() => false);
      })
      .subscribe(open => this.setOpen(open));
  }

  componentWillUnmount() {
    this.delayedOpenSubscription.dispose();
  }

  render() {
    const {
      autoOpen,
      inContentArea,
      wrapperStyle,
      wrapperClassName,
      withoutWrapper,
      withoutArrow,
      position = 'absolute',
      kind,
      children: Content,
      props = emptyObject,
      content: OverlayContent
    } = this.props;
    const { isOpen, id } = this.state;
    const autoClose = this.props.autoClose === undefined ? autoOpen : this.props.autoClose;

    let content;
    if (withoutWrapper) {
      content = (
        <Content
          isOpen={isOpen}
          toggle={this.toggle}
          open={this.open}
          delayedOpen={this.delayedOpen}
          close={this.close}
          delayedClose={this.delayedClose}
          {...props}
          refSetter={this.refSetter}
        />
      );
    } else {
      content = (
        <div
          style={wrapperStyle}
          className={wrapperClassName}
          onMouseEnter={autoOpen ? this.delayedOpen : undefined}
          onMouseLeave={autoClose ? this.delayedClose : undefined}
          ref={this.refSetter}
        >
          <Content isOpen={isOpen} toggle={this.toggle} open={this.open} close={this.close} {...props} />
        </div>
      );
    }

    return (
      <Fragment>
        {isOpen &&
          this.wrapper && (
            <OverlayMounter
              id={id}
              content={OverlayContent}
              props={{
                ...props,
                close: this.close
              }}
              relativeTo={this.wrapper}
              parentOverlay={this.parentOverlay}
              position={position}
              kind={kind}
              close={this.close}
              delayedOpen={this.delayedOpen}
              delayedClose={this.delayedClose}
              autoOpen={autoOpen}
              autoClose={autoClose}
              withoutArrow={withoutArrow}
              inContentArea={inContentArea}
            />
          )}
        {content}
      </Fragment>
    );
  }
}
