/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './MetricValue.mless';

interface Props {
  value?: ReactNode | undefined;
  className?: string;
}

export default function MetricValue({ value, className }: Props) {
  return <span className={classNames(locals.metricValue, className)}>{value}</span>;
}
