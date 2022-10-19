/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { percentage, bytes, number } from 'in-services/formatters/number';

export const resourceQuotaPercentage = d => (d < 0 ? valueMissingPlaceholder : percentage.detailed(d));
export const resourceQuotaBytes = d => (d < 0 ? valueMissingPlaceholder : bytes.detailed(d));
export const resourceQuotaNumber = d => (d < 0 ? valueMissingPlaceholder : number.detailed(d));
export const resourceQuotaZeroDecimalPlaces = d => (d < 0 ? valueMissingPlaceholder : number.compact(d));
export const resourceQuotaTwoDecimalPlaces = d => (d < 0 ? valueMissingPlaceholder : number.detailed(d));
