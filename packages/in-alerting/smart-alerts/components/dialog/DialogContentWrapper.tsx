/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from 'in-alerting/smart-alerts/components/dialog/DialogContentWrapper.mless';

export default function DialogContentWrapper({ children }: { children: ReactNode }) {
  return <div className={classNames({ [locals.dialogSize75_85]: true })}>{children}</div>;
}
