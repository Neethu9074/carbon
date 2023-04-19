/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './MetricValue.mless';

export default function MetricValue({ value, className }) {
  return <span className={classNames(locals.metricValue, className)}>{value}</span>;
}
