/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';

import locals from './HorizontalIndicatorLi.mless';

export default function HorizontalIndicatorLi({ progress }) {
  return (
    <li className={locals.listItem}>
      <HorizontalIndicator progress={progress} className={locals.indicator} />
    </li>
  );
}
