/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

export const resourceQuotaPercentage = d => (d < 0 ? 'No resource quota' : percentageTwoDecimalPlaces(d));
export const resourceQuotaBytes = d => (d < 0 ? 'No resource quota' : bytesTwoDecimalPlaces(d));
export const resourceQuotaTwoDecimalPlaces = d => (d < 0 ? 'No resource quota' : twoDecimalPlaces(d));
export const resourceQuotaZeroDecimalPlaces = d => (d < 0 ? 'No resource quota' : zeroDecimalPlaces(d));
