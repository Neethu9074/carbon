/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Ref, RefCallback, MutableRefObject } from 'react';
import { throttle } from 'lodash';

import { create, Disposable, just, timeout } from '@instana/observables';
import { generateUniqueShortId } from '@instana/utils';

import { OverlayProps, OverlayState } from 'in-components/overlays/Overlay/types';
import OverlayMounter from 'in-components/overlays/OverlayMounter';
import { identifyOverlay } from 'in-components/overlays/dom';
import { emptyObject } from 'in-services/fixedObjects';

// Usage:
// <Overlay withoutWrapper content={Component} props={{}} autoOpen wrapperStyle wrapperClassName kind="tooltip">
//   {({isOpen, close, open, toggle, refSetter}) => <Button refSetter={refSetter} onClick={toggle}>Click to show</Button>}
// </Overlay>

export default class Overlay<FORWARDED_CONTENT_PROPS> extends React.Component<
  OverlayProps<FORWARDED_CONTENT_PROPS>,
  OverlayState
> {
  state: OverlayState = {
    isOpen: false,
    id: `overlay_${generateUniqueShortId()}`,
    wrapper: null,
    parentOverlay: null
  };

  asyncCloseTimeouts = [];
  unmounted: boolean = false;
  delayedOpenSubscription?: Disposable;

  toggle = () => {
    const newState = !this.state.isOpen;
    this.setOpen(newState);
    if (!newState) {
      this.onClose();
    }
  };

  open = () => this.setOpen(true);

  close = () => {
    this.setOpen(false);
    this.onClose();
  };

  delayedAutoOpenStateChange$ = create();

  onClose = () => {
    this.props.onCloseSideEffect?.();
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
    isOpen => {
      if (this.props.onToggle) {
        this.props.onToggle(isOpen);
      }

      // The throttle call may finish after the component is already unmounted.
      // This is typically a sign for a memory leak, but not here. The only
      // reference is an expiring timer (via throttle). It is therefore fine
      // to protect like this from eventual state mutations after the component
      // is already unmounted.
      if (!this.unmounted) {
        this.setState({ isOpen });
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

  refSetter: RefCallback<HTMLElement> | MutableRefObject<HTMLDivElement> = r => {
    if (r === this.state.wrapper || !r) {
      // State updates on ref changes are an anti pattern. It can happen that we end up
      // in cyclic updates to our refs. A workaround to avoid this is to ignore at least
      // the ref clear events.
      //
      // In this specific case it is safe to do so because an non-existing DOM element could
      // never trigger an overlay.
      return;
    }

    const change: OverlayState = {
      ...this.state,
      wrapper: r
    };
    const parentOverlayDomNode = identifyOverlay(r) as HTMLElement;
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
    this.delayedOpenSubscription?.dispose();
  }

  render() {
    const {
      align,
      autoOpen,
      behindSidebar,
      children: renderTriggerOverlayAction,
      content: OverlayContent,
      forceConfiguredAlignment,
      inContentArea,
      kind,
      props: forwardedProps = emptyObject,
      withoutArrow,
      withoutWrapper,
      wrapperClassName,
      wrapperStyle
    } = this.props;
    const { isOpen, id } = this.state;
    const autoClose = this.props.autoClose === undefined ? autoOpen : this.props.autoClose;

    let content;
    if (withoutWrapper) {
      content = renderTriggerOverlayAction({
        isOpen: isOpen,
        toggle: this.toggle,
        open: this.open,
        delayedOpen: this.delayedOpen,
        close: this.close,
        delayedClose: this.delayedClose,
        refSetter: this.refSetter,
        ref: this.refSetter as MutableRefObject<HTMLDivElement>
      });
    } else {
      content = (
        <div
          style={wrapperStyle}
          className={wrapperClassName}
          onMouseEnter={autoOpen ? this.delayedOpen : undefined}
          onMouseLeave={autoClose ? this.delayedClose : undefined}
          ref={this.refSetter as Ref<HTMLDivElement>}
        >
          {renderTriggerOverlayAction({
            isOpen,
            toggle: this.toggle,
            open: this.open,
            close: this.close
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
              ...forwardedProps,
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
