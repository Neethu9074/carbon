/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';

import { IdNamePair } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { CustomEventSpecification, Nullish, ThresholdRule } from 'in-types';

export const ruleTypeEntityVerification: string;
export const ruleTypeEntityCountVerification: string;
export const ruleTypeHostAvailability: string;
export const ruleTypeEntityCount: string;
export const dataSourceCustom: string;
export const dataSourceBuiltIn: string;
export const dataSourceSystem: string;

export const entityCountDetection: IdNamePair;
export const entityCountVerification: IdNamePair;

export function createEventFormDefinition(mutableEvent: CustomEventSpecification, isCreate?: boolean): MapForm;

export function putMetricPatternPlaceholder(form: MapForm, metricPlaceholderValue?: string | Nullish): MapForm;
export function isPercentile(form: MapForm): boolean;

export function putMetricDataSourceFieldsForOneRule(
  entityType: string,
  ruleLikeOrEmpty: Partial<ThresholdRule>
): MapForm;

export function canHaveMultipleConditions(form: MapForm): boolean;
