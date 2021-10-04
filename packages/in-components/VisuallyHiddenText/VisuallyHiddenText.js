/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import locals from './VisuallyHiddenText.mless';

export default function VisuallyHiddenText({ text }) {
  return <span className={locals.visuallyHidden}>{text}</span>;
}

VisuallyHiddenText.propTypes = {
  /**
   * Hidden text
   */
  text: PropTypes.string.isRequired
};
