/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import locals from './ThresholdLabel.mless';

export default function ThresholdLabel({ className, ...otherProps }) {
  return <span className={classNames(locals.label, className)} {...otherProps} />;
}

ThresholdLabel.propTypes = {
  className: PropTypes.string
};
