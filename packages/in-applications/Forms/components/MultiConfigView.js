/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';

import locals from './MultiConfigView.mless';

export default function MultiConfigView({ viewSwitcher, configView }) {
  return (
    <LeftRightPadding>
      <div className={locals.viewSwitcher}>{viewSwitcher}</div>
      <div className={locals.splitter} />
      <div className={locals.configView}>{configView}</div>
    </LeftRightPadding>
  );
}
