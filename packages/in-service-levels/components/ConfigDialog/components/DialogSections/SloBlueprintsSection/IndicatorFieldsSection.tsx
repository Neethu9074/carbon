/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { PropsWithChildren } from 'react';

import locals from './AggregationAndThresholdFormSection.mless';

export default function IndicatorFieldsSection({ children }: PropsWithChildren<{}>) {
  return <div className={locals.grid}>{children}</div>;
}
