/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useContext } from 'react';

import { TimeConfig } from '@instana/types';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';

// Just a small alias to make usage of time configs in React components a lot more explicit.
export default function useTimeConfig(): TimeConfig {
  return useContext(TimeConfigContext);
}
