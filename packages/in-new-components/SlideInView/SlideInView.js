import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import DialogHeaderComponent from 'in-new-components/SlideInView/internalComponents/DialogHeader';
import ListHeaderComponent from 'in-new-components/SlideInView/internalComponents/ListHeader';
import { slideInStates, slideOutStates } from 'in-new-components/SlideInView/states';
import { supportsFocussingWithPreventedScrolling } from 'in-services/util/domFocus';
import { getInteractiveElements } from 'in-services/util/dom';

import locals from './SlideInView.mless';

export const DialogHeader = DialogHeaderComponent;
export const ListHeader = ListHeaderComponent;
export const NoHeader = () => false;

export default function SlideInView({
  // Content description
  staticContent,
  slideInContent,
  HeaderComponent = DialogHeader,
  slideInContentTitle,

  // state / interactivity
  showSlideInContent,
  onShowSlideInContentChange,
  onAfterSlideIn = focusFirstInteractiveElement,
  onAfterSlideOut = focusFirstInteractiveElement,

  // Behavior modification
  slideTransitionDurationMillis = 500,
  enforceMaxHeightForStaticContent
}) {
  // To ensure that the states' showSlideInContent field matches the possible values provided by
  // component users. Not doing this causes the state to be different and therefore a transition
  // to trigger in unwanted cases.
  showSlideInContent = Boolean(showSlideInContent);

  const headerSize = HeaderComponent === NoHeader ? 0 : HeaderComponent === DialogHeader ? '5rem' : '3.5rem';

  // Refs used to allow identification of interactive element for focus handling
  // support.
  const staticContentWrapperRef = useRef();
  const slideInContentWrapperRef = useRef();

  // An optional side effect that should be executed after a React render, but before
  // the browser render cycle ends.
  const afterStateChangeEffect = useRef();
  useLayoutEffect(() => afterStateChangeEffect.current?.(), [afterStateChangeEffect.current]);

  const [state, setState] = useState(slideOutStates.after(slideTransitionDurationMillis));
  useLayoutEffect(() => {
    if (showSlideInContent === state.showSlideInContent) {
      // Nothing to do – only important for initial render call.
      return;
    }
    afterStateChangeEffect.current = null;

    const timeouts = [];
    if (showSlideInContent) {
      const afterStateChangeEffectFn = () => onAfterSlideIn(getInteractiveElements(slideInContentWrapperRef.current));
      if (supportsFocussingWithPreventedScrolling) {
        // Side-effect are very likely to make use of preventScroll: true. Unfortunately
        // preventScroll: true is not yet supported in all web browsers. For web browsers which
        // do not support focussing with disabled scrolling we schedule the side-effect after the
        // transition has ended. This ensures that the web browser does not accelerate/does not break
        // the side effect.
        afterStateChangeEffect.current = afterStateChangeEffectFn;
      }
      setState(slideInStates.before(slideTransitionDurationMillis));
      timeouts.push(setTimeout(() => setState(slideInStates.transition(slideTransitionDurationMillis)), 0));
      timeouts.push(
        setTimeout(() => {
          if (!supportsFocussingWithPreventedScrolling) {
            afterStateChangeEffect.current = afterStateChangeEffectFn;
          }
          setState(slideInStates.after(slideTransitionDurationMillis));
        }, slideTransitionDurationMillis)
      );
    } else {
      afterStateChangeEffect.current = () => {
        onAfterSlideOut(getInteractiveElements(staticContentWrapperRef.current));
      };
      setState(slideOutStates.before(slideTransitionDurationMillis));
      timeouts.push(setTimeout(() => setState(slideOutStates.transition(slideTransitionDurationMillis)), 0));
      timeouts.push(
        setTimeout(() => setState(slideOutStates.after(slideTransitionDurationMillis)), slideTransitionDurationMillis)
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, [showSlideInContent]);

  const [showScrollShadow, setShowScrollShadow] = useState(false);

  return (
    <div className={locals.container}>
      <div
        ref={staticContentWrapperRef}
        className={classNames({
          [locals.staticContent]: true,
          [locals.enforceMaxHeightForStaticContent]: enforceMaxHeightForStaticContent
        })}
        style={state.staticContentStyle}
      >
        {staticContent}
      </div>
      <div className={locals.inputBlocker} style={state.inputBlockerStyle} />
      <div className={locals.header} style={state.headerStyle}>
        {slideInContentTitle && (
          <HeaderComponent
            scrollShadow={showScrollShadow}
            title={slideInContentTitle}
            onTitleIconClick={() => onShowSlideInContentChange(!showSlideInContent)}
          />
        )}
      </div>
      <div
        ref={slideInContentWrapperRef}
        className={locals.slideInContent}
        style={{
          ...state.slideInContentStyle,
          top: headerSize
        }}
        onScroll={e => setShowScrollShadow(e.target.scrollTop > 0)}
      >
        {slideInContent}
      </div>
    </div>
  );
}

SlideInView.propTypes = {
  onAfterSlideIn: PropTypes.func,
  onAfterSlideOut: PropTypes.func,
  onShowSlideInContentChange: PropTypes.func.isRequired,
  showSlideInContent: PropTypes.bool,
  slideInContent: PropTypes.node,
  slideInContentTitle: PropTypes.node,
  slideTransitionDurationMillis: PropTypes.number,
  staticContent: PropTypes.node.isRequired,
  HeaderComponent: PropTypes.oneOf([DialogHeader, ListHeader, NoHeader]),
  enforceMaxHeightForStaticContent: PropTypes.bool
};

function focusFirstInteractiveElement(interactiveElements) {
  interactiveElements[0]?.focus?.({
    preventScroll: true
  });
}
