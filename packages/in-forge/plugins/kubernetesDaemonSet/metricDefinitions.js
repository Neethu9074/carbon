/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas', 'unavailableReplicas', 'misscheduledReplicas'],
    labels: ['Available', 'Desired', 'Unavailable', 'Misscheduled'],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: 'Available to Desired Percentage',
    min: 0,
    formatter: percentage
  }
];
