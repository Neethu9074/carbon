/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import BetaBadge from 'in-components/BetaBadge/BetaBadge';

import locals from './ActionlaneDialogPresenter.mless';

type ActionLaneDialogTitleProps = {
  title: string;
};

export default function ActionLaneDialogTitle({ title }: ActionLaneDialogTitleProps) {
  return (
    <div className={locals.dialogTitleComponent}>
      <h1 className={locals.dialogTitle}>{title}</h1>
      <BetaBadge />
    </div>
  );
}
