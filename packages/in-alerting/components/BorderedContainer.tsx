/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import locals from 'in-alerting/components/BorderedContainer.mless';

const BorderedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={locals.container}>{children}</div>;
};
export default BorderedContainer;
