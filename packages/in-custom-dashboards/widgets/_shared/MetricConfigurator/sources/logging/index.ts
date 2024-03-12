/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentageDetailed } from 'in-stores/metric/formatters';
import FormComponent from './FormComponent';
import { t } from 'in-i18n';

export { createForm } from './form';
export const source = 'LOG';
export const label = t('in-custom-dashboards:widgets.srcLogging.index.logging');
export const visible = true;
export const defaultFormatterId = percentageDetailed.id;

export const Form = FormComponent;
