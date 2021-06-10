/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';

import locals from './DashboardErroneousResultPresenter.mless';

export default function DashboardErroneousResultPresenter(props) {
  return <ErroneousResultPresenter {...props} className={locals.wrapper} />;
}
