import PropTypes from 'prop-types';
import React, { useState, useRef, useLayoutEffect } from 'react';

import DialogHeaderComponent from 'in-new-components/SlideInView/internalComponents/DialogHeader';
import ListHeaderComponent from 'in-new-components/SlideInView/internalComponents/ListHeader';

import { slideInStates, slideOutStates } from 'in-new-components/SlideInView/states';

import locals from './SlideInView.mless';

export const DialogHeader = DialogHeaderComponent;
export const ListHeader = ListHeaderComponent;

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
  slideTransitionDurationMillis = 500
}) {
  // To ensure that the states' showSlideInContent field matches the possible values provided by
  // component users. Not doing this causes the state to be different and therefore a transition
  // to trigger in unwanted cases.
  showSlideInContent = Boolean(showSlideInContent);

  const headerSize = HeaderComponent === DialogHeader ? '5rem' : '3.5rem';

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
      afterStateChangeEffect.current = () => {
        onAfterSlideIn(getInteractiveElements(slideInContentWrapperRef.current));
      };
      setState(slideInStates.before(slideTransitionDurationMillis));
      timeouts.push(setTimeout(() => setState(slideInStates.transition(slideTransitionDurationMillis)), 0));
      timeouts.push(
        setTimeout(() => setState(slideInStates.after(slideTransitionDurationMillis)), slideTransitionDurationMillis)
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
      <div ref={staticContentWrapperRef} className={locals.staticContent} style={state.staticContentStyle}>
        {staticContent}
      </div>
      <div className={locals.inputBlocker} style={state.inputBlockerStyle} />
      <div className={locals.header} style={state.headerStyle}>
        <HeaderComponent
          scrollShadow={showScrollShadow}
          title={slideInContentTitle}
          onTitleIconClick={() => onShowSlideInContentChange(!showSlideInContent)}
        />
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
  showSlideInContent: PropTypes.bool.isRequired,
  slideInContent: PropTypes.node,
  slideInContentTitle: PropTypes.node,
  slideTransitionDurationMillis: PropTypes.number,
  staticContent: PropTypes.node.isRequired,
  HeaderComponent: PropTypes.oneOf([DialogHeader, ListHeader])
};

function getInteractiveElements(parent) {
  return Array.prototype.slice
    .call(parent.querySelectorAll('a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'))
    .filter(element => !element.hasAttribute('disabled') && element.clientWidth > 0);
}

function focusFirstInteractiveElement(interactiveElements) {
  interactiveElements[0]?.focus?.({
    preventScroll: true
  });
}
