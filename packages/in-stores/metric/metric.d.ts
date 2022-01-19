/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { TimeConfig } from 'in-types';

export function getChartGranularity(tc: TimeConfig, maxDataPoints?: number, minGranularity?: number): number;

export const sensibleGranularities: number[];
