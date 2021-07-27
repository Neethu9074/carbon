/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create } from '@instana/observables';

export const refreshSignalUsers = create<boolean>().emit(true);
