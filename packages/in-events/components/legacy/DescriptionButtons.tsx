/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './DescriptionButtons.mless';

export default function DescriptionButtons({ children }) {
  return <div className={locals.buttons}>{children}</div>;
}
