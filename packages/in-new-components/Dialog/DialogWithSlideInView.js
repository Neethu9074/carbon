import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import classNames from 'classnames';
import SlideInView from 'in-new-components/SlideInView/SlideInView';
import Header from 'in-new-components/Dialog/Header';

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
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick,
  onSlideInViewTitleClick,
  slideInViewTitle,
  slideInViewComponent,
  slideInViewVisible
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
        onScroll={e => setScrollshadow(e.target.scrollTop > 0)}
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
                  [locals.showOverflow]: showOverflow
                })}
              >
                {children}
              </div>
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
  title: PropTypes.string,
  titleIconType: PropTypes.string,
  withoutBodyPadding: PropTypes.bool,
  doNotCloseOnOutsideClick: PropTypes.bool,
  onSlideInViewTitleClick: PropTypes.func,
  slideInViewTitle: PropTypes.string,
  slideInViewComponent: PropTypes.node,
  slideInViewVisible: PropTypes.bool
};
