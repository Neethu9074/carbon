/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['last_job_duration'],
    labels: ['Last Job Duration'],
    min: 0,
    formatter: number
  }
];
