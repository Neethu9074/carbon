/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const intParser = v => (v != null ? parseInt(v, 10) : 1);
export const numberParser = v => (v != null ? parseFloat(v) : 1);
