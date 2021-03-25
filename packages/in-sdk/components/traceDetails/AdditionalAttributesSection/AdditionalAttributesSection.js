/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import locals from './AdditionalAttributesSection.mless';

export default function AdditionalAttributesSection({ title, children }) {
  return (
    <>
      <div className={locals.header}>{title}</div>
      {children}
    </>
  );
}
