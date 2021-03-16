/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { setSetTimeoutFn, setClearTimeoutFn } from '@instana/observables/esm/timers';

// This is never unused! delete and die
import { setTimeout, clearTimeout } from 'in-services/chronos';

// configure @instana/observables to use chronos by default
setSetTimeoutFn(setTimeout);
setClearTimeoutFn(clearTimeout);
