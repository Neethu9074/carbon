/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import Header from 'in-new-components/Dialog/Header';

import locals from './Dialog.mless';

export default function Dialog({
  className,
  title,
  titleIconType,
  onClose,
  onTitleIconClick,
  children,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick
}) {
  const [scrollshadow, setScrollshadow] = useState(false);

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section className={classNames(locals.dialog, className)} onClick={stopPropagation}>
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
          className={classNames(locals.body, locals.withRoundedBottomBorder, {
            [locals.withoutPadding]: withoutBodyPadding,
            [locals.showOverflow]: showOverflow
          })}
          onScroll={e => setScrollshadow(e.currentTarget?.scrollTop > 0)}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  renderCustomCloseBehaviour: PropTypes.func,
  headless: PropTypes.bool,
  onClose: PropTypes.func,
  onTitleIconClick: PropTypes.func,
  showOverflow: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleIconType: PropTypes.string,
  withoutBodyPadding: PropTypes.bool,
  doNotCloseOnOutsideClick: PropTypes.bool
};
