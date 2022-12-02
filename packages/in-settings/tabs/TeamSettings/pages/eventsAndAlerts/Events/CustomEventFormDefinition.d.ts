/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';

import { CustomEventSpecification, Nullish, ThresholdRule } from 'in-types';

export const ruleTypeEntityVerification: string;
export const ruleTypeHostAvailability: string;
export const dataSourceCustom: string;
export const dataSourceBuiltIn: string;
export const dataSourceSystem: string;

export function createEventFormDefinition(mutableEvent: CustomEventSpecification, isCreate?: boolean): MapForm;

export function putMetricPatternPlaceholder(form: MapForm, metricPlaceholderValue?: string | Nullish): MapForm;
export function isPercentile(form: MapForm): boolean;

export function putAllDataSourceFieldsForOneRule(entityType: string, ruleLikeOrEmpty: Partial<ThresholdRule>): MapForm;

export function canHaveMultipleConditions(form: MapForm): boolean;
