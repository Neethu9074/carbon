/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Nullish } from 'in-types';

export const ruleTypeEntityVerification: string;
export const ruleTypeHostAvailability: string;
export const dataSourceCustom: string;
export const dataSourceBuiltIn: string;
export const dataSourceSystem: string;

export function putMetricPatternPlaceholder(form: MapForm, metricPlaceholderValue?: string | Nullish): MapForm;
export function isPercentile(form: MapForm): boolean;
