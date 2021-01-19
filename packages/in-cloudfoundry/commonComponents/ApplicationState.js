/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Capitalize from 'in-new-components/Capitalize';

import locals from './ApplicationState.mless';

export default function ApplicationState({ state }) {
  return <Capitalize className={locals[state]}>{state}</Capitalize>;
}
