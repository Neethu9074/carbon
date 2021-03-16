/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import './MenuHeading.less';

const block = 'in-search-menu-heading';

export default function MenuHeading({ children, className }) {
  return <h1 className={classNames(className, block)}>{children}</h1>;
}
