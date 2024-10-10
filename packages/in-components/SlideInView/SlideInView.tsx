/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTransition } from 'transition-hook';
import classNames from 'classnames';

import DialogHeaderComponent from 'in-components/SlideInView/internalComponents/DialogHeader';
import ListHeaderComponent from 'in-components/SlideInView/internalComponents/ListHeader';
import { getInteractiveElements } from 'in-services/util/dom';

import locals from './SlideInView.mless';

export const DialogHeader = DialogHeaderComponent;
export const ListHeader = ListHeaderComponent;
export const NoHeader = () => null;

interface SlideInViewProps {
  onAfterSlideIn?: (elements: ReturnType<typeof getInteractiveElements>) => void;
  onAfterSlideOut?: (elements: ReturnType<typeof getInteractiveElements>) => void;
  onShowSlideInContentChange?: (f: boolean) => void;
  showSlideInContent?: boolean;
  shouldTriggerWindowResize?: boolean;
  /**
   * Default to define slide–in content.
   * If you need a footer for the slide–in content, please use renderSlideInContent callback instead.
   */
  slideInContent?: React.ReactNode;
  slideInContentTitle?: React.ReactNode;
  slideTransitionDurationMillis?: number;
  staticContent: React.ReactNode;
  HeaderComponent?: typeof DialogHeader | typeof ListHeader | typeof NoHeader;
  enforceMaxHeightForStaticContent?: boolean;
  /**
   * Callback to add sliden–in content.
   * It gets a render callback injected which can be used to add the sticky footer to the slide–in content.
   *
   * Use this only if you need to add a footer.
   */
  renderSlideInContent?: (setSlideInFooter: (footer: ReactNode) => void) => React.ReactElement;
}

export default function SlideInView({
  // Content description
  staticContent,
  slideInContent,
  renderSlideInContent,
  HeaderComponent = DialogHeader,
  slideInContentTitle,

  // state / interactivity
  showSlideInContent,
  onShowSlideInContentChange,
  onAfterSlideIn = focusFirstInteractiveElement,
  onAfterSlideOut = focusFirstInteractiveElement,

  // Behavior modification
  slideTransitionDurationMillis = 500,
  enforceMaxHeightForStaticContent,
  shouldTriggerWindowResize
}: SlideInViewProps) {
  const [slideInContentFooter, setSlideInContentFooter] = React.useState<ReactNode>(null);
  const setSlideInFooter = useCallback((footer: ReactNode) => setSlideInContentFooter(footer), []);
  const slideInContentFooterRef = useRef<HTMLDivElement>(null);

  // To ensure that the states' showSlideInContent field matches the possible values provided by
  // component users. Not doing this causes the state to be different and therefore a transition
  // to trigger in unwanted cases.
  showSlideInContent = Boolean(showSlideInContent);
  const { stage } = useTransition(showSlideInContent, slideTransitionDurationMillis);

  const headerSize = HeaderComponent === NoHeader ? 0 : HeaderComponent === DialogHeader ? '5rem' : '3.5rem'; // TODO: use dynamic sizing here

  // Refs used to allow identification of interactive element for focus handling
  // support.
  const staticContentWrapperRef = useRef<HTMLDivElement>(null);
  const slideInContentWrapperRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // An optional side effect that should be executed after a React render, but before
  // the browser render cycle ends.
  useLayoutEffect(
    () => {
      if (showSlideInContent) {
        onAfterSlideIn(getInteractiveElements(slideInContentWrapperRef.current));

        if (shouldTriggerWindowResize && !isElementInViewport(slideContainerRef.current)) {
          dispatchResizeEvent();
        }
      } else {
        onAfterSlideOut(getInteractiveElements(staticContentWrapperRef.current));
      }

      return () => {
        if (shouldTriggerWindowResize) {
          window.removeEventListener('resize', dispatchResizeEvent);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showSlideInContent, shouldTriggerWindowResize]
  );

  const [showScrollShadow, setShowScrollShadow] = useState(false);

  return (
    <div ref={slideContainerRef} className={locals.container}>
      <div
        ref={staticContentWrapperRef}
        className={classNames({
          [locals.staticContent]: true,
          [locals.enforceMaxHeightForStaticContent]: enforceMaxHeightForStaticContent
        })}
        style={{
          transition: `${slideTransitionDurationMillis}ms`,
          visibility: stage === 'enter' ? 'hidden' : 'visible'
        }}
      >
        {staticContent}
      </div>
      <div
        className={locals.inputBlocker}
        style={{
          transition: `${slideTransitionDurationMillis}ms`,
          visibility: stage === 'enter' ? 'visible' : 'hidden'
        }}
      />
      <div
        className={locals.header}
        style={{
          transition: `${slideTransitionDurationMillis}ms`,
          visibility: stage === 'enter' ? 'visible' : 'hidden'
        }}
      >
        {slideInContentTitle && (
          <HeaderComponent
            scrollShadow={showScrollShadow}
            title={slideInContentTitle}
            onTitleIconClick={onShowSlideInContentChange && (() => onShowSlideInContentChange(!showSlideInContent))}
          />
        )}
      </div>
      <div
        ref={slideInContentWrapperRef}
        className={locals.slideInContent}
        style={{
          top: headerSize,
          transition: `${slideTransitionDurationMillis}ms`,
          visibility: stage === 'enter' ? 'visible' : 'hidden',
          transform: {
            from: 'translateX(0%)',
            enter: 'translateX(-100%)',
            leave: 'translateX(0%)'
          }[stage]
        }}
        onScrollCapture={e => setShowScrollShadow(e.target instanceof HTMLElement && e.target.scrollTop > 0)}
      >
        <div className={locals.slideInContentScrollContainer}>
          {slideInContent ?? renderSlideInContent?.(setSlideInFooter)}
        </div>
        {slideInContentFooter && (
          <div ref={slideInContentFooterRef} className={locals.footer}>
            {slideInContentFooter}
          </div>
        )}
      </div>
    </div>
  );
}

function focusFirstInteractiveElement(interactiveElements: HTMLElement[]): void {
  interactiveElements[0]?.focus?.({
    preventScroll: true
  });
}

function dispatchResizeEvent() {
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
}

function isElementInViewport(element: HTMLDivElement | null) {
  if (!element) {
    return false;
  }

  const bounding = element.getBoundingClientRect();

  return (
    bounding &&
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}
