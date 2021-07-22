/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

interface ValidationBlockProps {
  children: React.ReactNode;
  className: string;
}

export default function ValidationBlock({ children, className }: ValidationBlockProps) {
  return <p className={classNames(block, className)}>{children}</p>;
}
