/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TimeConfig } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

interface LogsChartInteractionWrapperProps {
  tagFilterExpression: FormModelElement[];
  timeConfig: TimeConfig;
}
export function LogsChartInteractionWrapper({
  tagFilterExpression,
  timeConfig
}: LogsChartInteractionWrapperProps): JSX.Element;
export function tagEquals(tag: string, value: string): FormModelElement;
export function andQuery(...queries: FormModelElement[]): FormModelElement[];
