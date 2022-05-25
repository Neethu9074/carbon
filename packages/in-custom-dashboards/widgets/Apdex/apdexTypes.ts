/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexEntityApdexType } from 'in-types';

export type ApdexEntityTypes = Lowercase<ApdexEntityApdexType>;
export const AvailableEntityTypes: readonly ApdexEntityTypes[] = Object.freeze(['website'] as const);
