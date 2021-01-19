/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Li } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Section.mless';

export default function Section({ title, titleHtmlFor, hasError, icon, children, actions, useAlternateBg }) {
  let verticalPositionCorrection;

  return (
    <Li component="div" noAlternatingBg forceAlternateBg={useAlternateBg}>
      <div className={locals.section}>
        <label
          htmlFor={titleHtmlFor}
          className={classNames(locals.title, {
            [locals.hasError]: hasError
          })}
          style={verticalPositionCorrection}
        >
          {icon && <SvgIcon type={icon} />}
          <span className={locals.titleText}>{title}</span>
        </label>

        <div className={locals.content}>{children}</div>

        {actions && (
          <div className={locals.actions} style={verticalPositionCorrection}>
            {actions}
          </div>
        )}
      </div>
    </Li>
  );
}

Section.propTypes = {
  // Title is desired to be optional to implement some common UX patterns.
  title: PropTypes.node,
  titleHtmlFor: PropTypes.string,
  hasError: PropTypes.bool,
  icon: PropTypes.string,
  actions: PropTypes.node,
  useAlternateBg: PropTypes.bool,
  children: PropTypes.node.isRequired
};
