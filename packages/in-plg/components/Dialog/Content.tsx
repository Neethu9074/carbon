/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import locals from 'in-plg/components/Dialog/Dialog.mless';

interface Props {
  children: React.ReactNode;
}

const DialogContent = (props: Props) => {
  const { children } = props;

  return <section className={locals.dialogContentWrapper}>{children}</section>;
};

export default DialogContent;
