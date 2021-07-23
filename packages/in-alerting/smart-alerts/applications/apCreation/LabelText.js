/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import locals from './LabelText.mless';

export default function LabelText({ children, asSubText }) {
  return <span className={asSubText ? locals.subLabel : locals.label}>{children}</span>;
}

LabelText.propTypes = {
  asSubText: PropTypes.bool,
  children: PropTypes.node
};
