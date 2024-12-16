/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

// Metrics collection intervals for dcgm are usually not more than 2 minutes (120 seconds).
// 130000 ms is big enough to search the latest metric with a 10 seconds buffer.
export const WINDOW_FOR_LATEST_METRIC = 130000;
