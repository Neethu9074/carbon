/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import locals from './MemoryTotal.mless';

export function MemoryTotal({ count }) {
  return <div className={locals.flexWrapper}>{count >= 0 && <span>{bytesTwoDecimalPlaces(count)}</span>}</div>;
}
