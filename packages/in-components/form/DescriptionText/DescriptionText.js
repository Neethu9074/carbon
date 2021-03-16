/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './DescriptionText.mless';

export default function DescriptionText({ className, children }) {
  return <div className={classNames(className, locals.descriptionText)}>{children}</div>;
}
