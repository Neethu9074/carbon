import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import SlideInView from 'in-new-components/SlideInView/LocalSlideInView';
import Header from 'in-new-components/BigHeaderDialog/Header';

import locals from './BigHeaderDialog.mless';

export default function BigHeaderDialogWithSlideInView({
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
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section
        className={joinClassNames(locals.dialog, className)}
        onClick={stopPropagation}
        onScroll={e => setScrollshadow(e.target.scrollTop > 0)}
      >
        <SlideInView
          onTitleIconClick={onSlideInViewTitleClick}
          title={slideInViewTitle}
          sliderContent={slideInViewComponent}
          slideIn={slideInViewVisible}
        >
          {!headless && (
            <Header
              icon={titleIconType}
              onIconClick={onTitleIconClick}
              title={title}
              renderCustomCloseBehaviour={renderCustomCloseBehaviour}
              onClose={onClose}
              addScrollShadow={scrollshadow}
            />
          )}
          <div
            className={evaluateClassNames({
              [locals.body]: true,
              [locals.withoutPadding]: withoutBodyPadding,
              [locals.showOverflow]: showOverflow
            })}
          >
            {children}
          </div>
        </SlideInView>
      </section>
    </div>
  );
}

BigHeaderDialogWithSlideInView.propTypes = {
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
