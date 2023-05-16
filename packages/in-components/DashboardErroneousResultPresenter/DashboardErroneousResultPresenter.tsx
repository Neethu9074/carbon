/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErroneousResultPresenter, { Props } from 'in-components/Errors/ErroneousResultPresenter';

import locals from './DashboardErroneousResultPresenter.mless';

export default function DashboardErroneousResultPresenter(props: Props) {
  return <ErroneousResultPresenter {...props} className={locals.wrapper} />;
}
