/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export const greaterThanZeroFormatter = value => (value < 0 ? '—' : zeroDecimalPlaces(value));
