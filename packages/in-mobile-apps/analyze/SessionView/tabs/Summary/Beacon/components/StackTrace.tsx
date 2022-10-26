/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import RawStack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/RawStack';

export interface ChildrenProp {
  content: ReactNode;
}

export interface StackTraceProp {
  stackTrace: string;
  children: ({ content }: ChildrenProp) => void;
}

export default function StackTrace({ stackTrace, children }: StackTraceProp) {
  return children({
    content: <RawStack stack={stackTrace} />
  });
}
