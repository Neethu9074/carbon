import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import SlideInView from 'in-new-components/SlideInView/SlideInView';
import IconButton from 'in-new-components/IconButton/IconButton';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BigHeaderDialog.mless';

export default function BigHeaderDialog({
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
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section className={joinClassNames(locals.dialog, className)} onClick={stopPropagation}>
        <SlideInView
          onTitleIconClick={onSlideInViewTitleClick}
          title={slideInViewTitle}
          sliderContent={slideInViewComponent}
          slideIn={slideInViewVisible}
        >
          {!headless && Header(titleIconType, onTitleIconClick, title, renderCustomCloseBehaviour, onClose)}
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

BigHeaderDialog.propTypes = {
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

function Header(titleIconType, onTitleIconClick, title, renderCustomCloseBehaviour, onClose) {
  return (
    <div className={locals.header}>
      {titleIconType ? (
        <div className={locals.customTitle}>
          {onTitleIconClick ? (
            <IconButton type={titleIconType} iconSize="l" onClick={onTitleIconClick} kind="info" leftAligned />
          ) : (
            <SvgIcon size="l" type={titleIconType} />
          )}
          <h1 className={locals.title}>{title}</h1>
        </div>
      ) : (
        <h1 className={locals.title}>{title}</h1>
      )}
      {renderCustomCloseBehaviour ? (
        <Fragment>
          <span className={locals.customCloseBehaviour}>{renderCustomCloseBehaviour()}</span>
        </Fragment>
      ) : (
        onClose && <IconButton type="lib_openclose_cancel" iconSize="l" onClick={onClose} kind="info" rightAligned />
      )}
    </div>
  );
}
