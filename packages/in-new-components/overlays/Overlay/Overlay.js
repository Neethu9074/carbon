import { create, just, timeout } from '@instana/observables';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import React from 'react';

import OverlayMounter from 'in-new-components/overlays/OverlayMounter';
import { identifyOverlay } from 'in-new-components/overlays/dom';
import { generateUniqueShortId } from 'in-services/util/id';
import { emptyObject } from 'in-services/fixedObjects';

// Usage:
// <Overlay withoutWrapper content={Component} props={{}} autoOpen wrapperStyle wrapperClassName kind="tooltip">
//   {({isOpen, close, open, toggle, refSetter}) => <Button refSetter={refSetter} onClick={toggle}>Click to show</Button>}
// </Overlay>

export default class Overlay extends React.Component {
  state = {
    isOpen: false,
    id: generateUniqueShortId(),
    wrapper: null,
    parentOverlay: null
  };

  asyncCloseTimeouts = [];

  toggle = () => {
    const newState = !this.state.isOpen;
    this.setOpen(newState);
    if (!newState) {
      this.onClose();
    }
  };
  open = () => this.setOpen(true);
  close = e => {
    this.setOpen(false);
    this.onClose(e);
  };
  delayedAutoOpenStateChange$ = create();
  onClose = e => {
    this.props.onCloseSideEffect?.(e);
    if (this.props.focusOnClose) {
      this.state.wrapper?.focus();
    }
  };

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
  setOpen = throttle(
    open => {
      if (this.props.onToggle) {
        this.props.onToggle(open);
      }

      // The throttle call may finish after the component is already unmounted.
      // This is typically a sign for a memory leak, but not here. The only
      // reference is an expiring timer (via throttle). It is therefore fine
      // to protect like this from eventual state mutations after the component
      // is already unmounted.
      if (!this.unmounted) {
        this.setState({ isOpen: open });
      }
    },
    30,
    {
      trailing: false
    }
  );

  delayedOpen = () => this.delayedAutoOpenStateChange$.emit(true);
  delayedClose = () => this.delayedAutoOpenStateChange$.emit(false);
  asyncClose = () =>
    setTimeout(() => {
      if (!this.unmounted) {
        this.close();
      }
    }, 0);

  refSetter = r => {
    if (r === this.state.wrapper || !r) {
      // State updates on ref changes are an anti pattern. It can happen that we end up
      // in cyclic updates to our refs. A workaround to avoid this is to ignore at least
      // the ref clear events.
      //
      // In this specific case it is safe to do so because an non-existing DOM element could
      // never trigger an overlay.
      return;
    }

    const change = {
      wrapper: r
    };
    const parentOverlayDomNode = identifyOverlay(r);
    if (parentOverlayDomNode) {
      change.parentOverlay = parentOverlayDomNode.dataset.overlayId;
    }
    this.setState(change);
  };

  componentDidMount() {
    this.delayedOpenSubscription = this.delayedAutoOpenStateChange$
      .flatMap(open => {
        if (open) {
          return just(true);
        }
        return timeout(500).map(() => false);
      })
      .subscribe(open => {
        this.setOpen(open);
        if (!open) {
          this.props.onCloseSideEffect?.();
        }
      });
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.delayedOpenSubscription.dispose();
  }

  render() {
    const {
      autoOpen,
      inContentArea,
      behindSidebar,
      forceConfiguredAlignment,
      wrapperStyle,
      wrapperClassName,
      withoutWrapper,
      withoutArrow,
      kind,
      children,
      props = emptyObject,
      align = props.align,
      content: OverlayContent
    } = this.props;
    const { isOpen, id } = this.state;
    const autoClose = this.props.autoClose === undefined ? autoOpen : this.props.autoClose;

    let content;
    if (withoutWrapper) {
      content = children({
        isOpen: isOpen,
        toggle: this.toggle,
        open: this.open,
        delayedOpen: this.delayedOpen,
        close: this.close,
        delayedClose: this.delayedClose,
        ...props,
        refSetter: this.refSetter,
        ref: this.refSetter
      });
    } else {
      content = (
        <div
          style={wrapperStyle}
          className={wrapperClassName}
          onMouseEnter={autoOpen ? this.delayedOpen : undefined}
          onMouseLeave={autoClose ? this.delayedClose : undefined}
          ref={this.refSetter}
        >
          {children({
            isOpen,
            toggle: this.toggle,
            open: this.open,
            close: this.close,
            ...props
          })}
        </div>
      );
    }

    return (
      <>
        {isOpen && this.state.wrapper && (
          <OverlayMounter
            id={id}
            content={OverlayContent}
            props={{
              ...props,
              close: this.close,
              asyncClose: this.asyncClose
            }}
            relativeTo={this.state.wrapper}
            parentOverlay={this.state.parentOverlay}
            kind={kind}
            close={this.close}
            delayedOpen={this.delayedOpen}
            delayedClose={this.delayedClose}
            autoOpen={autoOpen}
            autoClose={autoClose}
            withoutArrow={withoutArrow}
            inContentArea={inContentArea}
            behindSidebar={behindSidebar}
            align={align}
            forceConfiguredAlignment={forceConfiguredAlignment}
          />
        )}
        {content}
      </>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.func.isRequired,
  content: PropTypes.any,
  align: PropTypes.oneOf([
    'leftBottom',
    'leftMiddle',
    'leftTop',
    'topLeft',
    'topMiddle',
    'topRight',
    'rightTop',
    'rightMiddle',
    'rightBottom',
    'bottomLeft',
    'bottomMiddle',
    'bottomRight',
    'auto',
    'mousePosition'
  ]),
  autoClose: PropTypes.bool,
  autoOpen: PropTypes.bool,
  forceConfiguredAlignment: PropTypes.bool,
  inContentArea: PropTypes.bool,
  behindSidebar: PropTypes.bool,
  kind: PropTypes.string,
  onToggle: PropTypes.func,
  onCloseSideEffect: PropTypes.func,
  focusOnClose: PropTypes.bool,
  withoutArrow: PropTypes.bool,
  withoutWrapper: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.object,
  props: PropTypes.any
};
