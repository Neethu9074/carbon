/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useContext } from 'react';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { TimeConfig } from 'in-types';

// Just a small alias to make usage of time configs in React components a lot more explicit.
export default function useTimeConfig(): TimeConfig {
  return useContext(TimeConfigContext);
}
