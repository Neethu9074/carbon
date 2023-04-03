/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import locals from './Tag.mless';

export default function Tag({ tag }: { tag: string }) {
  return <div className={locals.automationTag}>{tag}</div>;
}
