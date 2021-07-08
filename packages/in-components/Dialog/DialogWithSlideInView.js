/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import SlideInView from 'in-components/SlideInView/SlideInView';
import Header from 'in-components/Dialog/Header';

import locals from './Dialog.mless';

export default function DialogWithSlideInView({
  title,
  titleIconType,
  onClose,
  onTitleIconClick,
  children,
  className,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  removeBottomPaddingWhenFooterIsShown,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick,
  onSlideInViewTitleClick,
  slideInViewTitle,
  slideInViewComponent,
  slideInViewVisible,
  footer
}) {
  const [scrollshadow, setScrollshadow] = useState(false);

  const resetScrollShadow = () => {
    setScrollshadow(false);
  };

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section
        className={classNames(locals.dialog, className)}
        onClick={stopPropagation}
        onScrollCapture={e => setScrollshadow(e.target.scrollTop > 0)}
      >
        <SlideInView
          onShowSlideInContentChange={onSlideInViewTitleClick}
          slideInContentTitle={slideInViewTitle}
          slideInContent={slideInViewComponent}
          showSlideInContent={slideInViewVisible}
          staticContent={
            <>
              {!headless && (
                <Header
                  icon={titleIconType}
                  onIconClick={onTitleIconClick}
                  title={title}
                  renderCustomCloseBehaviour={() => {
                    return renderCustomCloseBehaviour && renderCustomCloseBehaviour(resetScrollShadow);
                  }}
                  onClose={onClose}
                  addScrollShadow={scrollshadow}
                />
              )}
              <div
                className={classNames({
                  [locals.body]: true,
                  [locals.withoutPadding]: withoutBodyPadding,
                  [locals.withoutBottomPadding]:
                    withoutBodyPadding ?? (removeBottomPaddingWhenFooterIsShown && !slideInViewVisible && footer),
                  [locals.showOverflow]: showOverflow,
                  [locals.withRoundedBottomBorder]: slideInViewVisible || !footer
                })}
              >
                {children}
              </div>

              {!slideInViewVisible && footer}
            </>
          }
        />
      </section>
    </div>
  );
}

DialogWithSlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  renderCustomCloseBehaviour: PropTypes.func,
  headless: PropTypes.bool,
  onClose: PropTypes.func,
  onTitleIconClick: PropTypes.func,
  showOverflow: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  titleIconType: PropTypes.string,
  withoutBodyPadding: PropTypes.bool,
  removeBottomPaddingWhenFooterIsShown: PropTypes.bool,
  doNotCloseOnOutsideClick: PropTypes.bool,
  onSlideInViewTitleClick: PropTypes.func,
  slideInViewTitle: PropTypes.string,
  slideInViewComponent: PropTypes.node,
  slideInViewVisible: PropTypes.bool,
  footer: PropTypes.node
};
