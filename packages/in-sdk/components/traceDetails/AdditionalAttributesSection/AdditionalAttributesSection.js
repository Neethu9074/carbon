/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment } from 'react';

import locals from './AdditionalAttributesSection.mless';

export default function AdditionalAttributesSection({ title, children }) {
  return (
    <Fragment>
      <div className={locals.header}>{title}</div>
      {children}
    </Fragment>
  );
}
