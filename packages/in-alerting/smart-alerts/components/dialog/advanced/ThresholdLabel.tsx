/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import locals from './ThresholdLabel.mless';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export default function ThresholdLabel({ className, ...otherProps }: Props) {
  return <span className={classNames(locals.label, className)} {...otherProps} />;
}
