/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Li } from '@instana/components';

import locals from './Section.mless';

export default function Section({
  title,
  titleHtmlFor,
  hasError,
  icon,
  children,
  actions,
  iconColor,
  useAlternateBg,
  titleWidth = '11rem'
}) {
  return (
    <Li component="div" noAlternatingBg forceAlternateBg={useAlternateBg}>
      <div className={locals.section}>
        <label
          htmlFor={titleHtmlFor}
          className={classNames(locals.title, {
            [locals.hasError]: hasError
          })}
          style={{
            '--titleWidth': titleWidth
          }}
        >
          {icon && <SvgIcon type={icon} color={iconColor} />}
          <span className={locals.titleText}>{title}</span>
        </label>

        <div className={locals.content}>{children}</div>

        {actions && <div className={locals.actions}>{actions}</div>}
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
  children: PropTypes.node.isRequired,
  iconColor: PropTypes.string,
  titleWidth: PropTypes.string
};
